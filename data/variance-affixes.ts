import {
  AmuletAffixKey,
  BootsAffixKey,
  JewelAffixKey,
  RingAffixKey,
  VarianceAffixDefinition,
  VarianceAffixKey,
  VarianceItemType
} from "@/lib/types";

export const varianceAffixes: VarianceAffixDefinition[] = [
  { key: "fasterCastRate", label: "FCR", itemTypes: ["ring", "amulet"], valueType: "number", impactTier: "core", evaluatorWeight: 5 },
  { key: "classSkills", label: "Class Skills", itemTypes: ["amulet"], valueType: "number", impactTier: "core", evaluatorWeight: 6 },
  { key: "strength", label: "Strength", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "dexterity", label: "Dexterity", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "life", label: "Life", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "mana", label: "Mana", itemTypes: ["ring", "amulet"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "attackRating", label: "Attack Rating", itemTypes: ["ring", "amulet", "jewel"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "allResist", label: "All Resist", itemTypes: ["ring", "amulet", "jewel"], valueType: "number", impactTier: "core", evaluatorWeight: 4 },
  { key: "fireResist", label: "Fire Resist", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "lightningResist", label: "Lightning Resist", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "core", evaluatorWeight: 3 },
  { key: "coldResist", label: "Cold Resist", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "poisonResist", label: "Poison Resist", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 1 },
  { key: "magicFind", label: "Magic Find", itemTypes: ["ring", "amulet", "boots"], valueType: "number", impactTier: "core", evaluatorWeight: 3 },
  { key: "lifeLeech", label: "Life Leech", itemTypes: ["ring", "jewel"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "manaLeech", label: "Mana Leech", itemTypes: ["ring"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "minDamage", label: "Min Damage", itemTypes: ["ring", "amulet", "jewel"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 1 },
  { key: "maxDamage", label: "Max Damage", itemTypes: ["ring", "amulet", "jewel"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "levelRequirement", label: "Level Req", itemTypes: ["ring", "amulet"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 0 },
  { key: "increasedAttackSpeed", label: "IAS", itemTypes: ["jewel"], valueType: "number", impactTier: "core", evaluatorWeight: 5 },
  { key: "enhancedDamage", label: "Enhanced Damage", itemTypes: ["jewel"], valueType: "number", impactTier: "core", evaluatorWeight: 4 },
  { key: "requirementsReduction", label: "-Req", itemTypes: ["jewel"], valueType: "number", impactTier: "secondary", evaluatorWeight: 2 },
  { key: "strengthRequirement", label: "Strength Req", itemTypes: ["jewel"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 0 },
  { key: "fasterRunWalk", label: "FRW", itemTypes: ["boots"], valueType: "number", impactTier: "core", evaluatorWeight: 5 },
  { key: "fasterHitRecovery", label: "FHR", itemTypes: ["boots"], valueType: "number", impactTier: "core", evaluatorWeight: 4 },
  { key: "energy", label: "Energy", itemTypes: ["ring", "amulet", "jewel"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 0 },
  { key: "replenishLife", label: "Replenish Life", itemTypes: ["ring", "amulet", "boots"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 0 },
  { key: "extraGold", label: "Extra Gold", itemTypes: ["ring", "amulet", "jewel", "boots"], valueType: "number", impactTier: "low-impact", evaluatorWeight: 0 }
];

export const coreAffixKeysByItemType: Record<VarianceItemType, VarianceAffixKey[]> = {
  ring: ["fasterCastRate", "strength", "dexterity", "attackRating", "allResist", "lightningResist", "magicFind", "lifeLeech", "manaLeech"],
  amulet: ["classSkills", "fasterCastRate", "strength", "life", "allResist", "lightningResist", "magicFind"],
  jewel: ["increasedAttackSpeed", "enhancedDamage", "attackRating", "allResist", "lightningResist", "requirementsReduction"],
  boots: ["fasterRunWalk", "fasterHitRecovery", "magicFind", "lightningResist", "fireResist", "coldResist"]
};

export const affixGuidanceByItemType: Record<VarianceItemType, string> = {
  ring: "Some omitted modifiers are usually low impact and do not affect trade value unless part of a niche ring pattern.",
  amulet: "Unlisted affixes are generally treated as low-impact unless they support a real caster, MF, or niche melee pattern.",
  jewel: "Unlisted affixes are usually low-impact and should not change trade value much unless they support a real jewel combo.",
  boots: "Some omitted modifiers are usually low impact and do not affect trade value unless they complete a niche utility boot."
};

export function getAffixesForItemType(itemType: VarianceItemType) {
  return varianceAffixes.filter((affix) => affix.itemTypes.includes(itemType));
}

export function getCoreAffixesForItemType(itemType: VarianceItemType) {
  const keySet = new Set(coreAffixKeysByItemType[itemType]);
  return getAffixesForItemType(itemType).filter((affix) => keySet.has(affix.key));
}

export function getOptionalAffixesForItemType(itemType: VarianceItemType) {
  const keySet = new Set(coreAffixKeysByItemType[itemType]);
  return getAffixesForItemType(itemType).filter((affix) => !keySet.has(affix.key));
}

export type RingFormAffixKey = RingAffixKey;
export type AmuletFormAffixKey = AmuletAffixKey;
export type JewelFormAffixKey = JewelAffixKey;
export type BootsFormAffixKey = BootsAffixKey;
