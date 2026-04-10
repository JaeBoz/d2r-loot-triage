# D2R Loot Triage

Lightweight Next.js + TypeScript + Tailwind app for fast Diablo 2 Resurrected item triage, starting with Softcore Battle.net Non-Ladder and a first-pass Softcore Ladder toggle.

## MVP scope

- `SCNL` / `SCL` mode toggle
- Category tabs for `Bases`, `Runes`, `Uniques`, `Charms`, `Jewels`, `Rings`, `Amulets`
- Deterministic quick-triage UI
- Local structured data files for starter references and rules
- Base Checker as the first complete feature
- Reference list page
- No login, OCR, or external APIs

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Local JSON seed data

## Project structure

```text
app/
  layout.tsx
  page.tsx
  reference/page.tsx
components/
  app-shell.tsx
  base-checker.tsx
  placeholder-category-panel.tsx
  reference-list.tsx
  ui.tsx
data/
  base-items.json
  base-reference.json
lib/
  base-checker.ts
  constants.ts
  data.ts
  market.ts
  types.ts
```

## Getting started

1. Install Node.js 18.17+ or 20+.
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## How the Base Checker works

The Base Checker evaluates local item metadata and deterministic score modifiers:

- supported socket patterns
- ethereal desirability by base type
- ladder vs non-ladder demand nudges
- superior status
- armor defense threshold
- paladin shield all-res breakpoint
- a few targeted premium overrides like `4os Monarch` and `5os Phase Blade`

The resulting score maps to one of:

- `Ignore`
- `Low Priority`
- `Check`
- `Keep`
- `List`
- `Premium`

## Expand later

The current structure is designed so future features can plug in without rewriting the app shell:

- add new category datasets under `data/`
- add deterministic evaluators under `lib/`
- implement lookup providers against the `MarketLookupAdapter` contract in `lib/market.ts`
- replace placeholder category panels with dedicated checkers one by one

## Notes

- Seed data is intentionally curated and small for the MVP.
- No external pricing or OCR is included yet.
- Market integration points are left modular on purpose so adapters can be added later.
