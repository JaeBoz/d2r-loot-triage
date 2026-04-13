import { GameMode, RingArchetype } from "@/lib/types";

export interface AmuletWeightRule {
  key:
    | "classSkills"
    | "skillTreeSkills"
    | "fasterCastRate"
    | "strength"
    | "dexterity"
    | "life"
    | "mana"
    | "allResist"
    | "fireResist"
    | "lightningResist"
    | "coldResist"
    | "poisonResist"
    | "magicFind"
    | "attackRating"
    | "minDamage"
    | "maxDamage";
  label: string;
  thresholds: Array<{ min: number; score: number }>;
}

export interface AmuletSynergyRule {
  id: string;
  label: string;
  score: number;
  archetypes: RingArchetype[];
  check: (stats: Record<string, number | undefined>) => boolean;
}

export const amuletStatWeights: AmuletWeightRule[] = [
  { key: "classSkills", label: "class skills", thresholds: [{ min: 2, score: 6 }, { min: 1, score: 3 }] },
  { key: "skillTreeSkills", label: "skill tree skills", thresholds: [{ min: 2, score: 4 }, { min: 1, score: 2 }] },
  { key: "fasterCastRate", label: "FCR", thresholds: [{ min: 20, score: 6 }, { min: 10, score: 4 }, { min: 5, score: 2 }] },
  { key: "strength", label: "strength", thresholds: [{ min: 20, score: 3 }, { min: 10, score: 2 }, { min: 5, score: 1 }] },
  { key: "dexterity", label: "dexterity", thresholds: [{ min: 15, score: 3 }, { min: 10, score: 2 }, { min: 5, score: 1 }] },
  { key: "life", label: "life", thresholds: [{ min: 50, score: 4 }, { min: 30, score: 3 }, { min: 15, score: 1 }] },
  { key: "mana", label: "mana", thresholds: [{ min: 80, score: 3 }, { min: 50, score: 2 }, { min: 25, score: 1 }] },
  { key: "allResist", label: "all resist", thresholds: [{ min: 20, score: 5 }, { min: 12, score: 4 }, { min: 7, score: 2 }] },
  { key: "fireResist", label: "fire resist", thresholds: [{ min: 25, score: 2 }, { min: 15, score: 1 }] },
  { key: "lightningResist", label: "lightning resist", thresholds: [{ min: 30, score: 3 }, { min: 20, score: 2 }, { min: 10, score: 1 }] },
  { key: "coldResist", label: "cold resist", thresholds: [{ min: 25, score: 2 }, { min: 15, score: 1 }] },
  { key: "poisonResist", label: "poison resist", thresholds: [{ min: 25, score: 1 }, { min: 15, score: 1 }] },
  { key: "magicFind", label: "magic find", thresholds: [{ min: 25, score: 3 }, { min: 15, score: 2 }, { min: 7, score: 1 }] },
  { key: "attackRating", label: "attack rating", thresholds: [{ min: 100, score: 3 }, { min: 60, score: 2 }, { min: 30, score: 1 }] },
  { key: "minDamage", label: "min damage", thresholds: [{ min: 5, score: 2 }, { min: 3, score: 1 }] },
  { key: "maxDamage", label: "max damage", thresholds: [{ min: 10, score: 2 }, { min: 5, score: 1 }] }
];

export const amuletSynergies: AmuletSynergyRule[] = [
  {
    id: "skills-fcr",
    label: "+skills with FCR",
    score: 5,
    archetypes: ["caster", "PvP"],
    check: (stats) => ((stats.classSkills ?? 0) >= 2 || (stats.skillTreeSkills ?? 0) >= 2) && (stats.fasterCastRate ?? 0) >= 10
  },
  {
    id: "skills-res",
    label: "+skills with all resist",
    score: 4,
    archetypes: ["caster", "PvM"],
    check: (stats) => ((stats.classSkills ?? 0) >= 2 || (stats.skillTreeSkills ?? 0) >= 2) && (stats.allResist ?? 0) >= 10
  },
  {
    id: "skills-life",
    label: "+skills with life",
    score: 3,
    archetypes: ["caster", "PvM"],
    check: (stats) => ((stats.classSkills ?? 0) >= 2 || (stats.skillTreeSkills ?? 0) >= 2) && (stats.life ?? 0) >= 25
  },
  {
    id: "fcr-res",
    label: "FCR with resist support",
    score: 3,
    archetypes: ["caster", "PvM"],
    check: (stats) =>
      (stats.fasterCastRate ?? 0) >= 10 &&
      ((stats.allResist ?? 0) >= 7 ||
        [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0].filter((value) => value >= 20).length >= 2)
  },
  {
    id: "stats-life-res",
    label: "stats with life and resist",
    score: 3,
    archetypes: ["PvM", "niche"],
    check: (stats) =>
      ((stats.strength ?? 0) >= 10 || (stats.dexterity ?? 0) >= 10) &&
      (stats.life ?? 0) >= 20 &&
      ((stats.allResist ?? 0) >= 7 || (stats.lightningResist ?? 0) >= 20)
  },
  {
    id: "mf-res",
    label: "magic find with resist support",
    score: 2,
    archetypes: ["MF"],
    check: (stats) => (stats.magicFind ?? 0) >= 12 && ((stats.allResist ?? 0) >= 7 || (stats.lightningResist ?? 0) >= 20)
  },
  {
    id: "melee-core",
    label: "AR with stats and damage",
    score: 3,
    archetypes: ["melee", "niche"],
    check: (stats) =>
      (stats.attackRating ?? 0) >= 60 &&
      ((stats.strength ?? 0) >= 8 || (stats.dexterity ?? 0) >= 8) &&
      ((stats.minDamage ?? 0) >= 3 || (stats.maxDamage ?? 0) >= 5)
  }
];

export const amuletModeAdjustments: Record<GameMode, { floorBonus: number; liquidityBias: number }> = {
  SCNL: {
    floorBonus: -1,
    liquidityBias: -1
  },
  SCL: {
    floorBonus: 1,
    liquidityBias: 1
  }
};
