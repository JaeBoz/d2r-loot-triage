import { CharmCheckInput, CharmSize } from "@/lib/types";

export type CharmRangeKey = keyof Omit<CharmCheckInput, "mode" | "size" | "skill">;

type CharmRangeRule = {
  max: number;
  note?: string;
};

export const charmSizeRanges: Record<CharmSize, Partial<Record<CharmRangeKey, CharmRangeRule>>> = {
  "Small Charm": {
    life: { max: 20 },
    magicFind: { max: 7 },
    fasterRunWalk: { max: 3 }
  },
  "Large Charm": {
    life: { max: 35 },
    magicFind: { max: 6 },
    fasterRunWalk: { max: 5 }
  },
  "Grand Charm": {
    life: { max: 50 },
    magicFind: { max: 12 },
    fasterRunWalk: { max: 7, note: "Grand charm FRW is source-backed at 7%." },
    fasterHitRecovery: { max: 12 }
  }
};

export function getCharmRangeRule(size: CharmSize, key: CharmRangeKey) {
  return charmSizeRanges[size][key];
}

export function clampCharmValue(size: CharmSize, key: CharmRangeKey, value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  const rule = getCharmRangeRule(size, key);
  const nonNegativeValue = Math.max(0, value);
  return rule ? Math.min(nonNegativeValue, rule.max) : nonNegativeValue;
}

export function sanitizeCharmSizeInput(input: CharmCheckInput): CharmCheckInput {
  return {
    ...input,
    life: clampCharmValue(input.size, "life", input.life),
    magicFind: clampCharmValue(input.size, "magicFind", input.magicFind),
    fasterRunWalk: clampCharmValue(input.size, "fasterRunWalk", input.fasterRunWalk),
    fasterHitRecovery: clampCharmValue(input.size, "fasterHitRecovery", input.fasterHitRecovery)
  };
}
