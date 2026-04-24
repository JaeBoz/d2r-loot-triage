import { AmuletCheckInput, CharmCheckInput, CircletCheckInput, VarianceAffixKey, VarianceItemType } from "@/lib/types";

export type MechanicsAffixItemType = VarianceItemType | "charm" | "circlet";
export type AmuletMechanicsAffixKey = keyof Omit<AmuletCheckInput, "mode">;
export type CharmMechanicsAffixKey = keyof Omit<CharmCheckInput, "mode" | "size" | "skill">;
export type CircletMechanicsAffixKey = keyof Omit<CircletCheckInput, "mode" | "family" | "quality" | "skillMode">;
export type MechanicsAffixKey = VarianceAffixKey | AmuletMechanicsAffixKey | CharmMechanicsAffixKey | CircletMechanicsAffixKey;

const validAffixKeysByItemType: Partial<Record<MechanicsAffixItemType, readonly MechanicsAffixKey[]>> = {
  boots: [
    "fasterRunWalk",
    "fasterHitRecovery",
    "magicFind",
    "fireResist",
    "lightningResist",
    "coldResist",
    "poisonResist",
    "strength",
    "dexterity",
    "life",
    "mana",
    "manaRegen",
    "extraGold",
    "replenishLife"
  ],
  amulet: [
    "classSkills",
    "classSkillType",
    "skillTreeSkills",
    "skillTreeType",
    "fasterCastRate",
    "strength",
    "dexterity",
    "life",
    "mana",
    "allResist",
    "fireResist",
    "lightningResist",
    "coldResist",
    "poisonResist",
    "magicFind",
    "attackRating",
    "minDamage",
    "maxDamage",
    "levelRequirement",
    "energy",
    "replenishLife",
    "extraGold"
  ],
  circlet: [
    "classSkillType",
    "classSkillValue",
    "skillTreeType",
    "skillTreeValue",
    "fasterCastRate",
    "fasterRunWalk",
    "sockets",
    "strength",
    "dexterity",
    "life",
    "allResist",
    "fireResist",
    "lightningResist"
  ],
  charm: [
    "life",
    "mana",
    "magicFind",
    "allResist",
    "fireResist",
    "lightningResist",
    "coldResist",
    "poisonResist",
    "fasterRunWalk",
    "fasterHitRecovery",
    "poisonDamage",
    "maxDamage",
    "attackRating"
  ]
};

export function isValidMechanicsAffix(itemType: MechanicsAffixItemType, key: MechanicsAffixKey) {
  const validKeys = validAffixKeysByItemType[itemType];
  return !validKeys || validKeys.includes(key);
}

export function filterValidMechanicsAffixes<T extends { key: MechanicsAffixKey }>(itemType: MechanicsAffixItemType, affixes: T[]) {
  return affixes.filter((affix) => isValidMechanicsAffix(itemType, affix.key));
}

export function sanitizeMechanicsInput<T extends object>(itemType: MechanicsAffixItemType, input: T) {
  const validKeys = validAffixKeysByItemType[itemType];
  if (!validKeys) {
    return input;
  }

  const validKeySet = new Set<string>(validKeys);
  return Object.fromEntries(Object.entries(input).filter(([key]) => validKeySet.has(key))) as Partial<T>;
}
