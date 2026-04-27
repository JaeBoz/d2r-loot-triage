import { CircletClassSkill, CircletFamily, CircletQuality, CircletSkillTree } from "@/lib/types";

export const circletFamilies: Array<{
  family: CircletFamily;
  maxMagicSockets: number;
  demandNote: string;
  familyBias: number;
}> = [
  {
    family: "Circlet",
    maxMagicSockets: 2,
    demandNote: "Entry circlet base. Still worth checking for real skill or utility jackpots.",
    familyBias: 0
  },
  {
    family: "Coronet",
    maxMagicSockets: 2,
    demandNote: "Coronets can hit real caster or utility patterns, but need stronger mods to stand out.",
    familyBias: 0
  },
  {
    family: "Tiara",
    maxMagicSockets: 3,
    demandNote: "Tiara is a stronger base for magic socket hits and polished rare circlets.",
    familyBias: 1
  },
  {
    family: "Diadem",
    maxMagicSockets: 3,
    demandNote: "Diadem is the premium circlet base. Great rolls matter more here.",
    familyBias: 2
  }
];

export const circletClassSkillDemand: Record<CircletClassSkill, number> = {
  "Amazon Skills": 1,
  "Assassin Skills": 2,
  "Barbarian Skills": 0,
  "Druid Skills": 1,
  "Necromancer Skills": 2,
  "Paladin Skills": 2,
  "Sorceress Skills": 3
};

export const circletTreeSkillDemand: Record<CircletSkillTree, number> = {
  "Amazon Passive and Magic Skills": 1,
  "Assassin Traps": 3,
  "Druid Elemental Skills": 2,
  "Necromancer Poison and Bone Skills": 2,
  "Paladin Combat Skills": 2,
  "Sorceress Cold Spells": 3,
  "Sorceress Lightning Spells": 3
};

export const circletQualityNotes: Record<CircletQuality, string> = {
  Magic: "Magic circlets usually need one narrow jackpot package: +skills with 20 FCR or strong sockets.",
  Rare: "Rare circlets need skills, FCR, movement, stats, or resists to come together."
};
