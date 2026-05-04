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
  "Premium Trade Value": "border-emerald-400/55 text-emerald-100",
  "High Trade Value": "border-emerald-500/45 text-emerald-100",
  "Moderate Trade Value": "border-orange-500/50 text-orange-100",
  "Low Trade Value": "border-red-700/55 text-red-100",
  Trash: "border-red-800/60 text-red-100"
};
