import type { MechanicsAffixItemType, MechanicsAffixKey } from "@/data/mechanics-affixes";

// Source-backed maxima from Diablo Archive's D2 affix master list, with crafted-only fixed mods
// included only where this app explicitly triages crafted items.
// https://diablo-archive.fandom.com/wiki/Affixes_(Diablo_II)
// https://diablo2.diablowiki.net/Craft
const itemTypeStatCaps: Partial<Record<MechanicsAffixItemType, Partial<Record<MechanicsAffixKey, number>>>> = {
  ring: {
    fasterCastRate: 10,
    strength: 25,
    dexterity: 15,
    life: 40,
    mana: 120,
    attackRating: 120,
    allResist: 11,
    fireResist: 30,
    lightningResist: 30,
    coldResist: 30,
    poisonResist: 30,
    magicFind: 15,
    lifeLeech: 8,
    manaLeech: 6,
    minDamage: 13,
    maxDamage: 4,
    energy: 20,
    replenishLife: 10,
    extraGold: 40
  },
  amulet: {
    fasterCastRate: 20,
    strength: 30,
    dexterity: 30,
    life: 100,
    mana: 120,
    allResist: 30,
    fireResist: 40,
    lightningResist: 40,
    coldResist: 40,
    poisonResist: 40,
    magicFind: 35,
    attackRating: 30,
    minDamage: 13,
    maxDamage: 4,
    energy: 30,
    replenishLife: 15,
    extraGold: 80
  },
  boots: {
    fasterRunWalk: 40,
    fasterHitRecovery: 10,
    magicFind: 35,
    fireResist: 40,
    lightningResist: 40,
    coldResist: 40,
    poisonResist: 40,
    strength: 2,
    dexterity: 15,
    life: 20,
    mana: 40,
    manaRegen: 10,
    extraGold: 80,
    replenishLife: 10
  },
  circlet: {
    fasterCastRate: 20,
    fasterRunWalk: 30,
    strength: 30,
    dexterity: 30,
    life: 100,
    allResist: 30,
    fireResist: 40,
    lightningResist: 40
  },
  jewel: {
    increasedAttackSpeed: 15,
    enhancedDamage: 40,
    strength: 9,
    dexterity: 9,
    life: 20,
    attackRating: 100,
    maxDamage: 15,
    minDamage: 10,
    allResist: 15,
    fireResist: 30,
    lightningResist: 30,
    coldResist: 30,
    poisonResist: 30,
    requirementsReduction: 15,
    energy: 9,
    extraGold: 30
  },
  glove: {
    increasedAttackSpeed: 20,
    lifeLeech: 3,
    life: 20,
    magicFind: 25,
    strength: 15,
    dexterity: 15,
    fireResist: 30,
    lightningResist: 30,
    coldResist: 30,
    poisonResist: 30
  }
};

export function getAffixValueCap(key: MechanicsAffixKey, itemType?: MechanicsAffixItemType) {
  const itemCap = itemType ? itemTypeStatCaps[itemType]?.[key] : undefined;
  if (itemCap !== undefined) {
    return itemCap;
  }

  return undefined;
}

export function clampNumericAffixValue(key: MechanicsAffixKey, value: number, itemType?: MechanicsAffixItemType) {
  const safeValue = Math.max(0, value);
  const cap = getAffixValueCap(key, itemType);

  return cap === undefined ? safeValue : Math.min(safeValue, cap);
}

export function clampAffixInputValue(key: MechanicsAffixKey, value: string, itemType?: MechanicsAffixItemType) {
  if (value.trim() === "") {
    return "";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return "";
  }

  return String(clampNumericAffixValue(key, numericValue, itemType));
}
