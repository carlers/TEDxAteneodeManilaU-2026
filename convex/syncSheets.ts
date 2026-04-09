"use node";

/**
 * Google Sheets sync action.
 *
 * Creates / updates 4 tabs in the target spreadsheet:
 *   • Summary       — key stats snapshot
 *   • Pending Review — one row per pending registration
 *   • Verified      — one row per verified registration
 *   • Gate List     — one row per verified attendee, sorted by name (for check-in)
 *
 * Required Convex environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY  (full PEM; use \n for newlines)
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 */

import crypto from "node:crypto";
import { actionGeneric } from "convex/server";
import { api } from "./_generated/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Registration = {
  _id: string;
  referenceCode?: string;
  status?: string;
  createdAt: number;
  hearAbout: string[];
  emergencyContact?: string;
  encourageFacebookFollow: boolean;
  paymentProofUrl?: string | null;
  attendees: Array<{
    fullName: string;
    email: string;
    contactNumber: string;
    schoolAffiliation: string;
    participantType: string;
  }>;
  ticketLines: Array<{
    purchaseMode: string;
    attendeeIndices: number[];
    resolvedTierId: string;
    unitPriceAtSubmit: number;
    lineTotal: number;
  }>;
};

type RgbColor = { red: number; green: number; blue: number };
type SheetMap = Record<string, number>; // title → sheetId

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

const PARTICIPANT_LABELS: Record<string, string> = {
  atenean: "AMAn / Atenean / TEDx",
  scholar: "Scholar",
  non_atenean: "Non-Atenean",
};

const HEAR_ABOUT_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  friend_word_of_mouth: "Friend / Word of Mouth",
  organization_or_school: "Organization or School",
  email_blast: "Email Blast",
  class_or_professor: "Class / Professor",
  posters_or_physical: "Posters / Physical",
};

// ---------------------------------------------------------------------------
// Sheet definitions
// ---------------------------------------------------------------------------

const SHEETS = {
  summary: { title: "Summary",        tab: { red: 0.55, green: 0.55, blue: 0.55 } },
  pending: { title: "Pending Review",  tab: { red: 1.00, green: 0.75, blue: 0.00 } },
  verified:{ title: "Verified",        tab: { red: 0.20, green: 0.66, blue: 0.33 } },
  gate:    { title: "Gate List",       tab: { red: 0.26, green: 0.52, blue: 0.96 } },
} as const;

// TEDx red for data-tab headers
const HEADER_BG: RgbColor = { red: 0.86, green: 0.08, blue: 0.11 };
const WHITE: RgbColor     = { red: 1,    green: 1,    blue: 1    };
const GRAY_BG: RgbColor   = { red: 0.25, green: 0.25, blue: 0.25 };
const LIGHT_GRAY: RgbColor= { red: 0.93, green: 0.93, blue: 0.93 };

// ---------------------------------------------------------------------------
// JWT / OAuth
// ---------------------------------------------------------------------------

function base64urlEncode(data: Buffer | string): string {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as string, "utf8");
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function buildJWT(email: string, pem: string, scope: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64urlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlEncode(JSON.stringify({
    iss: email, scope, aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, iat: now,
  }));
  const input = `${header}.${payload}`;
  const sign  = crypto.createSign("SHA256");
  sign.update(input, "utf8");
  return `${input}.${base64urlEncode(sign.sign(pem))}`;
}

async function getAccessToken(email: string, pem: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: buildJWT(email, pem, "https://www.googleapis.com/auth/spreadsheets"),
    }),
  });
  if (!res.ok) throw new Error(`Google OAuth failed: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

// ---------------------------------------------------------------------------
// Sheets API helpers
// ---------------------------------------------------------------------------

async function sheetsGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Sheets GET failed: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function sheetsBatchUpdate(token: string, spreadsheetId: string, requests: unknown[]): Promise<unknown> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests }),
    },
  );
  if (!res.ok) throw new Error(`Sheets batchUpdate failed: ${await res.text()}`);
  return res.json();
}

async function sheetsBatchClear(token: string, spreadsheetId: string, ranges: string[]): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ranges }),
    },
  );
  if (!res.ok) throw new Error(`Sheets batchClear failed: ${await res.text()}`);
}

async function sheetsBatchWrite(
  token: string,
  spreadsheetId: string,
  valueRanges: Array<{ range: string; values: string[][] }>,
): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate?valueInputOption=RAW`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: valueRanges }),
    },
  );
  if (!res.ok) throw new Error(`Sheets batchWrite failed: ${await res.text()}`);
}

// ---------------------------------------------------------------------------
// Sheet management — ensure all 4 tabs exist, return their IDs
// ---------------------------------------------------------------------------

async function getOrCreateSheets(token: string, spreadsheetId: string): Promise<SheetMap> {
  const data = await sheetsGet<{
    sheets: Array<{ properties: { sheetId: number; title: string } }>;
  }>(token, `${spreadsheetId}?fields=sheets.properties`);

  const existing: SheetMap = Object.fromEntries(
    data.sheets.map((s) => [s.properties.title, s.properties.sheetId]),
  );

  const needed = Object.values(SHEETS).map((s) => s.title);
  const toAdd  = needed.filter((title) => !(title in existing));

  if (toAdd.length === 0) return existing;

  const addRequests = toAdd.map((title) => ({
    addSheet: { properties: { title } },
  }));

  const result = await sheetsBatchUpdate(token, spreadsheetId, addRequests) as {
    replies: Array<{ addSheet?: { properties: { sheetId: number; title: string } } }>;
  };

  const updated = { ...existing };
  for (const reply of result.replies) {
    if (reply.addSheet) {
      updated[reply.addSheet.properties.title] = reply.addSheet.properties.sheetId;
    }
  }
  return updated;
}

// ---------------------------------------------------------------------------
// Format all sheets — tab colors, frozen headers, bold header rows
// ---------------------------------------------------------------------------

function buildFormatRequests(sheetMap: SheetMap) {
  const requests: unknown[] = [];

  for (const [key, def] of Object.entries(SHEETS)) {
    const sheetId = sheetMap[def.title];
    if (sheetId === undefined) continue;

    // Tab colour
    requests.push({
      updateSheetProperties: {
        properties: { sheetId, tabColorStyle: { rgbColor: def.tab } },
        fields: "tabColorStyle",
      },
    });

    if (key === "summary") {
      // Summary has a different structure — bold title row, no freeze
      requests.push(boldRow(sheetId, 0, GRAY_BG, WHITE, 12));
      // Bold section labels at known row indices (2, 8, 14)
      for (const rowIdx of [2, 8, 14]) {
        requests.push(boldRow(sheetId, rowIdx, LIGHT_GRAY, { red: 0.1, green: 0.1, blue: 0.1 }, 9));
      }
    } else {
      // Data tabs: freeze + bold red header
      requests.push({
        updateSheetProperties: {
          properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
          fields: "gridProperties.frozenRowCount",
        },
      });
      requests.push(boldRow(sheetId, 0, HEADER_BG, WHITE, 10));
    }
  }

  return requests;
}

function boldRow(sheetId: number, rowIndex: number, bg: RgbColor, fg: RgbColor, fontSize: number) {
  return {
    repeatCell: {
      range: { sheetId, startRowIndex: rowIndex, endRowIndex: rowIndex + 1 },
      cell: {
        userEnteredFormat: {
          backgroundColor: bg,
          textFormat: { bold: true, foregroundColor: fg, fontSize },
        },
      },
      fields: "userEnteredFormat(backgroundColor,textFormat)",
    },
  };
}

// ---------------------------------------------------------------------------
// Data builders
// ---------------------------------------------------------------------------

function refCode(reg: Registration): string {
  return reg.referenceCode ?? `LEGACY-${reg._id.slice(0, 8)}`;
}

function phpAmount(n: number): string {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

function manilaTime(ts: number): string {
  return new Date(ts).toLocaleString("en-PH", { timeZone: "Asia/Manila" });
}

function regTotal(reg: Registration): number {
  return reg.ticketLines.reduce((s, l) => s + l.lineTotal, 0);
}

function attendeeTypes(reg: Registration): string {
  return reg.attendees
    .map((a) => PARTICIPANT_LABELS[a.participantType] ?? a.participantType)
    .join(", ");
}

// --- Summary ---

function buildSummary(registrations: Registration[]): string[][] {
  const verified = registrations.filter((r) => r.status === "verified");
  const pending  = registrations.filter((r) => r.status !== "verified");

  let totalRevenue = 0, verifiedRevenue = 0;
  let totalAttendees = 0;
  const typeCounts = { atenean: 0, scholar: 0, non_atenean: 0 };

  for (const reg of registrations) {
    const t = regTotal(reg);
    totalRevenue += t;
    if (reg.status === "verified") verifiedRevenue += t;
    totalAttendees += reg.attendees.length;
    for (const a of reg.attendees) {
      if (a.participantType in typeCounts) typeCounts[a.participantType as keyof typeof typeCounts]++;
    }
  }

  return [
    // Row 0 — title (bold, dark)
    ["TEDxAteneodeManilaU 2026 — Registration Summary", `Last synced: ${manilaTime(Date.now())}`],
    [""],
    // Row 2 — section (bold, light gray) ← matches boldRow index in buildFormatRequests
    ["REGISTRATIONS", ""],
    ["Total registrations",    String(registrations.length)],
    ["Verified",               String(verified.length)],
    ["Pending",                String(pending.length)],
    ["Verified rate",          registrations.length > 0
      ? `${Math.round((verified.length / registrations.length) * 100)}%`
      : "—"],
    [""],
    // Row 8 — section
    ["REVENUE", ""],
    ["Total collected",        phpAmount(totalRevenue)],
    ["Verified revenue",       phpAmount(verifiedRevenue)],
    ["Pending revenue",        phpAmount(totalRevenue - verifiedRevenue)],
    ["Avg per registration",   registrations.length > 0
      ? phpAmount(Math.round(totalRevenue / registrations.length))
      : "—"],
    [""],
    // Row 14 — section
    ["ATTENDEES BY TYPE", ""],
    ["Total attendees",        String(totalAttendees)],
    ["AMAn / Atenean / TEDx",  String(typeCounts.atenean)],
    ["Scholar",                String(typeCounts.scholar)],
    ["Non-Atenean",            String(typeCounts.non_atenean)],
  ];
}

// --- Registration table (Pending + Verified tabs) ---

const REG_HEADERS = [
  "Reference Code",
  "Submitted At",
  "# Attendees",
  "Names",
  "Emails",
  "Participant Types",
  "Purchase Mode",
  "Total (PHP)",
  "Emergency Contact",
  "Heard About",
  "Payment Proof URL",
];

function buildRegTable(registrations: Registration[]): string[][] {
  return [
    REG_HEADERS,
    ...registrations.map((reg) => {
      const total = regTotal(reg);
      const purchaseMode = reg.ticketLines[0]?.purchaseMode === "group_of_three"
        ? "Group of 3"
        : "Individual";
      return [
        refCode(reg),
        manilaTime(reg.createdAt),
        String(reg.attendees.length),
        reg.attendees.map((a) => a.fullName).join(" | "),
        reg.attendees.map((a) => a.email).join(" | "),
        attendeeTypes(reg),
        purchaseMode,
        phpAmount(total),
        reg.emergencyContact ?? "",
        reg.hearAbout.map((h) => HEAR_ABOUT_LABELS[h] ?? h).join(", "),
        reg.paymentProofUrl ?? "",
      ];
    }),
  ];
}

// --- Gate list (one row per verified attendee, sorted by name) ---

const GATE_HEADERS = [
  "Full Name",
  "Email",
  "Contact Number",
  "Reference Code",
  "Participant Type",
  "School / Affiliation",
  "Purchase Mode",
  "Submission Date",
];

function buildGateList(registrations: Registration[]): string[][] {
  const rows: string[][] = [];

  for (const reg of registrations) {
    if (reg.status !== "verified") continue;
    for (const attendee of reg.attendees) {
      const ticketLine = reg.ticketLines.find((l) =>
        l.attendeeIndices.includes(reg.attendees.indexOf(attendee)),
      );
      rows.push([
        attendee.fullName,
        attendee.email,
        attendee.contactNumber,
        refCode(reg),
        PARTICIPANT_LABELS[attendee.participantType] ?? attendee.participantType,
        attendee.schoolAffiliation,
        ticketLine?.purchaseMode === "group_of_three" ? "Group of 3" : "Individual",
        manilaTime(reg.createdAt),
      ]);
    }
  }

  rows.sort((a, b) => a[0].localeCompare(b[0]));
  return [GATE_HEADERS, ...rows];
}

// ---------------------------------------------------------------------------
// Exported action
// ---------------------------------------------------------------------------

export const syncToGoogleSheets = actionGeneric({
  args: {},
  handler: async (ctx): Promise<{ verified: number; pending: number; gateEntries: number }> => {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey       = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const spreadsheetId       = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!serviceAccountEmail || !rawPrivateKey || !spreadsheetId) {
      throw new Error(
        "Missing Google Sheets configuration. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID in Convex environment variables.",
      );
    }

    const privateKeyPem = rawPrivateKey.replace(/\\n/g, "\n");
    const token = await getAccessToken(serviceAccountEmail, privateKeyPem);

    // listAllRegistrations enforces admin auth
    const registrations = (await ctx.runQuery(
      api.registrations.listAllRegistrations,
    )) as Registration[];

    const verified = registrations.filter((r) => r.status === "verified");
    const pending  = registrations.filter((r) => r.status !== "verified");

    // 1. Ensure all 4 tabs exist
    const sheetMap = await getOrCreateSheets(token, spreadsheetId);

    // 2. Apply formatting (tab colors, bold headers, freeze)
    const formatRequests = buildFormatRequests(sheetMap);
    if (formatRequests.length > 0) {
      await sheetsBatchUpdate(token, spreadsheetId, formatRequests);
    }

    // 3. Clear all 4 tabs
    await sheetsBatchClear(token, spreadsheetId, [
      `${SHEETS.summary.title}!A:Z`,
      `${SHEETS.pending.title}!A:Z`,
      `${SHEETS.verified.title}!A:Z`,
      `${SHEETS.gate.title}!A:Z`,
    ]);

    // 4. Write all data in one batch
    const gateRows = buildGateList(registrations);
    await sheetsBatchWrite(token, spreadsheetId, [
      { range: `${SHEETS.summary.title}!A1`,  values: buildSummary(registrations) },
      { range: `${SHEETS.pending.title}!A1`,  values: buildRegTable(pending) },
      { range: `${SHEETS.verified.title}!A1`, values: buildRegTable(verified) },
      { range: `${SHEETS.gate.title}!A1`,     values: gateRows },
    ]);

    return {
      verified:    verified.length,
      pending:     pending.length,
      gateEntries: gateRows.length - 1, // subtract header
    };
  },
});
