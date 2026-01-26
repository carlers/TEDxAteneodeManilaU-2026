# TEDxADMU 2026 - Developer Guide

## QUICK START
git clone [repo] && cd tedxadmu2026\
npm install && npm run dev\
Visit localhost:3000/

## STRUCTURE
app/
  (home)/page.tsx           -> /\
  about/page.tsx            -> /about\
  event/page.tsx            -> /event\
  team/page.tsx             -> /team\
  registration/page.tsx     -> /registration\
  shop/page.tsx             -> /shop

## COLORS - USE THESE
These can be found in tailwind.config.js and globals.css\
tedx-red: #eb0028    (TEDx Red - buttons)\
tedx-black: #000000  (Black - headings)\
tedx-gray: #f5f5f5   (Light Gray - backgrounds)\
tedx-white: #ffffff  (White)\
tedx-dark: #1a1a1a   (Dark Gray - text)\

destructive: '#dc2626', // Error red (different from brand red!)\
success: '#16a34a',     // Success green\
warning: '#f59e0b',     // Warning yellow\
muted: '#6b7280',       // Muted text\
border: '#e5e7eb',      // Border gray\

USE: className="bg-tedx-red text-tedx-white"\
NEVER: className="bg-[#eb0028]"\

## TYPOGRAPHY
These can be found in tailwind.config.js and globals.css\
Font: Helvetica -> Arial -> sans-serif\
Rule: Always black text if on white background

Classes:
text-heading    -> 1.5rem, Bold (page titles)\
text-subheading -> 1rem, Regular (section titles)\
text-body       -> 0.875rem, Regular (paragraphs)

## CODING RULES

1. CREATE FILES:
   - Use `rafce` snippet
   - Name: PascalCase.tsx (Button.tsx)


2. STYLING RULES\
USE TAILWIND DIRECTLY:\
✅ className="p-4 bg-primary text-white rounded-lg"\
❌ className="card" with .card { @apply p-4 bg-primary; }

## MOBILE-FIRST:
className="p-4 md:p-6 lg:p-8"\
className="block md:flex lg:grid"

## NEVER USE:
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
