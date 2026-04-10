import { GameMode, JewelPatternInput, RingArchetype } from "@/lib/types";

export interface JewelSynergyRule {
  id: string;
  label: string;
  score: number;
  archetypes: RingArchetype[];
  check: (stats: JewelPatternInput) => boolean;
}

export const jewelStatWeights = {
  increasedAttackSpeed: [
    { min: 15, score: 5 },
    { min: 10, score: 3 }
  ],
  enhancedDamage: [
    { min: 35, score: 5 },
    { min: 20, score: 3 },
    { min: 10, score: 1 }
  ],
  strength: [
    { min: 8, score: 2 },
    { min: 4, score: 1 }
  ],
  dexterity: [
    { min: 8, score: 2 },
    { min: 4, score: 1 }
  ],
  life: [
    { min: 20, score: 2 },
    { min: 10, score: 1 }
  ],
  attackRating: [
    { min: 80, score: 2 },
    { min: 30, score: 1 }
  ],
  maxDamage: [
    { min: 8, score: 2 },
    { min: 4, score: 1 }
  ],
  minDamage: [
    { min: 4, score: 1 }
  ],
  allResist: [
    { min: 10, score: 4 },
    { min: 6, score: 2 }
  ],
  fireResist: [
    { min: 25, score: 2 },
    { min: 15, score: 1 }
  ],
  lightningResist: [
    { min: 25, score: 3 },
    { min: 15, score: 2 }
  ],
  coldResist: [
    { min: 25, score: 2 },
    { min: 15, score: 1 }
  ],
  poisonResist: [
    { min: 25, score: 1 },
    { min: 15, score: 1 }
  ],
  requirementsReduction: [
    { min: 15, score: 3 },
    { min: 8, score: 1 }
  ]
} as const;

export const jewelSynergies: JewelSynergyRule[] = [
  {
    id: "ias-res",
    label: "IAS with resist support",
    score: 7,
    archetypes: ["PvM", "niche"],
    check: (stats) =>
      (stats.increasedAttackSpeed ?? 0) >= 15 &&
      ((stats.allResist ?? 0) >= 6 ||
        (stats.fireResist ?? 0) >= 15 ||
        (stats.lightningResist ?? 0) >= 15 ||
        (stats.coldResist ?? 0) >= 15)
  },
  {
    id: "ias-ed",
    label: "IAS with enhanced damage",
    score: 6,
    archetypes: ["melee", "PvP"],
    check: (stats) => (stats.increasedAttackSpeed ?? 0) >= 15 && (stats.enhancedDamage ?? 0) >= 20
  },
  {
    id: "ias-stat",
    label: "IAS with stat support",
    score: 5,
    archetypes: ["PvM", "niche"],
    check: (stats) =>
      (stats.increasedAttackSpeed ?? 0) >= 15 && ((stats.strength ?? 0) >= 8 || (stats.dexterity ?? 0) >= 8)
  },
  {
    id: "ed-req",
    label: "enhanced damage with -requirements",
    score: 5,
    archetypes: ["melee", "niche"],
    check: (stats) => (stats.enhancedDamage ?? 0) >= 20 && (stats.requirementsReduction ?? 0) >= 8
  },
  {
    id: "ed-max-ar",
    label: "enhanced damage with damage or AR",
    score: 4,
    archetypes: ["melee", "PvP"],
    check: (stats) =>
      (stats.enhancedDamage ?? 0) >= 20 &&
      ((stats.maxDamage ?? 0) >= 4 || (stats.minDamage ?? 0) >= 2 || (stats.attackRating ?? 0) >= 30)
  },
  {
    id: "resist-only",
    label: "resist utility jewel",
    score: 2,
    archetypes: ["PvM"],
    check: (stats) =>
      (stats.allResist ?? 0) >= 10 ||
      [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0, stats.poisonResist ?? 0].filter(
        (value) => value >= 20
      ).length >= 2
  }
];

export const jewelModeAdjustments: Record<GameMode, { floorBonus: number; liquidityBias: number }> = {
  SCNL: {
    floorBonus: -1,
    liquidityBias: -1
  },
  SCL: {
    floorBonus: 1,
    liquidityBias: 1
  }
};
