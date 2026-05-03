import { CharmCheckInput, CharmSize } from "@/lib/types";

export type CharmRangeKey = keyof Omit<CharmCheckInput, "mode" | "size" | "skill">;

type CharmRangeRule = {
  max: number;
  note?: string;
};

// Charm maxima are size-specific. Poison uses displayed top combined charm rolls
// rather than a single prefix value, because poison damage is shown as one total.
// https://diablo-archive.fandom.com/wiki/Affixes_(Diablo_II)
// https://diablo2.diablowiki.net/Poison_damage_items
export const charmSizeRanges: Record<CharmSize, Partial<Record<CharmRangeKey, CharmRangeRule>>> = {
  "Small Charm": {
    life: { max: 20 },
    mana: { max: 17 },
    magicFind: { max: 7 },
    allResist: { max: 5 },
    fireResist: { max: 11 },
    lightningResist: { max: 11 },
    coldResist: { max: 11 },
    poisonResist: { max: 11 },
    fasterRunWalk: { max: 3 },
    fasterHitRecovery: { max: 5 },
    poisonDamage: { max: 451 },
    maxDamage: { max: 3 },
    attackRating: { max: 36 }
  },
  "Large Charm": {
    life: { max: 35 },
    mana: { max: 34 },
    magicFind: { max: 6 },
    allResist: { max: 8 },
    fireResist: { max: 15 },
    lightningResist: { max: 15 },
    coldResist: { max: 15 },
    poisonResist: { max: 15 },
    fasterRunWalk: { max: 5 },
    fasterHitRecovery: { max: 8 },
    poisonDamage: { max: 451 },
    maxDamage: { max: 6 },
    attackRating: { max: 77 }
  },
  "Grand Charm": {
    life: { max: 45 },
    mana: { max: 59 },
    magicFind: { max: 12 },
    allResist: { max: 15 },
    fireResist: { max: 30 },
    lightningResist: { max: 30 },
    coldResist: { max: 30 },
    poisonResist: { max: 30 },
    fasterRunWalk: { max: 7 },
    fasterHitRecovery: { max: 12 },
    poisonDamage: { max: 301 },
    maxDamage: { max: 10 },
    attackRating: { max: 132 }
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
