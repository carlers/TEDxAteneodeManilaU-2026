# Admin Registrations Module

## Routes

### `/admin/login`

- **File:** `app/admin/login/page.tsx`
- **Auth UX:** Convex Auth Google sign-in button
- **Behavior:** Signed-in users can navigate to registrations view.

### `/admin/registrations`

- **File:** `app/admin/registrations/page.tsx`
- **Behavior:** Loads registrations list/details, shows payment proof + reference code, and supports status updates (`submitted`/`verified`) for payment confirmation.

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

### `admins:syncAdminEmails`

- **Type:** Mutation
- **Auth required:** Run via local script/workflow (`npm run sync:admins`)
- **Args:** none
- **Behavior:** Reconciles Convex `admins` table to `ADMIN_EMAILS` from env (adds missing, removes stale).

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
