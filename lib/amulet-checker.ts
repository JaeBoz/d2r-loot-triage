import { amuletModeAdjustments, amuletStatWeights, amuletSynergies } from "@/data/amulet-rules";
import { clampNumericAffixValue } from "@/data/affix-guardrails";
import { isValidMechanicsAffix } from "@/data/mechanics-affixes";
import {
  AmuletClassSkill,
  AmuletCheckInput,
  AmuletCheckResult,
  AmuletSkillTree,
  EvaluationPriority,
  Liquidity,
  RingArchetype,
  Verdict
} from "@/lib/types";

type StatKey = keyof Omit<AmuletCheckInput, "mode" | "levelRequirement" | "classSkillType" | "skillTreeType"> | "levelRequirement";
type NormalizedAmuletStats = Omit<AmuletCheckInput, "mode">;

const casterFriendlyClassSkills: AmuletClassSkill[] = [
  "Assassin Skills",
  "Druid Skills",
  "Necromancer Skills",
  "Paladin Skills",
  "Sorceress Skills"
];

const meleeFriendlyClassSkills: AmuletClassSkill[] = [
  "Amazon Skills",
  "Assassin Skills",
  "Barbarian Skills",
  "Druid Skills",
  "Paladin Skills"
];

const classSkillTradeBias: Record<AmuletClassSkill, number> = {
  "Amazon Skills": 0,
  "Assassin Skills": 0,
  "Barbarian Skills": -1,
  "Druid Skills": 0,
  "Necromancer Skills": 1,
  "Paladin Skills": 1,
  "Sorceress Skills": 1
};

const casterFriendlySkillTrees: AmuletSkillTree[] = [
  "Assassin Traps",
  "Barbarian Warcries",
  "Druid Elemental Skills",
  "Necromancer Poison and Bone Skills",
  "Sorceress Cold Spells",
  "Sorceress Lightning Spells"
];

const meleeFriendlySkillTrees: AmuletSkillTree[] = [
  "Amazon Passive and Magic Skills",
  "Amazon Javelin and Spear Skills",
  "Paladin Combat Skills",
  "Paladin Offensive Auras"
];

const skillTreeTradeBias: Record<AmuletSkillTree, number> = {
  "Amazon Passive and Magic Skills": 0,
  "Amazon Javelin and Spear Skills": 1,
  "Assassin Traps": 1,
  "Barbarian Warcries": 1,
  "Druid Elemental Skills": 1,
  "Druid Summoning Skills": 0,
  "Necromancer Poison and Bone Skills": 1,
  "Paladin Combat Skills": 0,
  "Paladin Offensive Auras": 1,
  "Sorceress Cold Spells": 1,
  "Sorceress Lightning Spells": 1
};

const numericKeys: StatKey[] = [
  "classSkills",
  "skillTreeSkills",
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
];

const labelByKey: Record<StatKey, string> = {
  classSkills: "class skills",
  skillTreeSkills: "skill tree skills",
  fasterCastRate: "FCR",
  strength: "strength",
  dexterity: "dexterity",
  life: "life",
  mana: "mana",
  allResist: "all resist",
  fireResist: "fire resist",
  lightningResist: "lightning resist",
  coldResist: "cold resist",
  poisonResist: "poison resist",
  magicFind: "magic find",
  attackRating: "attack rating",
  minDamage: "min damage",
  maxDamage: "max damage",
  levelRequirement: "level requirement",
  energy: "energy",
  replenishLife: "replenish life",
  extraGold: "extra gold"
};

const verdictFromScore = (score: number): Verdict => {
  if (score <= 1) return "Ignore";
  if (score <= 5) return "Low Priority";
  if (score <= 9) return "Check";
  if (score <= 14) return "Keep";
  if (score <= 19) return "List";
  return "Premium";
};

const priorityFromVerdict = (verdict: Verdict): EvaluationPriority => {
  if (verdict === "Ignore") return "Trash";
  if (verdict === "Low Priority") return "Low Trade Value";
  if (verdict === "Check" || verdict === "Keep") return "Moderate Trade Value";
  if (verdict === "List") return "High Trade Value";
  return "Premium Trade Value";
};

function normalizeStats(input: AmuletCheckInput): NormalizedAmuletStats {
  const stats: NormalizedAmuletStats = {};

  for (const key of numericKeys) {
    if (!isValidMechanicsAffix("amulet", key)) {
      continue;
    }

    const value = input[key];
    if (typeof value === "number" && !Number.isNaN(value) && value > 0) {
      stats[key] = clampNumericAffixValue(key, value);
    }
  }

  if (input.classSkillType) {
    stats.classSkillType = input.classSkillType;
  }

  if (input.skillTreeType) {
    stats.skillTreeType = input.skillTreeType;
  }

  return stats;
}

function statScoreFor(key: keyof NormalizedAmuletStats, value: number) {
  const rule = amuletStatWeights.find((entry) => entry.key === key);
  if (!rule) return 0;
  const match = rule.thresholds.find((threshold) => value >= threshold.min);
  return match?.score ?? 0;
}

function isCasterFriendlyClassSkill(classSkillType?: AmuletClassSkill) {
  return classSkillType ? casterFriendlyClassSkills.includes(classSkillType) : false;
}

function isMeleeFriendlyClassSkill(classSkillType?: AmuletClassSkill) {
  return classSkillType ? meleeFriendlyClassSkills.includes(classSkillType) : false;
}

function isCasterFriendlySkillTree(skillTreeType?: AmuletSkillTree) {
  return skillTreeType ? casterFriendlySkillTrees.includes(skillTreeType) : false;
}

function isMeleeFriendlySkillTree(skillTreeType?: AmuletSkillTree) {
  return skillTreeType ? meleeFriendlySkillTrees.includes(skillTreeType) : false;
}

function detectArchetypes(stats: NormalizedAmuletStats): RingArchetype[] {
  const tags = new Set<RingArchetype>();

  if (
    ((stats.classSkills ?? 0) >= 2 && isCasterFriendlyClassSkill(stats.classSkillType)) ||
    ((stats.skillTreeSkills ?? 0) >= 1 && isCasterFriendlySkillTree(stats.skillTreeType)) ||
    (stats.fasterCastRate ?? 0) >= 10
  ) {
    tags.add("caster");
  }

  if (
    (stats.attackRating ?? 0) >= 60 ||
    (stats.minDamage ?? 0) >= 3 ||
    (stats.maxDamage ?? 0) >= 5 ||
    ((stats.classSkills ?? 0) >= 2 && isMeleeFriendlyClassSkill(stats.classSkillType)) ||
    ((stats.skillTreeSkills ?? 0) >= 1 && isMeleeFriendlySkillTree(stats.skillTreeType))
  ) {
    tags.add("melee");
  }

  if ((stats.magicFind ?? 0) >= 12) {
    tags.add("MF");
  }

  if (
    (((stats.classSkills ?? 0) >= 2 && isCasterFriendlyClassSkill(stats.classSkillType)) ||
      ((stats.skillTreeSkills ?? 0) >= 1 && isCasterFriendlySkillTree(stats.skillTreeType))) &&
    (stats.fasterCastRate ?? 0) >= 10
  ) {
    tags.add("PvP");
  }

  if ((stats.life ?? 0) >= 20 || (stats.allResist ?? 0) >= 7 || (stats.lightningResist ?? 0) >= 20) {
    tags.add("PvM");
  }

  if (tags.size === 0) {
    tags.add("niche");
  }

  return Array.from(tags);
}

function classSkillContextAdjustment(stats: NormalizedAmuletStats, tags: Set<RingArchetype>, highlights: string[]) {
  if ((stats.classSkills ?? 0) < 1 || !stats.classSkillType) {
    return 0;
  }

  let score = classSkillTradeBias[stats.classSkillType];
  if ((stats.classSkills ?? 0) >= 2) {
    score += 1;
  }
  highlights.push(`+${stats.classSkills} ${stats.classSkillType.toLowerCase()}`);

  const hasCasterSupport = (stats.fasterCastRate ?? 0) >= 10 || (stats.allResist ?? 0) >= 10 || (stats.mana ?? 0) >= 40;
  const hasMeleeSupport =
    (stats.attackRating ?? 0) >= 60 ||
    (stats.strength ?? 0) >= 10 ||
    (stats.dexterity ?? 0) >= 10 ||
    (stats.minDamage ?? 0) >= 3 ||
    (stats.maxDamage ?? 0) >= 5;

  if (isCasterFriendlyClassSkill(stats.classSkillType) && hasCasterSupport) {
    score += 1;
  }

  if (isMeleeFriendlyClassSkill(stats.classSkillType) && hasMeleeSupport) {
    score += 1;
  }

  if (!isCasterFriendlyClassSkill(stats.classSkillType) && (stats.fasterCastRate ?? 0) >= 10) {
    score -= 1;
    highlights.push("class skill does not fit the caster-style stats");
  }

  if (stats.classSkillType === "Barbarian Skills" && !hasMeleeSupport && (stats.life ?? 0) < 20) {
    score -= 1;
  }

  if (stats.classSkillType === "Sorceress Skills" || stats.classSkillType === "Paladin Skills" || stats.classSkillType === "Necromancer Skills") {
    tags.add("caster");
  }

  return score;
}

function skillTreeContextAdjustment(stats: NormalizedAmuletStats, tags: Set<RingArchetype>, highlights: string[]) {
  if ((stats.skillTreeSkills ?? 0) < 1 || !stats.skillTreeType) {
    return 0;
  }

  let score = skillTreeTradeBias[stats.skillTreeType];
  if ((stats.skillTreeSkills ?? 0) >= 2) {
    score += 1;
  }
  highlights.push(`+${stats.skillTreeSkills} ${stats.skillTreeType.toLowerCase()}`);

  const hasCasterSupport = (stats.fasterCastRate ?? 0) >= 10 || (stats.allResist ?? 0) >= 10 || (stats.mana ?? 0) >= 40;
  const hasMeleeSupport =
    (stats.attackRating ?? 0) >= 60 ||
    (stats.strength ?? 0) >= 10 ||
    (stats.dexterity ?? 0) >= 10 ||
    (stats.minDamage ?? 0) >= 3 ||
    (stats.maxDamage ?? 0) >= 5;

  if (isCasterFriendlySkillTree(stats.skillTreeType) && hasCasterSupport) {
    score += 1;
    tags.add("caster");
  }

  if (isMeleeFriendlySkillTree(stats.skillTreeType) && hasMeleeSupport) {
    score += 1;
    tags.add("melee");
  }

  if (!isCasterFriendlySkillTree(stats.skillTreeType) && (stats.fasterCastRate ?? 0) >= 10) {
    score -= 1;
    highlights.push("skill tree does not fit the caster-style stats");
  }

  return score;
}

function synergyScore(stats: NormalizedAmuletStats, tags: Set<RingArchetype>, highlights: string[]) {
  let score = 0;

  for (const synergy of amuletSynergies) {
    const blocksGenericSkillTreatment =
      synergy.id.startsWith("skills-") &&
      (stats.classSkills ?? 0) === 0 &&
      (stats.skillTreeSkills ?? 0) === 0;

    const blocksClassSkillTreatment =
      synergy.id.startsWith("skills-") &&
      (stats.classSkills ?? 0) >= 1 &&
      !isCasterFriendlyClassSkill(stats.classSkillType);

    const blocksTreeSkillTreatment =
      synergy.id.startsWith("skills-") &&
      (stats.skillTreeSkills ?? 0) >= 1 &&
      !isCasterFriendlySkillTree(stats.skillTreeType);

    if (blocksGenericSkillTreatment || blocksClassSkillTreatment || blocksTreeSkillTreatment) {
      continue;
    }

    if (synergy.check(stats as Record<string, number | undefined>)) {
      score += synergy.score;
      synergy.archetypes.forEach((tag) => tags.add(tag));
      highlights.push(synergy.label);
    }
  }

  return score;
}

function awkwardComboPenalty(stats: NormalizedAmuletStats, tags: RingArchetype[], highlights: string[]) {
  let penalty = 0;
  const numericStatCount = numericKeys.filter((key) => typeof stats[key] === "number" && (stats[key] as number) > 0).length;

  const hasCasterAnchor =
    ((stats.classSkills ?? 0) >= 1 && isCasterFriendlyClassSkill(stats.classSkillType)) ||
    ((stats.skillTreeSkills ?? 0) >= 1 && isCasterFriendlySkillTree(stats.skillTreeType)) ||
    (stats.fasterCastRate ?? 0) >= 10;
  const hasMeleeAnchor = (stats.attackRating ?? 0) >= 60 || (stats.minDamage ?? 0) >= 3 || (stats.maxDamage ?? 0) >= 5;
  const scattered =
    numericStatCount >= 4 &&
    !hasCasterAnchor &&
    !hasMeleeAnchor &&
    (stats.allResist ?? 0) < 7 &&
    (stats.magicFind ?? 0) < 12;

  if (scattered) {
    penalty += 2;
    highlights.push("scattered stats with no clear build anchor");
  }

  if (
    tags.includes("caster") &&
    tags.includes("melee") &&
    !((stats.classSkills ?? 0) >= 1 || (stats.skillTreeSkills ?? 0) >= 1)
  ) {
    penalty += 1;
  }

  if ((stats.levelRequirement ?? 0) >= 67) {
    penalty += 1;
    highlights.push("high level requirement");
  }

  if ((stats.levelRequirement ?? 0) >= 89) {
    penalty += 2;
  }

  return penalty;
}

function labelForStat(key: StatKey, input: AmuletCheckInput) {
  if (key === "classSkills" && input.classSkillType) {
    return input.classSkillType.toLowerCase();
  }

  if (key === "skillTreeSkills" && input.skillTreeType) {
    return input.skillTreeType.toLowerCase();
  }

  return labelByKey[key];
}

function topStats(stats: NormalizedAmuletStats) {
  return Object.entries(stats)
    .filter(([key]) => key !== "levelRequirement" && key !== "classSkillType" && key !== "skillTreeType")
    .map(([key, value]) => ({
      key: key as StatKey,
      value: value as number,
      score: statScoreFor(key as keyof NormalizedAmuletStats, value as number)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.value - left.value)
    .slice(0, 4);
}

function displayHighlight(highlight: string) {
  const labelMap: Record<string, string> = {
    "+skills with FCR": "+skills + FCR",
    "+skills with all resist": "+skills + all res",
    "+skills with life": "+skills + life",
    "FCR with resist support": "FCR + res",
    "stats with life and resist": "stats/life/res",
    "magic find with resist support": "MF + res",
    "AR with stats and damage": "AR/stats/damage"
  };

  return labelMap[highlight] ?? highlight;
}

function comboTextFor(highlights: string[]) {
  const displayHighlights = Array.from(new Set(highlights.map(displayHighlight)));
  return displayHighlights.length > 0 ? displayHighlights.slice(0, 2).join(" and ") : "the overall stat mix";
}

function hasWeakRareStyleCasterShell(stats: NormalizedAmuletStats) {
  const hasTwoCasterSkills =
    ((stats.classSkills ?? 0) >= 2 && isCasterFriendlyClassSkill(stats.classSkillType)) ||
    ((stats.skillTreeSkills ?? 0) >= 2 && isCasterFriendlySkillTree(stats.skillTreeType));
  const hasOnlyRareStyleFcr = (stats.fasterCastRate ?? 0) >= 10 && (stats.fasterCastRate ?? 0) < 15;
  const hasMeaningfulSupport =
    (stats.allResist ?? 0) >= 10 ||
    (stats.life ?? 0) >= 25 ||
    (stats.mana ?? 0) >= 40 ||
    (stats.strength ?? 0) >= 10 ||
    (stats.dexterity ?? 0) >= 10 ||
    (stats.lightningResist ?? 0) >= 25 ||
    (stats.magicFind ?? 0) >= 20;

  return hasTwoCasterSkills && hasOnlyRareStyleFcr && !hasMeaningfulSupport;
}

function summaryTextFor(
  topRated: Array<{ key: StatKey; value: number }>,
  input: AmuletCheckInput,
  hasCasterSkillMismatch: boolean
) {
  const summaryBits = topRated
    .slice(0, 3)
    .filter((entry) => !(hasCasterSkillMismatch && entry.key === "classSkills"))
    .map((entry) => `+${entry.value} ${labelForStat(entry.key, input)}`);

  return summaryBits.length > 0 ? summaryBits.join(", ") : "very little usable value";
}

function liquidityFrom(score: number, mode: AmuletCheckInput["mode"], tags: RingArchetype[], input: AmuletCheckInput): Liquidity {
  let liquidityScore = score + amuletModeAdjustments[mode].liquidityBias;

  if (tags.includes("caster")) liquidityScore += 2;
  if (tags.includes("MF")) liquidityScore -= 1;
  if (tags.includes("niche") && !tags.includes("caster") && !tags.includes("melee")) liquidityScore -= 1;
  if (input.classSkillType) liquidityScore += classSkillTradeBias[input.classSkillType];
  if (input.skillTreeType) liquidityScore += skillTreeTradeBias[input.skillTreeType];

  if (liquidityScore <= 6) return "Low";
  if (liquidityScore <= 13) return "Medium";
  return "High";
}

function explanationFor(
  input: AmuletCheckInput,
  verdict: Verdict,
  tags: RingArchetype[],
  highlights: string[],
  topRated: Array<{ key: StatKey; value: number }>
) {
  const leadTag = tags[0] ?? "niche";
  const hasCasterSkillMismatch = highlights.includes("class skill does not fit the caster-style stats");
  const summaryText = summaryTextFor(topRated, input, hasCasterSkillMismatch);
  const comboText = comboTextFor(highlights);
  const craftedFcrNote =
    topRated.some((entry) => entry.key === "fasterCastRate" && entry.value >= 15)
      ? "High FCR usually means caster craft territory. "
      : "";
  const mismatchNote = hasCasterSkillMismatch
    ? "Good FCR shell, but the class skill does not line up cleanly. "
    : "";

  if (verdict === "Ignore") {
    return `Charsi-level amulet. ${summaryText} is not enough for ${input.mode}.`;
  }

  if (verdict === "Low Priority") {
    return `Some useful stats, but not enough together. ${craftedFcrNote}${mismatchNote}This ${leadTag} amulet is mostly self-use or niche.`;
  }

  if (verdict === "Check") {
    return `Decent partial hit. ${craftedFcrNote}${mismatchNote}${summaryText} gives it ${leadTag} appeal. Check because of ${comboText}.`;
  }

  if (verdict === "Keep") {
    if (hasCasterSkillMismatch) {
      return `High FCR, but mismatch. ${craftedFcrNote}${mismatchNote}You're mainly paying for ${summaryText}.`;
    }

    return `Solid ${leadTag} amulet. ${craftedFcrNote}You're mainly paying for ${summaryText}. ${comboText} is the reason.`;
  }

  if (verdict === "List") {
    if (hasCasterSkillMismatch) {
      return `High FCR, but mismatch. ${craftedFcrNote}${mismatchNote}${summaryText} is the value here.`;
    }

    return `Good ${leadTag} amulet. ${craftedFcrNote}${summaryText}. ${comboText} is the value here.`;
  }

  if (hasCasterSkillMismatch) {
    return `High FCR, but mismatch. ${craftedFcrNote}${mismatchNote}${summaryText} is the value here.`;
  }

  return `Premium ${leadTag} amulet. ${craftedFcrNote}${summaryText}. ${comboText} is the hit.`;
}

function recommendedActionFor(verdict: Verdict, mode: AmuletCheckInput["mode"]) {
  if (verdict === "Ignore") return "Charsi unless you need a temporary self-use amulet.";
  if (verdict === "Low Priority") return "Only keep it as a progression filler.";
  if (verdict === "Check") return "Give it a second pass before tossing it.";
  if (verdict === "Keep") return `Keep it and compare it against your other ${mode} amulets.`;
  if (verdict === "List") return "List it or compare it against similar rare amulets.";
  return "Premium rare amulet. Compare before listing.";
}

export function evaluateAmulet(input: AmuletCheckInput): AmuletCheckResult {
  const stats = normalizeStats(input);
  const presentStats = Object.keys(stats).filter((key) => key !== "levelRequirement").length;

  if (presentStats === 0) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No amulet stats entered yet.",
      recommendedAction: "Enter the visible mods to triage the amulet.",
      qualityScore: 0,
      archetypeTags: ["niche"]
    };
  }

  let score = amuletModeAdjustments[input.mode].floorBonus;
  const tagSet = new Set<RingArchetype>(detectArchetypes(stats));
  const highlights: string[] = [];

  for (const [key, value] of Object.entries(stats)) {
    if (key === "levelRequirement" || key === "classSkillType" || key === "skillTreeType") continue;
    score += statScoreFor(key as keyof NormalizedAmuletStats, value as number);
  }

  score += synergyScore(stats, tagSet, highlights);
  score += classSkillContextAdjustment(stats, tagSet, highlights);
  score += skillTreeContextAdjustment(stats, tagSet, highlights);
  const archetypeTags = Array.from(tagSet);
  score -= awkwardComboPenalty(stats, archetypeTags, highlights);

  if (hasWeakRareStyleCasterShell(stats)) {
    score -= 7;
    highlights.push("+2 / 10 FCR needs support");
  }

  if (input.mode === "SCNL" && score <= 11) {
    score -= 1;
  }

  if (
    input.mode === "SCL" &&
    (((stats.classSkills ?? 0) >= 1 && isCasterFriendlyClassSkill(stats.classSkillType)) ||
      ((stats.skillTreeSkills ?? 0) >= 1 && isCasterFriendlySkillTree(stats.skillTreeType)) ||
      (stats.fasterCastRate ?? 0) >= 10)
  ) {
    score += 1;
  }

  const verdict = verdictFromScore(score);
  const explanation = explanationFor(input, verdict, archetypeTags, highlights, topStats(stats));

  return {
    verdict,
    priority: priorityFromVerdict(verdict),
    liquidity: liquidityFrom(score, input.mode, archetypeTags, input),
    explanation,
    recommendedAction: recommendedActionFor(verdict, input.mode),
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}
