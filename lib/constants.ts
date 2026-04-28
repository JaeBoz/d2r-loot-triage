import { ItemCategory, Ruleset, Verdict } from "@/lib/types";

export const MODE_OPTIONS = [
  { value: "SCNL", label: "SCNL" },
  { value: "SCL", label: "SCL" }
] as const;

export const RULESET_OPTIONS: Array<{ value: Ruleset; label: string }> = [
  { value: "lod", label: "LOD" },
  { value: "warlock", label: "Reign of the Warlock" }
];

export const CATEGORY_TABS: ItemCategory[] = [
  "Bases",
  "Circlets",
  "Runes",
  "Uniques",
  "Charms",
  "Jewels",
  "Rings",
  "Amulets",
  "Boots",
  "Gloves"
];

export const VERDICT_STYLES: Record<Verdict, string> = {
  Ignore: "border-zinc-700 bg-zinc-900/70 text-zinc-300",
  "Low Priority": "border-stone-700 bg-stone-900/80 text-stone-200",
  Check: "border-amber-700/60 bg-amber-950/35 text-amber-100",
  "Check sockets": "border-orange-600/50 bg-orange-950/30 text-orange-100",
  Keep: "border-emerald-500/45 bg-emerald-950/30 text-emerald-100",
  List: "border-amber-400/55 bg-amber-900/25 text-amber-100",
  Premium: "border-yellow-300/60 bg-gradient-to-br from-yellow-500/20 via-amber-900/25 to-black/25 text-yellow-100"
};
