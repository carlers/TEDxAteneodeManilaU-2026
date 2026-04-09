# TEDxAteneodeManilaU 2026 — Setup Guide

This document covers everything needed to get the project running from scratch: local dev, environment variables, Convex configuration, admin access, ticket pricing, and Google Sheets sync.

---

## Prerequisites

- **Node.js** 18+ (or Bun)
- A **Convex** account — [convex.dev](https://convex.dev)
- A **Google Cloud** account (for Google Sheets sync only)
- A Google OAuth app configured in Convex Auth (for admin login)

---

## 1. Install dependencies

```bash
bun install
# or: npm install
```

---

## 2. Environment variables

Create a `.env.local` file at the project root. Never commit this file.

```env
# ── Convex ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud

# ── Admin access (comma-separated Google-authenticated emails) ──────────────
ADMIN_EMAILS=you@example.com,colleague@example.com

# ── Google Sheets sync (optional — see Section 6) ──────────────────────────
GOOGLE_SERVICE_ACCOUNT_EMAIL=my-sa@my-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

> **`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`** — copy the `private_key` field verbatim from the downloaded JSON key file. It already contains `\n` characters; keep them as-is inside the quotes.

---

## 3. Convex setup

### 3a. Link the project

```bash
npx convex dev
```

This creates a `.env.local` entry for `NEXT_PUBLIC_CONVEX_URL` if one doesn't exist, and starts watching `convex/` for changes.

### 3b. Push Convex environment variables

The following variables must also be set **inside Convex** (not just `.env.local`), because they are read by server-side Convex functions:

```bash
npx convex env set ADMIN_EMAILS "you@example.com,colleague@example.com"
npx convex env set GOOGLE_SERVICE_ACCOUNT_EMAIL "my-sa@my-project.iam.gserviceaccount.com"
npx convex env set GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
npx convex env set GOOGLE_SHEETS_SPREADSHEET_ID "1BxiM..."
```

Or set them through the Convex dashboard → your deployment → Settings → Environment Variables.

### 3c. Configure Google OAuth in Convex Auth

In your Convex dashboard, go to **Auth** and add a Google OAuth provider. You'll need:

- A Google Cloud project with the **Google+ API** (or **People API**) enabled
- An OAuth 2.0 Client ID (Web Application type)
- Authorised redirect URI: `https://<your-deployment>.convex.site/api/auth/callback/google`

Convex Auth uses these credentials to let admins sign in with Google on `/admin/registrations`.

---

## 4. Admin access

Admins are identified by their Google-authenticated email address. There are two layers:

1. **`ADMIN_EMAILS` env var** — a comma-separated list checked at runtime by Convex functions
2. **`admins` database table** — synced from `ADMIN_EMAILS` via the sync script

After setting `ADMIN_EMAILS` in `.env.local` and in Convex, sync the database:

```bash
bun run sync:admins
# or: npm run sync:admins
```

Run this script any time you add or remove admin emails. It performs a full reconciliation — adding new emails and removing ones no longer in the list.

The admin dashboard lives at `/admin/registrations`. It requires a Google sign-in and verifies the email against both the `admins` table and the `ADMIN_EMAILS` allowlist.

---

## 5. Ticket pricing

Prices and tier IDs are defined in [`config/ticket-pricing.json`](config/ticket-pricing.json). Edit this file to change prices before the next ticket tier goes live.

```json
{
  "individual": {
    "student":      { "tierId": "individual_student",      "unitPrice": 1200 },
    "aman_scholar": { "tierId": "individual_aman_scholar",  "unitPrice": 1000 },
    "external":     { "tierId": "individual_external",      "unitPrice": 1500 }
  },
  "groupOfThree": {
    "tierId": "group_computed_by_types",
    "discountRate": 0.1
  }
}
```

- `discountRate: 0.1` means 10% off the sum of individual prices for a group of 3.
- `tierId` strings must match the allowlist in [`convex/registrations.ts`](convex/registrations.ts) — update both if you add a new tier.
- Prices are stored at submission time (`unitPriceAtSubmit`) so historical registrations are unaffected by future price changes.

---

## 6. Google Sheets sync

The **Sync to Google Sheets** button on the admin dashboard pushes all registrations to a Google Sheet — one row per attendee — using a service account (no user OAuth flow required).

### 6a. Create a service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → select your project (or create one).
2. **APIs & Services → Library** → search **"Google Sheets API"** → Enable.
3. **APIs & Services → Credentials → Create Credentials → Service Account**.
   - Give it any name (e.g. `tedx-sheets-sync`).
   - No roles needed at the project level — click Done.
4. Click the service account → **Keys** tab → **Add Key → Create new key → JSON**.
   - A JSON file downloads. Keep it safe; it cannot be recovered.

### 6b. Share the spreadsheet

1. Create a Google Sheet (or use an existing one). The sync writes to **Sheet1**.
2. Click **Share** → paste the service account email (from the JSON key, field `client_email`) → set role to **Editor** → Send.
3. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`1BxiM...`**`/edit`

### 6c. Set the environment variables

From the JSON key file, you need two fields:

| JSON field | Convex env var |
|---|---|
| `client_email` | `GOOGLE_SERVICE_ACCOUNT_EMAIL` |
| `private_key` | `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` |

```bash
npx convex env set GOOGLE_SERVICE_ACCOUNT_EMAIL "my-sa@my-project.iam.gserviceaccount.com"
npx convex env set GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
npx convex env set GOOGLE_SHEETS_SPREADSHEET_ID "1BxiM..."
```

> The private key value in the JSON file already contains literal `\n` characters. Copy it exactly as-is (including the surrounding quotes) when pasting into the env var.

### 6d. Sheet columns

Each sync clears Sheet1 and rewrites it. One row per attendee:

| Column | Description |
|---|---|
| Reference Code | e.g. `TEDX-20260410-AB1C2D` |
| Status | `submitted` or `verified` |
| Submitted At | Local Manila time |
| Registration Total (PHP) | Only on the first attendee row for a registration |
| Attendee # | Position within the registration (1-indexed) |
| Full Name | |
| Email | |
| Contact Number | |
| School / Affiliation | |
| Participant Type | Student / AMAn Scholar / External |
| Ticket Tier | e.g. `individual_student` |
| Purchase Mode | Individual or Group of 3 |
| Unit Price (PHP) | Price locked at submission time |
| Emergency Contact | Only on the first attendee row |
| Heard About | Only on the first attendee row |
| Encourages FB Follow | Only on the first attendee row |
| Payment Proof URL | Only on the first attendee row |

If sync fails, the error is displayed inline in the admin dashboard. Common causes: missing env vars, service account not added to the sheet, or Sheets API not enabled.

---

## 7. Running locally

```bash
# Terminal 1 — Convex dev server (watches convex/ and pushes changes)
npx convex dev

# Terminal 2 — Next.js dev server
bun dev
# or: npm run dev
```

The app runs at `http://localhost:3000`. The registration form is at `/register`. The admin dashboard is at `/admin/registrations`.

---

## 8. Deploying

```bash
# Push Convex functions to production
npx convex deploy

# Build and deploy Next.js (e.g. Vercel)
bun run build
```

After deploying, re-run the admin sync script targeting production if `ADMIN_EMAILS` changed:

```bash
NEXT_PUBLIC_CONVEX_URL=https://<prod-deployment>.convex.cloud bun run sync:admins
```
