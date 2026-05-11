# D2R Loot Triage

Fast Diablo 2 Resurrected loot triage for farming sessions.

This is not a price checker. It does not simulate markets or predict exact trade prices. It answers one practical question:

> Is this item valuable, and why?

## How To Read Results

- `Trade Value` means practical desirability, not an exact market price.
- `High` means strong, desirable, or likely worth checking.
- `Premium` means unusually clean, standout, or jackpot-adjacent.
- Contextual highlights like `GG base`, `Life skiller`, or `IAS + ED` explain the item identity.
- `Recommended Action` tells you what to do next while farming: drop, compare, stash, socket, keep, or list.

## Example Outcomes

| Item | Result read |
| --- | --- |
| 15 ED correct-socket elite base | `Premium` with `GG base`: keep or list as a standout base. |
| Lightning skiller with life | `Premium` with `Life skiller`: clean charm hit. |
| Plain +2 / 20 FCR amulet with weak secondaries | `High`: strong shell, but secondaries decide demand. |
| +2 Jav / 20 IAS vs +3 Jav / 20 IAS gloves | `High` vs `Premium`: +2/20 is desirable; +3/20 is the standout magic hit. |
| No-FRW boots with resists | usually compare-only: resists help, but missing FRW is rough. |

## Current Scope

- `SCNL` / `SCL` mode toggle
- Checkers for `Bases`, `Uniques`, `Rings`, `Amulets`, `Gloves`, `Boots`, `Charms`, `Jewels`, and `Circlets`
- Rune guide and reference page
- Deterministic local evaluation logic
- No login, OCR, external pricing, or market APIs

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

## Expand Later

The current structure is designed so future features can plug in without rewriting the app shell:

- add new category datasets under `data/`
- add deterministic evaluators under `lib/`
- add QA fixtures for known item patterns

## Notes

- Data is intentionally curated for fast farming decisions.
- Exact value still depends on ladder state, buyer needs, and realm context.
- When in doubt, the app is designed to avoid over-selling borderline items.
