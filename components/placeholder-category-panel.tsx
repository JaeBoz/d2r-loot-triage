import { Card } from "@/components/ui";
import { ItemCategory } from "@/lib/types";

const categoryHints: Record<Exclude<ItemCategory, "Bases">, string> = {
  Circlets: "Circlet-family items deserve their own jackpot-focused checker because magic and rare outcomes matter more than base-state logic.",
  Runes: "Starter list should rank chase runes and mode-specific liquidity without requiring price APIs.",
  Uniques: "Seed this with deterministic keep/list checks for staple uniques first, then expand by slot.",
  Charms: "Great future fit for exact roll thresholds and class-specific breakpoints.",
  Jewels: "Deterministic filters can cover IAS, ED, resist, and level requirement breakpoints well.",
  Rings: "A structured affix threshold engine will scale nicely here later.",
  Amulets: "This category can reuse the same modular rule system once affix combinations are seeded.",
  Boots: "Rare boot triage fits well with controlled affix entry because FRW, FHR, and resist patterns matter much more than filler mods.",
  Gloves: "Glove triage is pattern-driven because skill, IAS, Crushing Blow, and support combinations matter more than raw stat count."
};

export function PlaceholderCategoryPanel({ category }: { category: Exclude<ItemCategory, "Bases"> }) {
  return (
    <Card className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{category}</p>
      <h2 className="mt-2 text-2xl font-bold text-white">Planned next</h2>
      <p className="mt-4 text-sm leading-6 text-zinc-300">{categoryHints[category]}</p>
      <p className="mt-4 text-sm leading-6 text-zinc-400">
        The MVP ships the shared shell, mode toggle, category navigation, local data model, and a fully working Base
        Checker so we can expand category-by-category without reworking the app foundation.
      </p>
    </Card>
  );
}
