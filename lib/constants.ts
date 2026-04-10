import { ItemCategory, Verdict } from "@/lib/types";

export const MODE_OPTIONS = [
  { value: "SCNL", label: "SCNL" },
  { value: "SCL", label: "SCL" }
] as const;

export const CATEGORY_TABS: ItemCategory[] = [
  "Bases",
  "Runes",
  "Uniques",
  "Charms",
  "Jewels",
  "Rings",
  "Amulets",
  "Boots"
];

export const VERDICT_STYLES: Record<Verdict, string> = {
  Ignore: "border-zinc-700 bg-zinc-900/70 text-zinc-300",
  "Low Priority": "border-slate-700 bg-slate-900/80 text-slate-200",
  Check: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
  "Check sockets": "border-sky-500/40 bg-sky-500/10 text-sky-200",
  Keep: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  List: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  Premium: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-200"
};
