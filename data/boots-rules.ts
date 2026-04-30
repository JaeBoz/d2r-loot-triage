import { BootsCheckInput, GameMode, RingArchetype } from "@/lib/types";

export interface BootsWeightRule {
  key: keyof Omit<BootsCheckInput, "mode">;
  thresholds: Array<{ min: number; score: number }>;
}

export interface BootsSynergyRule {
  id: string;
  label: string;
  score: number;
  archetypes: RingArchetype[];
  check: (stats: Record<string, number | undefined>) => boolean;
}

export const bootsStatWeights: BootsWeightRule[] = [
  { key: "fasterRunWalk", thresholds: [{ min: 30, score: 5 }, { min: 20, score: 3 }, { min: 10, score: 1 }] },
  { key: "fasterHitRecovery", thresholds: [{ min: 20, score: 4 }, { min: 10, score: 2 }] },
  { key: "magicFind", thresholds: [{ min: 25, score: 4 }, { min: 15, score: 2 }, { min: 8, score: 1 }] },
  { key: "lightningResist", thresholds: [{ min: 35, score: 4 }, { min: 25, score: 3 }, { min: 15, score: 1 }] },
  { key: "fireResist", thresholds: [{ min: 35, score: 3 }, { min: 25, score: 2 }, { min: 15, score: 1 }] },
  { key: "coldResist", thresholds: [{ min: 35, score: 2 }, { min: 25, score: 1 }] },
  { key: "poisonResist", thresholds: [{ min: 35, score: 1 }, { min: 25, score: 1 }] },
  { key: "strength", thresholds: [{ min: 15, score: 2 }, { min: 8, score: 1 }] },
  { key: "dexterity", thresholds: [{ min: 15, score: 2 }, { min: 8, score: 1 }] },
  { key: "life", thresholds: [{ min: 30, score: 2 }, { min: 15, score: 1 }] },
  { key: "mana", thresholds: [{ min: 30, score: 1 }, { min: 15, score: 1 }] },
  { key: "manaRegen", thresholds: [{ min: 10, score: 1 }] },
  { key: "extraGold", thresholds: [{ min: 60, score: 0 }] },
  { key: "replenishLife", thresholds: [{ min: 5, score: 0 }] }
];

export const bootsSynergies: BootsSynergyRule[] = [
  {
    id: "tri-res",
    label: "tri-res utility boots",
    score: 5,
    archetypes: ["PvM"],
    check: (stats) => [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0, stats.poisonResist ?? 0].filter((value) => value >= 25).length >= 3
  },
  {
    id: "frw-dual-res",
    label: "FRW with strong resist support",
    score: 2,
    archetypes: ["PvM"],
    check: (stats) =>
      (stats.fasterRunWalk ?? 0) >= 30 &&
      [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0].filter((value) => value >= 25).length >= 2
  },
  {
    id: "frw-mf",
    label: "FRW with magic find",
    score: 2,
    archetypes: ["MF", "PvM"],
    check: (stats) => (stats.fasterRunWalk ?? 0) >= 30 && (stats.magicFind ?? 0) >= 20
  },
  {
    id: "fhr-res",
    label: "FRW, FHR, and resist support",
    score: 4,
    archetypes: ["PvP", "PvM"],
    check: (stats) =>
      (stats.fasterRunWalk ?? 0) >= 30 &&
      (stats.fasterHitRecovery ?? 0) >= 10 &&
      (stats.lightningResist ?? 0) >= 25
  },
  {
    id: "stat-res",
    label: "stats with resist utility",
    score: 2,
    archetypes: ["PvM", "niche"],
    check: (stats) =>
      ((stats.strength ?? 0) >= 10 || (stats.dexterity ?? 0) >= 10) &&
      ((stats.lightningResist ?? 0) >= 25 || (stats.fireResist ?? 0) >= 25)
  },
  {
    id: "caster-mana-utility",
    label: "caster mana utility",
    score: 1,
    archetypes: ["caster", "PvM"],
    check: (stats) =>
      (stats.fasterRunWalk ?? 0) >= 20 &&
      ((stats.mana ?? 0) >= 20 || (stats.manaRegen ?? 0) >= 10) &&
      ((stats.lightningResist ?? 0) >= 25 || (stats.fireResist ?? 0) >= 25 || (stats.coldResist ?? 0) >= 25)
  }
];

export const bootsModeAdjustments: Record<GameMode, { floorBonus: number; liquidityBias: number }> = {
  SCNL: {
    floorBonus: -1,
    liquidityBias: -1
  },
  SCL: {
    floorBonus: 1,
    liquidityBias: 1
  }
};
