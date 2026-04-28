import { GloveCheckInput, GloveQuality, GloveSkillType, RingArchetype } from "@/lib/types";

export type GlovePatternRule = {
  id: string;
  label: string;
  score: number;
  archetypes: RingArchetype[];
  check: (input: GloveCheckInput) => boolean;
};

export const gloveQualityBias: Record<GloveQuality, number> = {
  Magic: 0,
  Rare: 0,
  Crafted: 0
};

export const gloveSkillDemand: Record<GloveSkillType, number> = {
  None: 0,
  "Javelin and Spear": 4,
  "Bow and Crossbow": 2,
  "Martial Arts": 2
};

export const glovePatternRules: GlovePatternRule[] = [
  {
    id: "magic-jav-3-20",
    label: "+3 Jav / 20 IAS",
    score: 12,
    archetypes: ["PvM"],
    check: (input) =>
      input.quality === "Magic" &&
      input.skillType === "Javelin and Spear" &&
      input.skillLevel === 3 &&
      input.increasedAttackSpeed === 20
  },
  {
    id: "magic-jav-2-20",
    label: "+2 Jav / 20 IAS",
    score: 7,
    archetypes: ["PvM"],
    check: (input) =>
      input.quality === "Magic" &&
      input.skillType === "Javelin and Spear" &&
      input.skillLevel === 2 &&
      input.increasedAttackSpeed === 20
  },
  {
    id: "magic-offskill-ias",
    label: "skill + 20 IAS",
    score: 1,
    archetypes: ["niche"],
    check: (input) =>
      input.quality === "Magic" &&
      input.skillType !== "None" &&
      input.skillType !== "Javelin and Spear" &&
      input.skillLevel >= 2 &&
      input.increasedAttackSpeed === 20
  },
  {
    id: "rare-crafted-skill-ias",
    label: "skills + IAS",
    score: 6,
    archetypes: ["PvM"],
    check: (input) => input.quality !== "Magic" && input.skillType !== "None" && input.skillLevel >= 2 && input.increasedAttackSpeed === 20
  },
  {
    id: "blood-cb-ias",
    label: "IAS + Crushing Blow",
    score: 5,
    archetypes: ["melee"],
    check: (input) => input.quality === "Crafted" && input.increasedAttackSpeed === 20 && (input.crushingBlow ?? 0) >= 5
  },
  {
    id: "ias-support",
    label: "IAS + strong support",
    score: 5,
    archetypes: ["niche"],
    check: (input) =>
      input.increasedAttackSpeed === 20 &&
      input.quality !== "Magic" &&
      (input.quality !== "Crafted" || (input.crushingBlow ?? 0) < 5) &&
      ((input.resistSupport ?? 0) >= 25 ||
        (input.magicFind ?? 0) >= 20 ||
        (input.strength ?? 0) >= 10 ||
        (input.dexterity ?? 0) >= 10)
  }
];
