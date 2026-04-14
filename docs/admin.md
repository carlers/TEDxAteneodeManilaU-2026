# Admin Registrations Module

## Routes

### `/admin`

- **File:** `app/admin/page.tsx`
- **Behavior:** Automatically redirects to `/admin/overview`.

### `/admin/login`

- **File:** `app/admin/login/page.tsx`
- **Auth UX:** Convex Auth Google sign-in button
- **Behavior:** Signed-in users can navigate to registrations view.

### `/admin/registrations`

- **File:** `app/admin/registrations/page.tsx`
- **Behavior:** Loads registrations list/details in a table + detail workflow, shows payment proof + reference code, and supports status updates (`submitted`/`verified`) for payment confirmation.
- **Navigation:** Uses a sidebar admin shell with links to overview, registrations, and admin management.

### `/admin/overview`

- **File:** `app/admin/overview/page.tsx`
- **Behavior:** Displays summary metrics (totals, attendees, pending/verified counts, and revenue breakdowns).
- **Navigation:** Uses the same sidebar admin shell; intended for summary-only view.

### `/admin/management`

- **File:** `app/admin/management/page.tsx`
- **Behavior:** Dedicated admin access page for adding/removing admins with inline feedback and safeguard messaging.
- **Navigation:** Uses the same sidebar admin shell for quick switching back to registrations.

## Security model

- Authentication is managed by Convex Auth (Google OAuth).
- Convex admin functions use `getAuthUserId()` and reject unauthenticated callers.
- Convex enforces admin authorization for admin functions via `assertAdmin`:
  - Checks if authenticated admin email is in the `admins` table (`by_email` index), or
  - Falls back to `ADMIN_EMAILS` environment allowlist.
  - Non-admin callers are rejected by Convex.

## Convex admin queries

### `registrations:listRegistrations`

- **Type:** Query
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** none
- **Returns:** Up to 200 newest registrations from `by_createdAt`.

### `registrations:getRegistration`

- **Type:** Query
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** `registrationId`
- **Returns:** Full registration + `paymentProofUrl` from Convex storage.

### `registrations:updateRegistrationStatus`

- **Type:** Mutation
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** `registrationId`, `status` (`submitted` or `verified`)
- **Returns:** `{ ok: true }`

### `registrations:deleteRegistration`

- **Type:** Mutation
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** `registrationId`
- **Returns:** `{ ok: true }`
- **Behavior:** Permanently deletes the selected registration from the `registrations` table.

### `admins:syncAdminEmails`

- **Type:** Mutation
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** none
- **Behavior:** Reconciles Convex `admins` table to `ADMIN_EMAILS` from env (adds missing, removes stale).

### `admins:listAdmins`

- **Type:** Query
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** none
- **Returns:** All admin rows from the `admins` table (email + id).

### `admins:addAdmin`

- **Type:** Mutation
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** `email`
- **Returns:** `{ ok: true, id, alreadyExists }`
- **Behavior:** Adds a normalized email to `admins` if it does not already exist.

### `admins:removeAdmin`

- **Type:** Mutation
- **Auth required:** Convex Auth session + Convex `assertAdmin`
- **Args:** `adminId`
- **Returns:** `{ ok: true }`
- **Behavior:** Removes an admin row from `admins`.
- **Safeguards:**
  - Prevents self-removal for the currently authenticated admin.
  - Prevents deletion when only one admin remains.

## Required environment variables

| Variable | Required | Usage |
| --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex client URL used by frontend provider. |
| `ADMIN_EMAILS` | Yes | Server-side allowlist of admin emails, comma-separated. |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID used by Convex Auth provider. |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret used by Convex Auth provider. |
| `SITE_URL` | Yes | App URL used by Convex Auth redirects. |
| `JWT_PRIVATE_KEY` | Yes | Convex Auth JWT signing private key. |
| `JWKS` | Yes | Convex Auth public JWKS JSON. |

## Admin sync script

- Run `npm run sync:admins` to sync `ADMIN_EMAILS` from `.env.local` (or environment) to Convex `admins` table.
- Recommended flow: edit `ADMIN_EMAILS`, run sync script, then restart dev server if needed.
