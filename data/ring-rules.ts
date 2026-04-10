import { GameMode, RingArchetype } from "@/lib/types";

export interface RingWeightRule {
  key:
    | "fasterCastRate"
    | "strength"
    | "dexterity"
    | "life"
    | "mana"
    | "attackRating"
    | "allResist"
    | "fireResist"
    | "lightningResist"
    | "coldResist"
    | "poisonResist"
    | "magicFind"
    | "lifeLeech"
    | "manaLeech"
    | "minDamage"
    | "maxDamage";
  label: string;
  thresholds: Array<{ min: number; score: number }>;
}

export interface RingSynergyRule {
  id: string;
  label: string;
  score: number;
  archetypes: RingArchetype[];
  check: (stats: Record<string, number | undefined>) => boolean;
}

export const ringStatWeights: RingWeightRule[] = [
  { key: "fasterCastRate", label: "FCR", thresholds: [{ min: 10, score: 5 }, { min: 8, score: 4 }, { min: 5, score: 2 }] },
  { key: "strength", label: "strength", thresholds: [{ min: 18, score: 3 }, { min: 10, score: 2 }, { min: 5, score: 1 }] },
  { key: "dexterity", label: "dexterity", thresholds: [{ min: 15, score: 3 }, { min: 10, score: 2 }, { min: 5, score: 1 }] },
  { key: "life", label: "life", thresholds: [{ min: 40, score: 3 }, { min: 25, score: 2 }, { min: 10, score: 1 }] },
  { key: "mana", label: "mana", thresholds: [{ min: 70, score: 3 }, { min: 40, score: 2 }, { min: 20, score: 1 }] },
  { key: "attackRating", label: "attack rating", thresholds: [{ min: 100, score: 3 }, { min: 60, score: 2 }, { min: 30, score: 1 }] },
  { key: "allResist", label: "all resist", thresholds: [{ min: 10, score: 5 }, { min: 7, score: 4 }, { min: 4, score: 2 }] },
  { key: "fireResist", label: "fire resist", thresholds: [{ min: 25, score: 2 }, { min: 15, score: 1 }] },
  { key: "lightningResist", label: "lightning resist", thresholds: [{ min: 25, score: 3 }, { min: 15, score: 2 }, { min: 10, score: 1 }] },
  { key: "coldResist", label: "cold resist", thresholds: [{ min: 25, score: 2 }, { min: 15, score: 1 }] },
  { key: "poisonResist", label: "poison resist", thresholds: [{ min: 25, score: 1 }, { min: 15, score: 1 }] },
  { key: "magicFind", label: "magic find", thresholds: [{ min: 20, score: 3 }, { min: 10, score: 2 }, { min: 5, score: 1 }] },
  { key: "lifeLeech", label: "life leech", thresholds: [{ min: 6, score: 3 }, { min: 4, score: 2 }, { min: 2, score: 1 }] },
  { key: "manaLeech", label: "mana leech", thresholds: [{ min: 6, score: 3 }, { min: 4, score: 2 }, { min: 2, score: 1 }] },
  { key: "minDamage", label: "min damage", thresholds: [{ min: 5, score: 2 }, { min: 3, score: 1 }] },
  { key: "maxDamage", label: "max damage", thresholds: [{ min: 10, score: 2 }, { min: 5, score: 1 }] }
];

export const ringSynergies: RingSynergyRule[] = [
  {
    id: "caster-core",
    label: "FCR with strength",
    score: 3,
    archetypes: ["caster"],
    check: (stats) => (stats.fasterCastRate ?? 0) >= 10 && (stats.strength ?? 0) >= 8
  },
  {
    id: "caster-res",
    label: "FCR with all resist",
    score: 4,
    archetypes: ["caster", "PvM"],
    check: (stats) => (stats.fasterCastRate ?? 0) >= 10 && (stats.allResist ?? 0) >= 7
  },
  {
    id: "caster-dual-res",
    label: "FCR with dual useful resists",
    score: 3,
    archetypes: ["caster", "PvM"],
    check: (stats) =>
      (stats.fasterCastRate ?? 0) >= 10 &&
      [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0].filter((value) => value >= 15).length >= 2
  },
  {
    id: "dual-leech-ar",
    label: "dual leech with attack rating",
    score: 4,
    archetypes: ["melee", "PvM"],
    check: (stats) => (stats.lifeLeech ?? 0) >= 4 && (stats.manaLeech ?? 0) >= 4 && (stats.attackRating ?? 0) >= 60
  },
  {
    id: "melee-attributes",
    label: "strength, dexterity, and AR",
    score: 3,
    archetypes: ["melee", "PvP"],
    check: (stats) => (stats.strength ?? 0) >= 8 && (stats.dexterity ?? 0) >= 8 && (stats.attackRating ?? 0) >= 60
  },
  {
    id: "mf-resist",
    label: "magic find with resist support",
    score: 2,
    archetypes: ["MF", "niche"],
    check: (stats) => (stats.magicFind ?? 0) >= 10 && ((stats.allResist ?? 0) >= 5 || (stats.lightningResist ?? 0) >= 20)
  },
  {
    id: "life-res",
    label: "life with resist support",
    score: 2,
    archetypes: ["PvM"],
    check: (stats) => (stats.life ?? 0) >= 25 && ((stats.allResist ?? 0) >= 5 || (stats.lightningResist ?? 0) >= 20)
  },
  {
    id: "pvp-caster",
    label: "FCR with dexterity and life",
    score: 2,
    archetypes: ["caster", "PvP"],
    check: (stats) => (stats.fasterCastRate ?? 0) >= 10 && (stats.dexterity ?? 0) >= 8 && (stats.life ?? 0) >= 20
  }
];

export const ringModeAdjustments: Record<GameMode, { floorBonus: number; liquidityBias: number }> = {
  SCNL: {
    floorBonus: -1,
    liquidityBias: -1
  },
  SCL: {
    floorBonus: 1,
    liquidityBias: 1
  }
};
