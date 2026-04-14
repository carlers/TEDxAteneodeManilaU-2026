"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery, useAction, useConvexAuth } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { formatPhp } from "@/lib/ticketPricing";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AdminShell from "../components/AdminShell";

type RegistrationRecord = {
  _id: Id<"registrations">;
  _creationTime: number;
  referenceCode?: string;
  attendees: Array<{
    fullName: string;
    email: string;
    contactNumber: string;
    schoolAffiliation: string;
    participantType: "atenean" | "scholar" | "non_atenean";
  }>;
  hearAbout: string[];
  emergencyContact?: string;
  encourageFacebookFollow: boolean;
  dataPrivacyConsent: boolean;
  ticketLines: Array<{
    purchaseMode: "individual" | "group_of_three";
    attendeeIndices: number[];
    resolvedTierId: string;
    unitPriceAtSubmit: number;
    lineTotal: number;
  }>;
  paymentProofStorageId: string;
  paymentProofUrl?: string | null;
  createdAt: number;
  status?: "submitted" | "verified";
};

const participantTypeLabels: Record<
  RegistrationRecord["attendees"][number]["participantType"],
  string
> = {
  atenean: "AMAn / Atenean / TEDx",
  scholar: "Scholar",
  non_atenean: "Non-Atenean",
};

const hearAboutLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  friend_word_of_mouth: "Friend / Word of Mouth",
  organization_or_school: "Organization or School",
  email_blast: "Email Blast",
  class_or_professor: "Class / Professor",
  posters_or_physical: "Posters / Physical",
};

function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(registrations: RegistrationRecord[]) {
  const headers = [
    "Reference Code",
    "Status",
    "Submitted At",
    "# Attendees",
    "Registration Total (PHP)",
    "Primary Name",
    "Primary Email",
    "Primary Contact",
    "Primary School",
    "Primary Type",
    "All Names",
    "All Emails",
    "Ticket Tiers",
    "Emergency Contact",
    "Heard About",
    "Encourages FB Follow",
  ];

  const rows = registrations.map((reg) => {
    const total = reg.ticketLines.reduce((s, l) => s + l.lineTotal, 0);
    return [
      reg.referenceCode ?? `LEGACY-${reg._id.slice(0, 8)}`,
      reg.status ?? "submitted",
      formatDateTime(reg.createdAt),
      String(reg.attendees.length),
      String(total),
      reg.attendees[0]?.fullName ?? "",
      reg.attendees[0]?.email ?? "",
      reg.attendees[0]?.contactNumber ?? "",
      reg.attendees[0]?.schoolAffiliation ?? "",
      participantTypeLabels[reg.attendees[0]?.participantType ?? "atenean"] ?? "",
      reg.attendees.map((a) => a.fullName).join(" | "),
      reg.attendees.map((a) => a.email).join(" | "),
      reg.ticketLines.map((l) => l.resolvedTierId).join(" | "),
      reg.emergencyContact ?? "",
      reg.hearAbout.map((h) => hearAboutLabels[h] ?? h).join(", "),
      reg.encourageFacebookFollow ? "Yes" : "No",
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-tedx-muted-text">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-tedx-accent" : ""}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-tedx-muted-text">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AdminRegistrationsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  const registrations = useQuery(
    api.registrations.listRegistrations,
    isAuthenticated ? {} : "skip",
  ) as RegistrationRecord[] | undefined;

  const [selectedId, setSelectedId] = useState<Id<"registrations"> | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "verified">("all");
  const [search, setSearch] = useState("");
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState("");
  const [isDeletingRegistration, setIsDeletingRegistration] = useState(false);

  const updateRegistrationStatus = useMutation(api.registrations.updateRegistrationStatus);
  const deleteRegistration = useMutation(api.registrations.deleteRegistration);
  const syncToSheets = useAction(api.syncSheets.syncToGoogleSheets);

  const selectedRegistration = useQuery(
    api.registrations.getRegistration,
    isAuthenticated && selectedId ? { registrationId: selectedId } : "skip",
  ) as RegistrationRecord | null | undefined;

  useEffect(() => {
    if (!registrations || registrations.length === 0) return;
    if (!selectedId) setSelectedId(registrations[0]._id);
  }, [registrations, selectedId]);

  const selectedTotal = useMemo(() => {
    if (!selectedRegistration) return 0;
    return selectedRegistration.ticketLines.reduce((sum, line) => sum + line.lineTotal, 0);
  }, [selectedRegistration]);

  const stats = useMemo(() => {
    const records = registrations ?? [];
    const verified = records.filter((r) => r.status === "verified").length;
    const pending = records.length - verified;
    let totalRevenue = 0;
    let verifiedRevenue = 0;
    let totalAttendees = 0;
    const typeCounts = { atenean: 0, scholar: 0, non_atenean: 0 };

    for (const reg of records) {
      const regTotal = reg.ticketLines.reduce((s, l) => s + l.lineTotal, 0);
      totalRevenue += regTotal;
      if (reg.status === "verified") verifiedRevenue += regTotal;
      totalAttendees += reg.attendees.length;
      for (const a of reg.attendees) typeCounts[a.participantType]++;
    }

    return {
      total: records.length,
      verified,
      pending,
      totalRevenue,
      verifiedRevenue,
      pendingRevenue: totalRevenue - verifiedRevenue,
      totalAttendees,
      typeCounts,
    };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (registrations ?? []).filter((reg) => {
      const currentStatus = reg.status ?? "submitted";
      if (statusFilter !== "all" && currentStatus !== statusFilter) return false;
      if (!query) return true;
      const text = [
        reg.referenceCode ?? "",
        reg.attendees[0]?.fullName ?? "",
        reg.attendees[0]?.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [registrations, statusFilter, search]);

  const updateStatus = async (nextStatus: "submitted" | "verified") => {
    if (!selectedRegistration) return;
    try {
      setIsUpdatingStatus(true);
      await updateRegistrationStatus({
        registrationId: selectedRegistration._id,
        status: nextStatus,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncState("syncing");
      setSyncMessage("");
      const result = await syncToSheets({});
      setSyncMessage(
        `${result.verified} verified · ${result.pending} pending · ${result.gateEntries} gate entries`
      );
      setSyncState("success");
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Sync failed.");
      setSyncState("error");
    }
  };

  const handleDeleteRegistration = async () => {
    if (!selectedRegistration) return;
    const confirmed = window.confirm(
      `Delete registration ${selectedRegistration.referenceCode ?? selectedRegistration._id}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setIsDeletingRegistration(true);
      setErrorMessage("");
      await deleteRegistration({ registrationId: selectedRegistration._id });
      setSelectedId("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete registration.");
    } finally {
      setIsDeletingRegistration(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Auth states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <section className="min-h-[100dvh] bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">Checking authentication…</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-[100dvh] bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">
            You need to sign in with Google to access this page.
          </p>
          <button
            type="button"
            onClick={() => void signIn("google", { redirectTo: "/admin/registrations" })}
            className="mt-4 rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <AdminShell
      title="Admin Registrations"
      description="Protected by Convex authentication and admin checks."
      actions={
        <>
          <button
            type="button"
            disabled={!registrations || registrations.length === 0}
            onClick={() => exportCSV(registrations ?? [])}
            className="rounded-md border border-tedx-outline-strong px-3 py-2 text-xs font-bold uppercase hover:border-tedx-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            disabled={syncState === "syncing"}
            onClick={() => void handleSync()}
            className="rounded-md bg-tedx-accent px-3 py-2 text-xs font-bold uppercase hover:bg-tedx-accent-hover disabled:cursor-not-allowed disabled:bg-tedx-disabled"
          >
            {syncState === "syncing" ? "Syncing…" : "Sync to Google Sheets"}
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/17L7pViElIxl8wRKvmWujL3O7gYRCGpV1RcHXdAE6JrU/edit"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-tedx-outline-strong px-3 py-2 text-xs font-bold uppercase hover:border-tedx-accent"
          >
            Open Google Sheet
          </a>
        </>
      }
    >

        {/* Sync feedback */}
        {syncMessage && (
          <div
            className={`mt-3 rounded-lg border px-4 py-2 text-sm ${
              syncState === "success"
                ? "border-green-700 bg-green-950 text-green-400"
                : "border-tedx-accent bg-tedx-surface-deep text-tedx-accent"
            }`}
          >
            {syncState === "success" ? `✓ ${syncMessage}` : `✗ ${syncMessage}`}
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div className="mt-3 rounded-lg border border-tedx-accent bg-tedx-surface-deep px-4 py-2 text-sm text-tedx-accent">
            {errorMessage}
          </div>
        )}

        {/* Stats — row 1 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Registrations" value={stats.total} />
          <StatCard label="Total Attendees" value={stats.totalAttendees} />
          <StatCard label="Pending" value={stats.pending} sub={formatPhp(stats.pendingRevenue)} />
          <StatCard
            label="Verified"
            value={stats.verified}
            sub={formatPhp(stats.verifiedRevenue)}
            accent
          />
        </div>

        {/* Stats — row 2 */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Collected"
            value={formatPhp(stats.totalRevenue)}
            sub="all statuses"
          />
          <StatCard
            label="Verified Revenue"
            value={formatPhp(stats.verifiedRevenue)}
            sub="confirmed payments"
            accent
          />
          <StatCard
            label="Students"
            value={stats.typeCounts.atenean}
            sub={`${stats.typeCounts.scholar} Scholar`}
          />
          <StatCard label="Non-Atenean" value={stats.typeCounts.non_atenean} />
        </div>

        {/* Search + filter */}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, name, or email…"
            className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "submitted" | "verified")
            }
            className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>

        {/* Content */}
        {!registrations ? (
          <p className="mt-8 text-sm text-tedx-muted-text">Loading registrations…</p>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-[440px_1fr]">

            {/* List */}
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-3">
              <div className="mb-2 px-2 text-[10px] font-bold uppercase text-tedx-muted-text">
                {filteredRegistrations.length} record{filteredRegistrations.length !== 1 ? "s" : ""}
              </div>
              <div className="max-h-[620px] space-y-1.5 overflow-y-auto pr-1">
                {filteredRegistrations.map((reg) => {
                  const total = reg.ticketLines.reduce((s, l) => s + l.lineTotal, 0);
                  const currentStatus = reg.status ?? "submitted";
                  const isSelected = selectedId === reg._id;
                  return (
                    <button
                      key={reg._id}
                      type="button"
                      onClick={() => setSelectedId(reg._id)}
                      className={`block w-full rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-tedx-accent bg-tedx-surface-deep"
                          : "border-tedx-outline-strong bg-tedx-black hover:border-tedx-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {reg.attendees[0]?.fullName ?? "Unknown"}
                          </p>
                          <p className="truncate text-xs text-tedx-muted-text">
                            {reg.attendees[0]?.email ?? "No email"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-tedx-muted-text">
                            <span className="font-bold uppercase text-tedx-accent">
                              {reg.referenceCode ?? `LEGACY-${reg._id.slice(0, 8)}`}
                            </span>
                            <span>
                              {reg.attendees.length} attendee{reg.attendees.length !== 1 ? "s" : ""}
                            </span>
                            <span>{formatPhp(total)}</span>
                            <span>{formatDateShort(reg.createdAt)}</span>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                            currentStatus === "verified"
                              ? "bg-tedx-accent text-tedx-white"
                              : "bg-tedx-surface-deep text-tedx-muted-text"
                          }`}
                        >
                          {currentStatus === "verified" ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {filteredRegistrations.length === 0 && (
                <p className="px-2 py-4 text-sm text-tedx-muted-text">No matching records.</p>
              )}
            </div>

            {/* Detail panel */}
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              {!selectedRegistration ? (
                <p className="text-sm text-tedx-muted-text">
                  Select a registration to view details.
                </p>
              ) : (
                <div className="space-y-6">

                  {/* Reference + Actions */}
                  <div className="rounded-lg border border-tedx-outline-strong bg-tedx-black p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-tedx-muted-text">
                          Reference
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-tedx-accent">
                          {selectedRegistration.referenceCode ??
                            `LEGACY-${selectedRegistration._id.slice(0, 8)}`}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          (selectedRegistration.status ?? "submitted") === "verified"
                            ? "bg-tedx-accent text-tedx-white"
                            : "bg-tedx-surface-deep text-tedx-muted-text"
                        }`}
                      >
                        {(selectedRegistration.status ?? "submitted") === "verified"
                          ? "Verified"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-x-6 gap-y-1.5 text-xs text-tedx-muted-text sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-tedx-white">Submitted:</span>{" "}
                        {formatDateTime(selectedRegistration.createdAt)}
                      </p>
                      {selectedRegistration.emergencyContact && (
                        <p>
                          <span className="font-semibold text-tedx-white">Emergency contact:</span>{" "}
                          {selectedRegistration.emergencyContact}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold text-tedx-white">FB follow:</span>{" "}
                        {selectedRegistration.encourageFacebookFollow ? "Yes" : "No"}
                      </p>
                      {selectedRegistration.hearAbout.length > 0 && (
                        <p className="sm:col-span-2">
                          <span className="font-semibold text-tedx-white">Heard about via:</span>{" "}
                          {selectedRegistration.hearAbout
                            .map((h) => hearAboutLabels[h] ?? h)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          isUpdatingStatus || selectedRegistration.status === "verified"
                        }
                        onClick={() => void updateStatus("verified")}
                        className="rounded-md bg-tedx-accent px-3 py-2 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:bg-tedx-disabled"
                      >
                        Confirm Payment
                      </button>
                      <button
                        type="button"
                        disabled={
                          isUpdatingStatus ||
                          (selectedRegistration.status ?? "submitted") === "submitted"
                        }
                        onClick={() => void updateStatus("submitted")}
                        className="rounded-md border border-tedx-outline-strong px-3 py-2 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:text-tedx-disabled-text"
                      >
                        Mark as Pending
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingRegistration}
                        onClick={() => void handleDeleteRegistration()}
                        className="rounded-md border border-tedx-accent px-3 py-2 text-xs font-bold uppercase text-tedx-accent hover:bg-tedx-accent hover:text-tedx-white disabled:cursor-not-allowed disabled:border-tedx-disabled disabled:text-tedx-disabled-text"
                      >
                        {isDeletingRegistration ? "Deleting…" : "Delete Registration"}
                      </button>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div>
                    <h2 className="text-base font-bold uppercase tracking-wide">
                      Attendees ({selectedRegistration.attendees.length})
                    </h2>
                    <div className="mt-2 overflow-x-auto rounded-lg border border-tedx-outline-strong bg-tedx-black">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-tedx-outline-strong text-xs uppercase text-tedx-muted-text">
                          <tr>
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Full Name</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Contact</th>
                            <th className="px-3 py-2">School / Affiliation</th>
                            <th className="px-3 py-2">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRegistration.attendees.map((attendee, i) => (
                            <tr
                              key={`attendee-${i}`}
                              className="border-b border-tedx-outline-strong/60 last:border-b-0"
                            >
                              <td className="px-3 py-2 text-tedx-muted-text">{i + 1}</td>
                              <td className="px-3 py-2 font-semibold">{attendee.fullName}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">{attendee.email}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {attendee.contactNumber}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {attendee.schoolAffiliation}
                              </td>
                              <td className="px-3 py-2 text-xs font-semibold text-tedx-accent">
                                {participantTypeLabels[attendee.participantType]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tickets */}
                  <div>
                    <h2 className="text-base font-bold uppercase tracking-wide">Tickets</h2>
                    <div className="mt-2 overflow-x-auto rounded-lg border border-tedx-outline-strong bg-tedx-black">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-tedx-outline-strong text-xs uppercase text-tedx-muted-text">
                          <tr>
                            <th className="px-3 py-2">Line</th>
                            <th className="px-3 py-2">Tier</th>
                            <th className="px-3 py-2">Mode</th>
                            <th className="px-3 py-2">Attendees</th>
                            <th className="px-3 py-2">Unit Price</th>
                            <th className="px-3 py-2">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRegistration.ticketLines.map((line, i) => (
                            <tr
                              key={`line-${i}`}
                              className="border-b border-tedx-outline-strong/60 last:border-b-0"
                            >
                              <td className="px-3 py-2 text-tedx-muted-text">{i + 1}</td>
                              <td className="px-3 py-2 font-semibold">{line.resolvedTierId}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {line.purchaseMode === "group_of_three"
                                  ? "Group of 3"
                                  : "Individual"}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {line.attendeeIndices.map((v) => v + 1).join(", ")}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {formatPhp(line.unitPriceAtSubmit)}
                              </td>
                              <td className="px-3 py-2 font-semibold text-tedx-accent">
                                {formatPhp(line.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-sm font-bold uppercase text-tedx-accent">
                      Total: {formatPhp(selectedTotal)}
                    </p>
                  </div>

                  {/* Payment proof */}
                  <div>
                    <h2 className="text-base font-bold uppercase tracking-wide">Payment Proof</h2>
                    {selectedRegistration.paymentProofUrl ? (
                      <div className="mt-2 space-y-3">
                        <div className="overflow-hidden rounded-lg border border-tedx-outline-strong bg-tedx-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedRegistration.paymentProofUrl}
                            alt="Payment proof"
                            className="max-h-80 w-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <a
                          href={selectedRegistration.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-sm text-tedx-accent hover:text-tedx-accent-hover"
                        >
                          Open in new tab ↗
                        </a>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-tedx-muted-text">No payment proof found.</p>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
    </AdminShell>
  );
}
