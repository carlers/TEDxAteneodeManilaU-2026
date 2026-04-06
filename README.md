# TEDxADMU 2026 - Developer Guide

## QUICK START
git clone [repo] && cd tedxadmu2026\
npm install && npm run dev\
Visit localhost:3000/

## REGISTRATION STACK (CONVEX + CONVEX AUTH)

- Registration is now powered by Convex functions in `convex/`.
- Admin auth uses Convex Auth (Google OAuth), while Convex enforces final admin authorization (`admins` table or `ADMIN_EMAILS`).
- Pricing is configured in `config/ticket-pricing.json` and resolved in `lib/ticketPricing.ts`.
- Public GCash QR asset path is `public/gcash.png`.

### Required environment variables

- `NEXT_PUBLIC_CONVEX_URL`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ADMIN_EMAILS` (comma-separated allowlisted admin emails)
- `SITE_URL`
- `JWT_PRIVATE_KEY`
- `JWKS`

### Setup steps

1. Run `npm install`
2. Copy `.env.example` to `.env.local` and set Convex Auth + Convex environment values
3. Start Convex codegen/dev backend with `npx convex dev`
4. In Convex dashboard environment variables, set `ADMIN_EMAILS` (comma-separated)
5. Run `npm run sync:admins` to mirror `ADMIN_EMAILS` into the Convex `admins` table
6. In your Google OAuth app:
   - add authorized redirect URI: `/api/auth/callback/google` for local/prod domains
   - place the client ID/secret in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
7. Run app with `npm run dev`
8. Edit sample ticket prices in `config/ticket-pricing.json`

### New routes

- `/register` - attendee registration + payment proof upload
- `/admin/login` - admin sign-in
- `/admin/registrations` - admin registrations panel

### Deployment docs

- Production runbook: `docs/deploy-production.md`

## STRUCTURE
app/
  (home)/
    page.tsx                -> /
    sections/
      LandingSection.tsx
      WhatIsMomentumSection.tsx
      WhatIsTedxSection.tsx
      TalksSection.tsx
      SpeakersSection.tsx
      AgendaSection.tsx
      VenueSection.tsx
      SponsorsSection.tsx
      FaqSection.tsx
      ContactUsSection.tsx
      index.ts              -> barrel export

  about/
    page.tsx                -> /about
    sections/
      LandingSection.tsx
      AboutTedxAteneoSection.tsx
      MissionVisionSection.tsx
      LegacySection.tsx
      PastMomentsSection.tsx
      PastTalksSection.tsx
      SpeakerTestimonialSection.tsx
      GetInvolvedSection.tsx
      index.ts              -> barrel export

  team/
    page.tsx                -> /team
    sections/
      LandingSection.tsx
      OrganizerSection.tsx
      LeadersSection.tsx
      DepartmentsSection.tsx
      GetInTouchSection.tsx
      index.ts              -> barrel export

  shop/
    page.tsx                -> /shop
    sections/
      LandingSection.tsx
      TopPicksSection.tsx
      CatalogSection.tsx
      index.ts              -> barrel export

  register/page.tsx         -> /register
  layout.tsx
  globals.css

SECTION PATTERN:
Each page composes section components from its own sections/ folder.
Import via barrel: import { SectionName } from "@/app/[page]/sections"

## COLORS - USE THESE
These can be found in tailwind.config.js and globals.css\
tedx-red: #eb0028    (TEDx Red - buttons)\
tedx-black: #000000  (Black - headings)\
tedx-gray: #f5f5f5   (Light Gray - backgrounds)\
tedx-white: #ffffff  (White)\
tedx-dark: #1a1a1a   (Dark Gray - text)\

destructive: '#dc2626', // Error red\
success: '#16a34a',     // Success green\
warning: '#f59e0b',     // Warning yellow\
muted: '#6b7280',       // Muted text\
border: '#e5e7eb',      // Border gray\

USE: className="bg-tedx-red text-tedx-white"\
DONT: className="bg-[#eb0028]"\

## TO EDIT COLORS, FONTS, SIZES, GO TO tailwind.config.js and globals.css

## TYPOGRAPHY
These can be found in tailwind.config.js and globals.css\
Font: Helvetica -> Arial -> sans-serif\
Rule: Always black text if on white background

Classes:
text-heading    -> 1.5rem, Bold (page titles)\
text-subheading -> 1rem, Regular (section titles)\
text-body       -> 0.875rem, Regular (paragraphs)

## STYLING RULES
USE TAILWIND DIRECTLY:\
✅ className="p-4 bg-primary text-white rounded-lg"\
❌ className="card" with .card { @apply p-4 bg-primary; }

## MOBILE-FIRST:
className="p-4 md:p-6 lg:p-8"\
className="block md:flex lg:grid"

## DON'T USE:
- Inline styles: style={{ color: 'red' }}
- CSS modules: .module.css files
- @apply for simple utilities

## GIT WORKFLOW
BRANCH NAMES:\
feature/home-page-hero\
fix/registration-button\
docs/readme-update\
style/navbar-responsive

STEPS:

git checkout main && git pull origin main

git checkout -b feature/your-feature

git add .

git commit -m "feat: add speaker cards"

git push origin feature/your-feature

Create PR on GitHub

## COMMIT MESSAGES:
feat: add registration form
fix: correct mobile menu
docs: update readme
style: improve button hover
refactor: simplify data fetching
test: add Button tests
chore: update dependencies

🚫 NEVER:

Push directly to main

Use any type

Leave branches dangling (delete after merge)

PR REQUIREMENTS:

Clear title & description

Screenshots for UI changes (REQUIRED)

Assign 1 reviewer

All checks must pass ✅

## COMPONENT ORGANIZATION
components/\
├── ui/ -> Button, Card, Input\
├── layout/ -> Navbar, Footer\
└── shared/ -> Page-specific

Barrel exports (components/ui/index.ts):\
export { default as Button } from './Button'\
export { default as Card } from './Card'

Usage: import { Button, Card } from '@/components/ui'
