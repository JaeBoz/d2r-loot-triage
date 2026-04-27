import { CharmPatternInput, CharmSize, GameMode, RingArchetype } from "@/lib/types";

const hasUsefulSingleResist = (stats: CharmPatternInput) =>
  (Number(stats.fireResist) || 0) >= 8 ||
  (Number(stats.lightningResist) || 0) >= 8 ||
  (Number(stats.coldResist) || 0) >= 8 ||
  (Number(stats.poisonResist) || 0) >= 8;

const hasUsefulLargeResist = (stats: CharmPatternInput) =>
  (Number(stats.fireResist) || 0) >= 10 ||
  (Number(stats.lightningResist) || 0) >= 10 ||
  (Number(stats.coldResist) || 0) >= 10 ||
  (Number(stats.poisonResist) || 0) >= 10;

const hasUsefulGrandResist = (stats: CharmPatternInput) =>
  (Number(stats.fireResist) || 0) >= 20 ||
  (Number(stats.lightningResist) || 0) >= 20 ||
  (Number(stats.coldResist) || 0) >= 20 ||
  (Number(stats.poisonResist) || 0) >= 20;

export interface CharmPatternRule {
  id: string;
  size: CharmSize | "Any";
  label: string;
  score: number;
  verdictFloor?: "Check" | "Keep" | "List" | "Premium";
  archetypes: RingArchetype[];
  check: (stats: CharmPatternInput) => boolean;
}

export const charmPatterns: CharmPatternRule[] = [
  {
    id: "sc-frw",
    size: "Small Charm",
    label: "FRW utility",
    score: 5,
    verdictFloor: "Check",
    archetypes: ["PvP", "PvM"],
    check: (stats) => (Number(stats.fasterRunWalk) || 0) >= 3
  },
  {
    id: "sc-frw-res",
    size: "Small Charm",
    label: "FRW with resist",
    score: 7,
    verdictFloor: "Keep",
    archetypes: ["PvP", "PvM"],
    check: (stats) => (Number(stats.fasterRunWalk) || 0) >= 3 && ((Number(stats.allResist) || 0) >= 4 || hasUsefulSingleResist(stats))
  },
  {
    id: "sc-life-res",
    size: "Small Charm",
    label: "life with resist",
    score: 7,
    verdictFloor: "Keep",
    archetypes: ["PvM"],
    check: (stats) => (Number(stats.life) || 0) >= 15 && ((Number(stats.allResist) || 0) >= 4 || hasUsefulSingleResist(stats))
  },
  {
    id: "sc-mf",
    size: "Small Charm",
    label: "magic find",
    score: 6,
    verdictFloor: "Check",
    archetypes: ["MF"],
    check: (stats) => (Number(stats.magicFind) || 0) >= 6
  },
  {
    id: "sc-life-mana",
    size: "Small Charm",
    label: "life and mana",
    score: 5,
    verdictFloor: "Check",
    archetypes: ["PvM", "niche"],
    check: (stats) => (Number(stats.life) || 0) >= 15 && (Number(stats.mana) || 0) >= 12
  },
  {
    id: "sc-poison",
    size: "Small Charm",
    label: "moderate poison damage",
    score: 5,
    verdictFloor: "Check",
    archetypes: ["PvP", "niche"],
    check: (stats) => (Number(stats.poisonDamage) || 0) >= 100 && (Number(stats.poisonDamage) || 0) < 450
  },
  {
    id: "sc-poison-top",
    size: "Small Charm",
    label: "top poison damage",
    score: 17,
    verdictFloor: "Premium",
    archetypes: ["PvP", "niche"],
    check: (stats) => (Number(stats.poisonDamage) || 0) >= 450
  },
  {
    id: "sc-max-ar-life",
    size: "Small Charm",
    label: "max damage, AR, and life",
    score: 9,
    verdictFloor: "List",
    archetypes: ["melee", "PvP"],
    check: (stats) =>
      (Number(stats.maxDamage) || 0) >= 2 && (Number(stats.attackRating) || 0) >= 10 && (Number(stats.life) || 0) >= 10
  },
  {
    id: "gc-skiller",
    size: "Grand Charm",
    label: "skiller",
    score: 9,
    verdictFloor: "List",
    archetypes: ["caster", "PvM"],
    check: (stats) => typeof stats.skill === "string" && stats.skill.trim().length > 0
  },
  {
    id: "gc-skiller-life",
    size: "Grand Charm",
    label: "skiller with moderate life",
    score: 11,
    verdictFloor: "List",
    archetypes: ["caster", "PvM"],
    check: (stats) =>
      typeof stats.skill === "string" &&
      stats.skill.trim().length > 0 &&
      (Number(stats.life) || 0) >= 20 &&
      (Number(stats.life) || 0) < 35
  },
  {
    id: "gc-skiller-life-strong",
    size: "Grand Charm",
    label: "skiller with strong life",
    score: 16,
    verdictFloor: "Premium",
    archetypes: ["caster", "PvM"],
    check: (stats) =>
      typeof stats.skill === "string" &&
      stats.skill.trim().length > 0 &&
      (Number(stats.life) || 0) >= 35
  },
  {
    id: "gc-skiller-fhr",
    size: "Grand Charm",
    label: "skiller with FHR",
    score: 14,
    verdictFloor: "Premium",
    archetypes: ["caster", "PvP"],
    check: (stats) => typeof stats.skill === "string" && stats.skill.trim().length > 0 && (Number(stats.fasterHitRecovery) || 0) >= 12
  },
  {
    id: "gc-res-life",
    size: "Grand Charm",
    label: "life with resists",
    score: 5,
    verdictFloor: "Check",
    archetypes: ["PvM"],
    check: (stats) => (Number(stats.life) || 0) >= 25 && ((Number(stats.allResist) || 0) >= 10 || hasUsefulGrandResist(stats))
  },
  {
    id: "lc-basic-mf",
    size: "Large Charm",
    label: "basic magic find",
    score: 2,
    verdictFloor: "Check",
    archetypes: ["MF"],
    check: (stats) => (Number(stats.magicFind) || 0) >= 4
  },
  {
    id: "lc-life-res",
    size: "Large Charm",
    label: "life with resist",
    score: 4,
    verdictFloor: "Check",
    archetypes: ["PvM"],
    check: (stats) => (Number(stats.life) || 0) >= 20 && ((Number(stats.allResist) || 0) >= 5 || hasUsefulLargeResist(stats))
  },
  {
    id: "any-fhr-res",
    size: "Any",
    label: "FHR with resists",
    score: 3,
    verdictFloor: "Check",
    archetypes: ["PvP", "PvM"],
    check: (stats) => (Number(stats.fasterHitRecovery) || 0) > 0 && ((Number(stats.allResist) || 0) >= 4 || hasUsefulSingleResist(stats))
  }
];

export const charmModeAdjustments: Record<GameMode, { scoreBias: number; liquidityBias: number }> = {
  SCNL: {
    scoreBias: -1,
    liquidityBias: -1
  },
  SCL: {
    scoreBias: 1,
    liquidityBias: 1
  }
};
