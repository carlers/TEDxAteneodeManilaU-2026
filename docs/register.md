# Registration Module

## Public route

- **Path:** `/register`
- **Page file:** `app/register/page.tsx`
- **Purpose:** Collect attendee details in a multi-step flow, enforce a single purchase mode (`individual` or `group_of_three`) per registration, compute JSON-based pricing, display GCash QR instructions, upload payment proof, and submit data to Convex.
- **UX notes:** Includes top progress bar, local autosave, “last saved” timestamp feedback, and mobile-safe top/bottom padding so the full page remains scrollable around the fixed header.
- **Homepage handoff:** The homepage “Ready to build your momentum?” form links to `/register` and pre-fills Step 1 fields via query params (`fullName`, `email`, `contactNumber`, `schoolAffiliation`, `participantType`). Users can still edit these fields before submitting.

## Request flow

1. User completes a 4-step flow (primary info -> ticket type -> attendees -> payment & consent).
2. User chooses one purchase mode only (`individual` or `group_of_three`).
3. Attendee count is fixed by mode:
   - `individual` -> exactly 1 attendee
   - `group_of_three` -> exactly 3 attendees
4. Client computes `resolvedTierId`, `unitPriceAtSubmit`, and `lineTotal` from `config/ticket-pricing.json`.
5. Client calls `registrations:generateUploadUrl`.
6. Client uploads selected image proof to Convex storage using the signed URL.
7. Client calls `registrations:submitRegistration` with all form data and `paymentProofStorageId`.
8. On success, the UI shows a confirmation screen with a generated `referenceCode` and support contact details.

## Pricing source

- **Config:** `config/ticket-pricing.json`
- **Resolver helpers:** `lib/ticketPricing.ts`
- **Participant types:** `student`, `aman_scholar`, `external`
- **Group pricing model:** no static mixed/group unit price. Group-of-three total is computed from the three participant individual prices, then a configurable `discountRate` is applied.

## Convex public functions

### `registrations:generateUploadUrl`

- **Type:** Mutation
- **Auth:** Public
- **Args:** none
- **Returns:** Signed upload URL string

### `registrations:submitRegistration`

- **Type:** Mutation
- **Auth:** Public
- **Args:**
  - `attendees`
  - `encourageFacebookFollow`
  - `dataPrivacyConsent`
  - `emergencyContact` (optional)
  - `hearAbout`
  - `ticketLines`
  - `paymentProofStorageId`
- **Returns:** Registration document id
  - `registrationId`
  - `referenceCode`

## Validation and errors

- Rejects submission when:
  - data privacy consent is not checked
  - attendees list is empty
  - ticket lines are invalid or empty
  - attendee references are out of range or duplicated in a line
  - tier id is outside the allowlisted values
  - pricing values are negative
  - an attendee is not covered by at least one ticket line

## Payment proof requirements

- **Accepted file types:** image files (`image/*`)
- **Maximum size:** 5MB
- **Asset displayed for payment:** `public/gcash.png`
