<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TEDxAteneodeManilaU 2026 Next.js App Router project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ instrumentation pattern with reverse proxy, exception capture enabled, and the `2026-01-30` defaults snapshot.
- **`next.config.ts`** — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true` to route PostHog events through the app domain (improves ad-blocker resistance).
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`posthog-js`** installed as a dependency.

Event tracking was added across 7 files covering the full user journey — from navbar CTA clicks through the multi-step registration flow, content engagement, and admin actions.

| Event | Description | File |
|---|---|---|
| `registration_started` | User lands on /register and the form initializes (top of funnel) | `app/register/page.tsx` |
| `registration_step_advanced` | User advances from one step to the next in the multi-step form | `app/register/page.tsx` |
| `registration_submitted` | User successfully submits registration and receives a reference code | `app/register/page.tsx` |
| `registration_submission_error` | Registration form submission failed (upload or Convex mutation error) | `app/register/page.tsx` |
| `speaker_door_opened` | User opens a speaker door on the home page | `app/(home)/sections/SpeakersSection.tsx` |
| `merch_order_now_clicked` | User clicks the "Order Now" button in the merch catalog | `app/shop/sections/CatalogSection.tsx` |
| `contact_form_submitted` | User submits the home page contact/pre-fill form | `app/(home)/sections/ContactUsSection.tsx` |
| `faq_item_expanded` | User expands a FAQ question | `app/(home)/sections/FaqSection.tsx` |
| `admin_login_clicked` | Admin clicks "Sign in with Google" on the admin login page | `app/admin/login/page.tsx` |
| `register_now_clicked` | User clicks the "Register Now" button in the navbar | `components/ui/RegisterButton.tsx` |

**User identification:** `posthog.identify()` is called on successful registration using the primary attendee's email as the distinct ID, linking all their prior anonymous events.

**Error tracking:** `posthog.captureException()` is called on registration submission errors, sending exception details to PostHog Error Tracking.

## Next steps

We've built a dashboard and five insights to monitor user behavior:

- **Dashboard:** [Analytics basics](https://us.posthog.com/project/381880/dashboard/1465661)
- [Registration Conversion Funnel](https://us.posthog.com/project/381880/insights/CrfjIGx9) — 3-step funnel from `registration_started` → step advanced → `registration_submitted`
- [Daily Registrations Submitted](https://us.posthog.com/project/381880/insights/eLGKehJ0) — Line chart of successful registrations per day
- [Content Engagement Overview](https://us.posthog.com/project/381880/insights/Axwgvbli) — Speaker door opens, FAQ expansions, and merch clicks over time
- [Registration Submission Errors](https://us.posthog.com/project/381880/insights/RxxpsQhx) — Track error frequency to catch upload/Convex issues early
- [CTA to Registration Funnel](https://us.posthog.com/project/381880/insights/peLncBed) — Full funnel from `register_now_clicked` → registration page → submission

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
