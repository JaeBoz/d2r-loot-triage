export type GameMode = "SCNL" | "SCL";
export type Ruleset = "lod" | "warlock";
export type BasePriorityTier = "low" | "medium" | "high" | "premium";
export type EthPriority = "low" | "medium" | "high" | "required";
export type EvaluationPriority =
  | "Trash"
  | "Low Trade Value"
  | "Moderate Trade Value"
  | "High Trade Value"
  | "Premium Trade Value";
export type Liquidity = "Low" | "Medium" | "High";

export type ItemCategory =
  | "Bases"
  | "Circlets"
  | "Runes"
  | "Uniques"
  | "Charms"
  | "Jewels"
  | "Rings"
  | "Amulets"
  | "Boots"
  | "Gloves";

export type Verdict = "Ignore" | "Low Priority" | "Check" | "Check sockets" | "Keep" | "List" | "Premium";
export type RingArchetype = "caster" | "melee" | "PvM" | "PvP" | "MF" | "niche";
export type CharmSize = "Small Charm" | "Large Charm" | "Grand Charm";
export type VarianceItemType = "ring" | "amulet" | "jewel" | "boots";
export type AffixImpactTier = "core" | "secondary" | "low-impact";
export type AffixValueType = "number";
export type AmuletClassSkill =
  | "Amazon Skills"
  | "Assassin Skills"
  | "Barbarian Skills"
  | "Druid Skills"
  | "Necromancer Skills"
  | "Paladin Skills"
  | "Sorceress Skills";
export type AmuletSkillTier = 1 | 2;
export type AmuletSkillTree =
  | "Amazon Passive and Magic Skills"
  | "Amazon Javelin and Spear Skills"
  | "Assassin Traps"
  | "Barbarian Warcries"
  | "Druid Elemental Skills"
  | "Druid Summoning Skills"
  | "Necromancer Poison and Bone Skills"
  | "Paladin Combat Skills"
  | "Paladin Offensive Auras"
  | "Sorceress Cold Spells"
  | "Sorceress Lightning Spells";
export type CircletFamily = "Circlet" | "Coronet" | "Tiara" | "Diadem";
export type CircletQuality = "Magic" | "Rare";
export type CircletSkillMode = "none" | "class" | "tree";
export type CircletSkillTier = 1 | 2 | 3;
export type CircletClassSkill =
  | "Amazon Skills"
  | "Assassin Skills"
  | "Barbarian Skills"
  | "Druid Skills"
  | "Necromancer Skills"
  | "Paladin Skills"
  | "Sorceress Skills";
export type CircletSkillTree =
  | "Amazon Passive and Magic Skills"
  | "Assassin Traps"
  | "Druid Elemental Skills"
  | "Necromancer Poison and Bone Skills"
  | "Paladin Combat Skills"
  | "Sorceress Cold Spells"
  | "Sorceress Lightning Spells";

export interface BaseItem {
  id: string;
  name: string;
  category: "Weapon" | "Polearm" | "Armor" | "Shield" | "Helm";
  validSockets: number[];
  desiredSockets: number[];
  socketSensitive: boolean;
  etherealAllowed: boolean;
  ethPriority: EthPriority;
  scnlPriority: BasePriorityTier;
  sclPriority: BasePriorityTier;
  levelBand: string;
  tags: string[];
  notes: string;
  runewordUseCases: string[];
}

export interface BaseCheckInput {
  mode: GameMode;
  itemId: string;
  sockets: number;
  ethereal: boolean;
  superior: boolean;
  defenseOrEd?: number;
  durabilityBonus?: number;
  allRes?: number;
}

export interface BaseCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
}

export interface BaseReferenceData {
  focus: string[];
  highDemand: string[];
}

export interface RingCheckInput {
  mode: GameMode;
  fasterCastRate?: number;
  strength?: number;
  dexterity?: number;
  life?: number;
  mana?: number;
  attackRating?: number;
  allResist?: number;
  fireResist?: number;
  lightningResist?: number;
  coldResist?: number;
  poisonResist?: number;
  magicFind?: number;
  lifeLeech?: number;
  manaLeech?: number;
  minDamage?: number;
  maxDamage?: number;
  levelRequirement?: number;
  energy?: number;
  replenishLife?: number;
  extraGold?: number;
}

export interface RingCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export type RingAffixKey =
  | keyof Omit<RingCheckInput, "mode">
  | "energy"
  | "replenishLife"
  | "extraGold";

export interface AmuletCheckInput {
  mode: GameMode;
  classSkills?: number;
  classSkillType?: AmuletClassSkill;
  skillTreeSkills?: number;
  skillTreeType?: AmuletSkillTree;
  fasterCastRate?: number;
  strength?: number;
  dexterity?: number;
  life?: number;
  mana?: number;
  allResist?: number;
  fireResist?: number;
  lightningResist?: number;
  coldResist?: number;
  poisonResist?: number;
  magicFind?: number;
  attackRating?: number;
  minDamage?: number;
  maxDamage?: number;
  levelRequirement?: number;
  energy?: number;
  replenishLife?: number;
  extraGold?: number;
}

export interface AmuletCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export type AmuletAffixKey =
  | keyof Omit<AmuletCheckInput, "mode">
  | "energy"
  | "replenishLife"
  | "extraGold";


export interface CharmCheckInput {
  mode: GameMode;
  size: CharmSize;
  life?: number;
  mana?: number;
  magicFind?: number;
  allResist?: number;
  fireResist?: number;
  lightningResist?: number;
  coldResist?: number;
  poisonResist?: number;
  fasterRunWalk?: number;
  fasterHitRecovery?: number;
  poisonDamage?: number;
  skill?: string;
  maxDamage?: number;
  attackRating?: number;
}

export type CharmPatternInput = Pick<
  CharmCheckInput,
  | "size"
  | "life"
  | "mana"
  | "magicFind"
  | "allResist"
  | "fireResist"
  | "lightningResist"
  | "coldResist"
  | "poisonResist"
  | "fasterRunWalk"
  | "fasterHitRecovery"
  | "poisonDamage"
  | "skill"
  | "maxDamage"
  | "attackRating"
>;

export interface CharmCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export interface JewelCheckInput {
  mode: GameMode;
  increasedAttackSpeed?: number;
  enhancedDamage?: number;
  strength?: number;
  dexterity?: number;
  life?: number;
  attackRating?: number;
  maxDamage?: number;
  minDamage?: number;
  allResist?: number;
  fireResist?: number;
  lightningResist?: number;
  coldResist?: number;
  poisonResist?: number;
  requirementsReduction?: number;
  energy?: number;
  extraGold?: number;
}

export type JewelPatternInput = Pick<
  JewelCheckInput,
  | "increasedAttackSpeed"
  | "enhancedDamage"
  | "strength"
  | "dexterity"
  | "life"
  | "attackRating"
  | "maxDamage"
  | "minDamage"
  | "allResist"
  | "fireResist"
  | "lightningResist"
  | "coldResist"
  | "poisonResist"
  | "requirementsReduction"
>;

export interface JewelCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export type JewelAffixKey =
  | keyof Omit<JewelCheckInput, "mode">
  | "energy"
  | "extraGold";

export interface BootsCheckInput {
  mode: GameMode;
  fasterRunWalk?: number;
  fasterHitRecovery?: number;
  magicFind?: number;
  fireResist?: number;
  lightningResist?: number;
  coldResist?: number;
  poisonResist?: number;
  strength?: number;
  dexterity?: number;
  life?: number;
  mana?: number;
  manaRegen?: number;
  extraGold?: number;
  replenishLife?: number;
}

export interface BootsCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export type BootsAffixKey = keyof Omit<BootsCheckInput, "mode">;

export type GloveQuality = "Magic" | "Rare" | "Crafted";
export type GloveSkillType = "None" | "Javelin and Spear" | "Bow and Crossbow" | "Martial Arts";

export interface GloveCheckInput {
  mode: GameMode;
  quality: GloveQuality;
  skillType: GloveSkillType;
  skillLevel: 0 | 1 | 2 | 3;
  increasedAttackSpeed: 0 | 10 | 20;
  crushingBlow?: number;
  lifeLeech?: number;
  life?: number;
  magicFind?: number;
  strength?: number;
  dexterity?: number;
  resistSupport?: number;
}

export interface GloveCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}

export type VarianceAffixKey = RingAffixKey | AmuletAffixKey | JewelAffixKey | BootsAffixKey;

export interface VarianceAffixDefinition {
  key: VarianceAffixKey;
  label: string;
  itemTypes: VarianceItemType[];
  valueType: AffixValueType;
  impactTier: AffixImpactTier;
  evaluatorWeight?: number;
}

export type UniqueRollField =
  | "magicFind"
  | "fasterCastRate"
  | "fasterRunWalk"
  | "fasterHitRecovery"
  | "damage"
  | "defense"
  | "dexterity"
  | "attackRating"
  | "allResist"
  | "minusEnemyFireResist"
  | "minusEnemyColdResist"
  | "minusEnemyLightningResist"
  | "minusEnemyPoisonResist"
  | "lightningSkillDamage"
  | "fireSkillDamage"
  | "elementalSkillDamage"
  | "enhancedDamage"
  | "enhancedDefense"
  | "strength"
  | "lifeLeech"
  | "damageReduction"
  | "fireResist"
  | "lightningResist"
  | "manaLeech"
  | "maxLifePercent"
  | "maxManaPercent"
  | "magicSkillDamage"
  | "magicDamageReduced"
  | "extraGold"
  | "manaAfterKill"
  | "lifeAfterKill"
  | "apocalypse"
  | "bindDemon"
  | "consume"
  | "bloodBoil"
  | "bloodOath"
  | "engorge"
  | "demonicMastery"
  | "minusEnemyMagicResist"
  | "flameWave"
  | "ringOfFire"
  | "summonTainted"
  | "sockets"
  | "poisonAndBoneSkills"
  | "energy"
  | "coldSkillDamage"
  | "coldAbsorb"
  | "allSkills"
  | "lightningAbsorb"
  | "vitality";

export type UniqueSelectField = "ormusSkillQuality" | "rainbowFacetElement";

export interface UniqueSelectOption {
  value: string;
  label: string;
}

export interface UniqueSelectDefinition {
  key: UniqueSelectField;
  label: string;
  options: UniqueSelectOption[];
}

export interface UniqueRollThresholdBand {
  low?: number;
  mid?: number;
  high?: number;
}

export interface UniqueRollDefinition {
  key: UniqueRollField;
  label: string;
  min: number;
  max: number;
  higherIsBetter: boolean;
  thresholds?: UniqueRollThresholdBand;
  note?: string;
}

export interface UniqueSourceReference {
  label: string;
  url: string;
}

export interface UniqueSourceMetadata {
  baselineSource: UniqueSourceReference;
  validationSource?: UniqueSourceReference;
  notes: string;
}

export interface UniqueItemDefinition {
  id: string;
  name: string;
  category: string;
  ruleset?: Ruleset;
  hasVariableRolls: boolean;
  keyRollFields: UniqueRollField[];
  etherealRelevant?: boolean;
  ethPriority?: EthPriority;
  scnlPriority: BasePriorityTier;
  sclPriority: BasePriorityTier;
  liquidity: Liquidity;
  notes: string;
  source?: string;
  usuallyIgnore?: boolean;
  rollDefinitions?: UniqueRollDefinition[];
  selectDefinitions?: UniqueSelectDefinition[];
  sources: UniqueSourceMetadata;
}

export interface UniqueCheckInput {
  mode: GameMode;
  ruleset?: Ruleset;
  itemId: string;
  ethereal?: boolean;
  magicFind?: number;
  fasterCastRate?: number;
  fasterRunWalk?: number;
  fasterHitRecovery?: number;
  damage?: number;
  defense?: number;
  dexterity?: number;
  attackRating?: number;
  allResist?: number;
  minusEnemyFireResist?: number;
  minusEnemyColdResist?: number;
  minusEnemyLightningResist?: number;
  minusEnemyPoisonResist?: number;
  lightningSkillDamage?: number;
  fireSkillDamage?: number;
  elementalSkillDamage?: number;
  enhancedDamage?: number;
  enhancedDefense?: number;
  strength?: number;
  lifeLeech?: number;
  damageReduction?: number;
  fireResist?: number;
  lightningResist?: number;
  manaLeech?: number;
  maxLifePercent?: number;
  maxManaPercent?: number;
  magicSkillDamage?: number;
  magicDamageReduced?: number;
  extraGold?: number;
  manaAfterKill?: number;
  lifeAfterKill?: number;
  apocalypse?: number;
  bindDemon?: number;
  consume?: number;
  bloodBoil?: number;
  bloodOath?: number;
  engorge?: number;
  demonicMastery?: number;
  minusEnemyMagicResist?: number;
  flameWave?: number;
  ringOfFire?: number;
  summonTainted?: number;
  sockets?: number;
  poisonAndBoneSkills?: number;
  energy?: number;
  coldSkillDamage?: number;
  coldAbsorb?: number;
  allSkills?: number;
  lightningAbsorb?: number;
  vitality?: number;
  ormusSkillQuality?: string;
  rainbowFacetElement?: string;
}

export interface UniqueCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
}

export interface CircletCheckInput {
  mode: GameMode;
  family: CircletFamily;
  quality: CircletQuality;
  skillMode: CircletSkillMode;
  classSkillType?: CircletClassSkill;
  classSkillValue?: 1 | 2;
  skillTreeType?: CircletSkillTree;
  skillTreeValue?: 1 | 2 | 3;
  fasterCastRate?: number;
  fasterRunWalk?: number;
  sockets?: number;
  strength?: number;
  dexterity?: number;
  life?: number;
  allResist?: number;
  fireResist?: number;
  lightningResist?: number;
}

export interface CircletCheckResult {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore: number;
  archetypeTags: RingArchetype[];
}
