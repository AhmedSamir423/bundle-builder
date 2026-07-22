# Bundle Builder

A React prototype of a multi-step **bundle builder** for a home-security system: a four-step
accordion on the left for assembling the bundle, and a live **review/summary panel** on the right
that recalculates as selections change. The desktop layout is built to match the provided Figma,
and the UI stays usable and coherent down to mobile.

## Tech Stack

- **React 19** with **TypeScript 5.8**
- **Vite 6** (dev server and build)
- **Tailwind CSS 3.4** (+ PostCSS / Autoprefixer)
- **React Context + `useReducer`** for state (no external state library)
- **localStorage** for persistence
- **ESLint 9** (typescript-eslint) and **Prettier** for quality/formatting

## Getting Started

### 1. Prerequisites

- **Node.js 20 or newer** (developed on Node 22; required by Vite 6)
- npm (ships with Node)

### 2. Clone

```bash
git clone <repository-url>
cd Bundle-Builder
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

### 5. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Additional checks: `npm run typecheck` (`tsc --noEmit`) and `npm run lint`.

## Project Overview

The app is **data-driven and rendered from a single source of truth**:

- **Data (`src/data/`)** — `catalog.json` defines the categories/steps and products (title, image,
  price, compare-at price, optional badge, variants, etc.); `seed-state.json` defines the initial
  selection so the app loads looking like the design. Types live in `src/types/builder.ts`.
- **State (`src/state/builder-provider.tsx`)** — `BuilderProvider` holds all state via a
  `useReducer` store exposed through React Context. It seeds from `seed-state.json` (or restored
  `localStorage`), owns every mutation, and persists on change.
- **View model (`src/state/create-builder-view-model.ts`)** — a pure function derives everything the
  UI renders from `(catalog, state)`: the per-step product lists and "N selected" counts, the grouped
  review line items (one line per variant with a quantity above zero), and the subtotal / pre-discount
  total / savings. Components stay presentational and read from this view model.
- **Components (`src/components/`)** — `BuilderLayout` (responsive two-column shell), `BuilderAccordion`,
  `ProductCard`, `VariantChipRow`, `QuantityStepper`, and `ReviewPanel`, plus small presentational
  helpers (`ProductArtwork`, `Currency`, `Icons`).
- **Responsive layout** — two columns at `xl` (≥1280px); below that the panels stack into a single,
  full-width column, with a mobile-only intro heading.

## Implementation Decisions

- **Data-driven rendering.** No per-product markup is hardcoded; cards, steps, and review lines all
  render from `catalog.json` + `seed-state.json`.
- **State/UI separation.** All mutation logic lives in the reducer; the derived view model is a pure
  function; components only render. This keeps the sync behavior below trivially correct.
- **Variant-specific quantities.** Each product tracks quantity **per variant** (`quantitiesByVariant`).
  The card's stepper is bound to the currently selected variant, so selecting a color shows and edits
  that color's count while other colors keep theirs.
- **Synchronized review panel.** The product-card steppers and the review-panel steppers dispatch to
  the same store, so changing one updates the other and the totals immediately. Every variant with a
  quantity above zero appears as its own review line.
- **localStorage persistence.** State is serialized under a versioned key; on load the app restores
  from `localStorage` and falls back to the seed. **Save my system for later** (and Checkout) persist
  explicitly, and state is also written on every change so nothing is lost between visits.

## Tradeoffs

- **Font substitution.** The Figma uses **Gilroy**, a proprietary font. The app uses **Manrope**
  (a close geometric sans) and matches the design's sizes, weights, line-heights, and letter-spacing.
- **Pricing consistency.** The design's summary numbers are internally inconsistent (the card prices
  don't reconcile to its headline total). The catalog is priced for internal consistency — the
  **savings figure ($50.92) matches the design**, and the total shown is the honest computed sum.
- **Financing line.** The design's exact "as low as" figure isn't derivable from its numbers, so it is
  computed as an illustrative monthly amount from the subtotal.
- **Committed image assets.** Product and brand images are exported from the Figma into `public/`
  (the Figma asset URLs are temporary), so the design renders from a clean clone with no external calls.

## Assignment Coverage

- **Figma recreation (desktop).** Two-column builder + review, matched for layout, spacing, typography,
  color, corner radii, and element states (selected/unselected cards, active color chips, disabled/
  required steppers).
- **Responsive layout.** Coherent and usable from desktop down to mobile (single-column stacking,
  full-width panels, mobile intro heading).
- **Accordion interactions.** Four steps expand/collapse, Step 1 open on load, headers show
  "STEP X OF 4" + icon + title with an open "N selected" up-chevron / collapsed down-chevron, and each
  open step ends with a **Next:** button that advances.
- **Synchronized quantity management.** Steppers on both the cards and the review lines stay in sync
  through the shared store; the total recalculates live.
- **Variant-specific quantities.** Per-variant counts, stepper bound to the active variant, and each
  variant surfaced as its own review line.
- **Live review panel.** Grouped under Cameras / Sensors / Accessories / Plan, with a shipping row,
  satisfaction badge, financing line, struck-through pre-discount total, savings callout, Checkout, and
  Save link — all updating from state.
- **JSON-driven architecture.** Everything renders from local JSON with a typed boundary.
- **localStorage persistence.** Configure → save → leave → return restores the exact configuration.

## Notes

- **No known unfinished required features** — all required functionality is implemented.
- **Review add-controls follow the Figma:** the Cameras, Sensors, and Accessories lines have steppers,
  the required Sense Hub stepper is disabled, and the Plan and Shipping rows are static.
- Steps 2–4 are only shown collapsed in the design; their **expanded** card layouts are rendered with
  the same `ProductCard` styling as Step 1 for consistency.
- **Checkout** is a placeholder (it persists the configuration; there is nowhere to navigate in this
  prototype), which the assignment permits.
