# AGENTS.md

## Purpose

This repo is a marketing/event site for TEDxAteneodeManilaU 2026 built with Next.js App Router, React 19, TypeScript, and Tailwind CSS.

Use this file as the project-specific guide for implementing new sections, translating Figma designs, and verifying changes before handoff.

## Stack

- Framework: Next.js 16 App Router
- Runtime: React 19
- Language: TypeScript
- Styling: Tailwind CSS plus a small set of shared utilities in [`app/globals.css`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/globals.css)
- Layout shell: [`app/layout.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/layout.tsx)

## Commands

Run these from the repo root:

- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production verification: `npx next build --webpack`

Before handing off UI work, run both lint and the production build.

## Project Shape

- [`app/layout.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/layout.tsx) provides the global shell and already includes the navbar and footer.
- Route pages live in `app/.../page.tsx`.
- Most page content is split into route-specific `sections/` folders.
- Section barrels exist, for example [`app/about/sections/index.ts`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/index.ts).
- Shared layout/UI components live under [`components`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/components).
- Static assets live under [`public`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/public), typically grouped by route and section.

Examples:

- Home page sections: [`app/(home)/sections`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/(home)/sections)
- About page sections: [`app/about/sections`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections)
- Team page sections: [`app/team/sections`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/team/sections)
- Shop page sections: [`app/shop/sections`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/shop/sections)

## Section Conventions

- Default to server components.
- Add `"use client"` only when a section needs client-side interaction, pointer handling, local state, or DOM effects.
- Keep each section self-contained in its own file.
- Export route sections through the local `sections/index.ts` barrel.
- Prefer data-driven rendering for repeated cards, stats, bullets, and CTA groups.
- Use `next/image` for local imagery and `next/link` for internal navigation.

For page-sized sections, the common layout pattern is:

- full-width black background on the section
- centered inner wrapper with `mx-auto`
- max width around `1440px`
- responsive padding handled directly in the section

## Styling Rules

### Use Tailwind Theme Tokens

Do not hardcode brand colors in component class strings.

Theme colors live in [`tailwind.config.ts`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/tailwind.config.ts). Use these first:

- `tedx-black`
- `tedx-white`
- `tedx-red`
- `tedx-accent`
- `tedx-accent-hover`
- `tedx-accent-strong`
- `tedx-surface`
- `tedx-surface-deep`
- `tedx-surface-muted`
- `tedx-outline-strong`
- `tedx-muted-text`
- `tedx-disabled`
- `tedx-disabled-text`

If a new reusable color is needed, add it to `tailwind.config.ts` first.

### Shared CSS Utilities

Shared utilities and theme-backed CSS variables live in [`app/globals.css`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/globals.css).

Use globals for things Tailwind cannot express cleanly:

- complex gradients
- repeated shadows
- branded text effects
- reusable utility classes like `.font-league-gothic`

If a section needs a one-off gradient that is likely to repeat, promote it into `globals.css` as a CSS variable or utility class instead of repeating inline color values.

### Typography

- Base sans stack comes from Tailwind `font-sans` and is Helvetica-based.
- Condensed display headings use `.font-league-gothic`.
- The About page uses large, dramatic display headings with black/red contrast and tight tracking.

### Responsive Design

- Match the desktop composition closely, but do not force desktop layouts onto mobile.
- Prefer stacked layouts on mobile when a Figma desktop composition depends on wide horizontal space.
- Keep interaction areas usable on touch screens.
- Verify mobile visibility for badges, buttons, and absolute-positioned overlays.

## Figma Implementation Rules

When building from Figma in this repo:

1. Match structure, spacing, typography, and hierarchy first.
2. Reuse the repo’s color tokens instead of copying literal Figma hex values into components.
3. Download or store assets locally under `public/<route>/<section>/...` instead of depending on temporary remote Figma asset URLs.
4. Keep section code readable. Translate Figma output into project conventions rather than pasting generated code verbatim.
5. If a visual effect needs exact gradients or masks, prefer CSS variables in `globals.css` backed by theme colors.

## Interaction Guidelines

- Use client components only for real interaction.
- Preserve keyboard accessibility for custom controls.
- When adding drag or pointer interactions, ensure mobile usability and avoid interaction dead zones.
- For menus, popovers, and dropdowns, close on outside click and use clear focus states.

## Current About Page Patterns

The About page is the most design-heavy route right now. Relevant references:

- [`app/about/page.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/page.tsx)
- [`app/about/sections/PastMomentsSection.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/PastMomentsSection.tsx)
- [`app/about/sections/PastTalksSection.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/PastTalksSection.tsx)
- [`app/about/sections/SpeakerTestimonialSection.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/SpeakerTestimonialSection.tsx)
- [`app/about/sections/GetInvolvedSection.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/GetInvolvedSection.tsx)
- [`app/about/sections/LegacySection.tsx`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/about/sections/LegacySection.tsx)

These files demonstrate the current expectations for:

- Figma fidelity
- max-width section wrappers
- use of `font-league-gothic`
- theme-based color usage
- responsive desktop-to-mobile adaptation

## Preferred Workflow For Agents

1. Inspect the target page and nearby sections before editing.
2. Check whether the design already implies an existing pattern in the same route.
3. Keep new assets organized under `public`.
4. Use `apply_patch` for edits.
5. Run `npm run lint`.
6. Run `npx next build --webpack`.
7. Report what changed and whether verification passed.

## Avoid

- Do not introduce hardcoded brand hex colors directly into component classNames.
- Do not add new UI libraries for simple layout or animation work.
- Do not convert a section to a client component unless it truly needs it.
- Do not leave temporary Figma asset URLs in production code when a local asset can be stored instead.
- Do not assume a desktop absolute-positioned composition will work on mobile without adjustment.

## If You Need New Tokens

If a design requires a new reusable visual token:

1. Add the token in [`tailwind.config.ts`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/tailwind.config.ts).
2. If it is needed inside gradients, masks, or shadows, expose it via a CSS variable or utility in [`app/globals.css`](/Users/alexi/repos/TEDxAteneodeManilaU-2026/app/globals.css).
3. Then use the token in the component.

That order keeps the palette centralized and prevents color drift across sections.
