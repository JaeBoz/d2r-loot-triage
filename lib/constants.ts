import { EvaluationPriority, ItemCategory, Ruleset } from "@/lib/types";

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

export const TRADE_VALUE_STYLES: Record<EvaluationPriority, string> = {
  "Premium Trade Value": "border-emerald-400/60 bg-emerald-950/35 text-emerald-100",
  "High Trade Value": "border-emerald-500/50 bg-emerald-950/30 text-emerald-100",
  "Moderate Trade Value": "border-orange-500/55 bg-orange-950/35 text-orange-100",
  "Low Trade Value": "border-red-700/60 bg-red-950/35 text-red-100",
  Trash: "border-red-800/70 bg-red-950/45 text-red-100"
};
