# Schema Documentation

## Convex `admins` table

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `email` | `string` | Yes | Lowercased admin email for explicit admin grant. |

## Convex Auth tables

Auth tables are provided by `authTables` from `@convex-dev/auth/server`:

- `users`
- `sessions`
- `accounts`
- `verificationTokens`
- `authenticators`

These power Google OAuth sign-in and Convex-side identity checks (`getAuthUserId`).

## Convex `registrations` table

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `attendees` | `Array<Attendee>` | Yes | At least one attendee is required. |
| `attendees[].fullName` | `string` | Yes | Full name of attendee. |
| `attendees[].email` | `string` | Yes | Contact email address. |
| `attendees[].contactNumber` | `string` | Yes | Phone/mobile contact. |
| `attendees[].schoolAffiliation` | `string` | Yes | School or affiliation. |
| `attendees[].participantType` | `"student" \| "aman_scholar" \| "external"` | Yes | Pricing category uses this value. |
| `encourageFacebookFollow` | `boolean` | Yes | Checkbox value from registration form. |
| `dataPrivacyConsent` | `boolean` | Yes | Must be `true` to submit. |
| `emergencyContact` | `string \| undefined` | No | Optional emergency contact text. |
| `hearAbout` | `string[]` | Yes | Selected channels from allowed options. |
| `ticketLines` | `Array<TicketLine>` | Yes | At least one ticket line is required. |
| `ticketLines[].purchaseMode` | `"individual" \| "group_of_three"` | Yes | Ticket grouping mode. |
| `ticketLines[].attendeeIndices` | `number[]` | Yes | References attendee indexes in `attendees`. |
| `ticketLines[].resolvedTierId` | `string` | Yes | Tier key resolved from local pricing JSON. |
| `ticketLines[].unitPriceAtSubmit` | `number` | Yes | Stored amount at submit time. |
| `ticketLines[].lineTotal` | `number` | Yes | Stored line total at submit time. |
| `paymentProofStorageId` | `Id<"_storage">` | Yes | Uploaded proof image from Convex storage. |
| `referenceCode` | `string \| undefined` | No (legacy-safe) | Human-readable registration reference shown to attendee/admin. New submissions always generate this value. |
| `createdAt` | `number` | Yes | Unix timestamp in milliseconds. |
| `status` | `"submitted" \| "verified" \| undefined` | No | Defaults to `submitted`. |
| `primaryAttendeeEmail` | `string` | Yes | Denormalized first attendee email. |

## Indexes

| Index | Fields | Purpose |
| --- | --- | --- |
| `by_email` | `email` | Fast admin lookup for Convex-side authorization. |
| `email` | `users.email` | Convex Auth lookup for account/user mapping. |
| `by_createdAt` | `createdAt` | Admin list sorted by newest registrations. |
| `by_primaryAttendeeEmail` | `primaryAttendeeEmail` | Lookup by lead attendee email. |
| `by_referenceCode` | `referenceCode` | Lookup and verification using attendee reference code. |
