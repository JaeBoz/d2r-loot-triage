import type { MechanicsAffixKey } from "@/data/mechanics-affixes";

const sharedStatCaps: Partial<Record<MechanicsAffixKey, number>> = {
  strength: 40,
  dexterity: 40,
  life: 100,
  mana: 100,
  allResist: 30,
  fireResist: 50,
  lightningResist: 50,
  coldResist: 50,
  poisonResist: 50,
  fasterCastRate: 20,
  fasterRunWalk: 30,
  fasterHitRecovery: 20,
  increasedAttackSpeed: 15,
  enhancedDamage: 40,
  requirementsReduction: 15
};

export function getAffixValueCap(key: MechanicsAffixKey) {
  return sharedStatCaps[key];
}

export function clampNumericAffixValue(key: MechanicsAffixKey, value: number) {
  const safeValue = Math.max(0, value);
  const cap = getAffixValueCap(key);

  return cap === undefined ? safeValue : Math.min(safeValue, cap);
}

export function clampAffixInputValue(key: MechanicsAffixKey, value: string) {
  if (value.trim() === "") {
    return "";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return "";
  }

  return String(clampNumericAffixValue(key, numericValue));
}
