import { charmModeAdjustments, charmPatterns } from "@/data/charm-rules";
import { charmSizeRanges, sanitizeCharmSizeInput } from "@/data/charm-size-ranges";
import { sanitizeMechanicsInput } from "@/data/mechanics-affixes";
import { CharmCheckInput, CharmCheckResult, CharmPatternInput, Liquidity, RingArchetype, Verdict } from "@/lib/types";

const verdictRank: Record<Verdict, number> = {
  Ignore: 0,
  "Low Priority": 1,
  Check: 2,
  "Check sockets": 2,
  Keep: 3,
  List: 4,
  Premium: 5
};

const floorVerdictMap = {
  Check: "Check",
  Keep: "Keep",
  List: "List",
  Premium: "Premium"
} as const;

const skillerOptions = [
  "",
  "Amazon Bow",
  "Amazon Passive",
  "Amazon Javelin",
  "Assassin Martial Arts",
  "Assassin Shadow",
  "Assassin Traps",
  "Barbarian Combat",
  "Barbarian Masteries",
  "Barbarian Warcries",
  "Druid Elemental",
  "Druid Shape Shifting",
  "Druid Summoning",
  "Necromancer Curses",
  "Necromancer Poison and Bone",
  "Necromancer Summoning",
  "Paladin Combat",
  "Paladin Defensive Auras",
  "Paladin Offensive Auras",
  "Sorceress Cold",
  "Sorceress Fire",
  "Sorceress Lightning"
];

const verdictFromScore = (score: number): Verdict => {
  if (score <= 1) return "Ignore";
  if (score <= 4) return "Low Priority";
  if (score <= 7) return "Check";
  if (score <= 11) return "Keep";
  if (score <= 15) return "List";
  return "Premium";
};

function liquidityFrom(score: number, mode: CharmCheckInput["mode"], tags: RingArchetype[]): Liquidity {
  let liquidityScore = score + charmModeAdjustments[mode].liquidityBias;
  if (tags.includes("caster")) liquidityScore += 2;
  if (tags.includes("MF")) liquidityScore += 1;
  if (tags.includes("niche")) liquidityScore -= 1;
  if (liquidityScore <= 4) return "Low";
  if (liquidityScore <= 10) return "Medium";
  return "High";
}

function priorityFromCharm(
  verdict: Verdict,
  input: CharmCheckInput,
  matchedPatternIds: string[],
  score: number
): "Trash" | "Low Trade Value" | "Moderate Trade Value" | "High Trade Value" | "Premium Trade Value" {
  if (verdict === "Premium") {
    return "Premium Trade Value";
  }

  if (verdict === "List") {
    return "High Trade Value";
  }

  if (
    matchedPatternIds.includes("gc-skiller") ||
    matchedPatternIds.includes("gc-skiller-life") ||
    matchedPatternIds.includes("gc-skiller-fhr") ||
    matchedPatternIds.includes("sc-poison-top") ||
    matchedPatternIds.includes("sc-life-res") ||
    (matchedPatternIds.includes("sc-mf") && (input.magicFind ?? 0) >= 7)
  ) {
    return "High Trade Value";
  }

  if (verdict === "Keep" || verdict === "Check" || score >= 6) {
    return "Moderate Trade Value";
  }

  if (verdict === "Low Priority") {
    return "Low Trade Value";
  }

  return "Trash";
}

function charmLiquidityFrom(
  input: CharmCheckInput,
  score: number,
  mode: CharmCheckInput["mode"],
  tags: RingArchetype[],
  matchedPatternIds: string[]
): Liquidity {
  if (matchedPatternIds.includes("gc-skiller-life") || matchedPatternIds.includes("gc-skiller-fhr")) {
    return "High";
  }

  if (matchedPatternIds.includes("gc-skiller")) {
    return "High";
  }

  if (matchedPatternIds.includes("sc-poison-top")) {
    return "High";
  }

  if (matchedPatternIds.includes("sc-mf") && (input.magicFind ?? 0) >= 7) {
    return "High";
  }

  if (matchedPatternIds.includes("sc-life-res")) {
    return mode === "SCNL" ? "Medium" : "High";
  }

  return liquidityFrom(score, mode, tags);
}

function isPlainSkiller(matchedPatternIds: string[]) {
  return (
    matchedPatternIds.includes("gc-skiller") &&
    !matchedPatternIds.includes("gc-skiller-life") &&
    !matchedPatternIds.includes("gc-skiller-life-strong") &&
    !matchedPatternIds.includes("gc-skiller-fhr")
  );
}

function isTopPoisonSmallCharm(input: CharmCheckInput, matchedPatternIds: string[]) {
  return input.size === "Small Charm" && matchedPatternIds.includes("sc-poison-top");
}

function baseTags(input: CharmCheckInput): Set<RingArchetype> {
  const tags = new Set<RingArchetype>();
  if (input.skill?.trim()) {
    const skill = input.skill.toLowerCase();
    if (
      skill.includes("sorceress") ||
      skill.includes("traps") ||
      skill.includes("elemental") ||
      skill.includes("poison and bone") ||
      skill.includes("curses")
    ) {
      tags.add("caster");
    } else if (
      skill.includes("javelin") ||
      skill.includes("bow") ||
      skill.includes("passive") ||
      skill.includes("barbarian") ||
      skill.includes("martial arts") ||
      skill.includes("shape shifting") ||
      skill.includes("paladin combat") ||
      skill.includes("offensive auras")
    ) {
      tags.add("PvM");
    } else {
      tags.add("PvM");
    }
  }
  if ((input.magicFind ?? 0) > 0) {
    tags.add("MF");
  }
  if ((input.poisonDamage ?? 0) >= 100) {
    tags.add("niche");
  }
  if ((input.maxDamage ?? 0) > 0 || (input.attackRating ?? 0) > 0) {
    tags.add("melee");
  }
  if (
    (input.life ?? 0) > 0 ||
    (input.allResist ?? 0) > 0 ||
    (input.fireResist ?? 0) > 0 ||
    (input.lightningResist ?? 0) > 0 ||
    (input.coldResist ?? 0) > 0 ||
    (input.poisonResist ?? 0) > 0
  ) {
    tags.add("PvM");
  }
  if ((input.fasterHitRecovery ?? 0) > 0) {
    tags.add("PvP");
  }
  if ((input.fasterRunWalk ?? 0) > 0) {
    tags.add("PvP");
    tags.add("PvM");
  }
  if (tags.size === 0) {
    tags.add("niche");
  }
  return tags;
}

function isCasterCharmSkill(skill: string | undefined) {
  const normalized = skill?.toLowerCase() ?? "";
  return (
    normalized.includes("sorceress") ||
    normalized.includes("traps") ||
    normalized.includes("elemental") ||
    normalized.includes("poison and bone") ||
    normalized.includes("curses")
  );
}

function hasNonCasterCharmSkill(skill: string | undefined) {
  return Boolean(skill?.trim()) && !isCasterCharmSkill(skill);
}

function normalizeSkillTags(input: CharmCheckInput, tags: Set<RingArchetype>) {
  if (!hasNonCasterCharmSkill(input.skill)) {
    return;
  }

  tags.delete("caster");
  tags.add("PvM");
}

function cappedStatCount(input: CharmCheckInput) {
  const ranges = charmSizeRanges[input.size];
  return (Object.keys(ranges) as Array<keyof typeof ranges>).filter((key) => {
    const rule = ranges[key];
    const value = input[key];
    return typeof value === "number" && typeof rule?.max === "number" && value >= rule.max;
  }).length;
}

function hasSaturatedStatStack(input: CharmCheckInput) {
  return cappedStatCount(input) >= 4;
}

function capSaturatedCharmPriority(priority: CharmCheckResult["priority"], saturatedStatStack: boolean) {
  if (!saturatedStatStack) {
    return priority;
  }

  if (priority === "Premium Trade Value" || priority === "High Trade Value") {
    return "Moderate Trade Value";
  }

  return priority;
}

function awkwardPenalty(input: CharmCheckInput, matchedPatterns: string[]) {
  let penalty = 0;
  const rawStats = [
    input.life,
    input.mana,
    input.magicFind,
    input.allResist,
    input.fireResist,
    input.lightningResist,
    input.coldResist,
    input.poisonResist,
    input.fasterRunWalk,
    input.fasterHitRecovery,
    input.poisonDamage,
    input.maxDamage,
    input.attackRating
  ].filter((value) => typeof value === "number" && value > 0).length;

  if (rawStats >= 3 && matchedPatterns.length === 0) {
    penalty += 2;
  }

  if (input.size === "Large Charm" && matchedPatterns.length === 0) {
    penalty += 1;
  }

  return penalty;
}

function topSummary(input: CharmCheckInput) {
  const parts: string[] = [];
  if (input.skill?.trim()) parts.push(input.skill.trim());
  if (input.life) parts.push(`+${input.life} life`);
  if (input.magicFind) parts.push(`+${input.magicFind}% magic find`);
  if (input.allResist) parts.push(`+${input.allResist} all resist`);
  if (!input.allResist && input.fireResist) parts.push(`+${input.fireResist} fire resist`);
  if (input.lightningResist) parts.push(`+${input.lightningResist} lightning resist`);
  if (input.fasterRunWalk) parts.push(`+${input.fasterRunWalk}% FRW`);
  if (input.fasterHitRecovery) parts.push(`+${input.fasterHitRecovery}% FHR`);
  if (input.poisonDamage) parts.push(`${input.poisonDamage} poison damage`);
  if (input.maxDamage && input.attackRating) parts.push(`+${input.maxDamage} max damage / +${input.attackRating} AR`);
  return parts.slice(0, 3).join(", ");
}

function toCharmPatternInput(input: CharmCheckInput): CharmPatternInput {
  const stats = sanitizeMechanicsInput("charm", sanitizeCharmSizeInput(input));

  return {
    size: input.size,
    life: stats.life,
    mana: stats.mana,
    magicFind: stats.magicFind,
    allResist: stats.allResist,
    fireResist: stats.fireResist,
    lightningResist: stats.lightningResist,
    coldResist: stats.coldResist,
    poisonResist: stats.poisonResist,
    fasterRunWalk: stats.fasterRunWalk,
    fasterHitRecovery: stats.fasterHitRecovery,
    poisonDamage: stats.poisonDamage,
    skill: input.skill,
    maxDamage: stats.maxDamage,
    attackRating: stats.attackRating
  };
}

export function evaluateCharm(rawInput: CharmCheckInput): CharmCheckResult {
  const checkedInput = sanitizeCharmSizeInput(rawInput);
  const hasInput =
    !!checkedInput.skill?.trim() ||
    [
      checkedInput.life,
      checkedInput.mana,
      checkedInput.magicFind,
      checkedInput.allResist,
      checkedInput.fireResist,
      checkedInput.lightningResist,
      checkedInput.coldResist,
      checkedInput.poisonResist,
      checkedInput.fasterRunWalk,
      checkedInput.fasterHitRecovery,
      checkedInput.poisonDamage,
      checkedInput.maxDamage,
      checkedInput.attackRating
    ].some((value) => typeof value === "number" && value > 0);

  if (!hasInput) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No charm stats entered yet.",
      recommendedAction: "Enter the visible charm mods to triage it.",
      qualityScore: 0,
      archetypeTags: ["niche"]
    };
  }

  const input = checkedInput;
  let score = charmModeAdjustments[input.mode].scoreBias;
  let floorVerdict: Verdict = "Ignore";
  const matchedPatterns: string[] = [];
  const matchedPatternIds: string[] = [];
  const tags = baseTags(input);
  const patternInput = toCharmPatternInput(input);

  for (const pattern of charmPatterns) {
    if (pattern.size !== "Any" && pattern.size !== input.size) continue;
    if (!pattern.check(patternInput)) continue;
    score += pattern.score;
    matchedPatterns.push(pattern.label);
    matchedPatternIds.push(pattern.id);
    pattern.archetypes.forEach((tag) => tags.add(tag));
    if (pattern.verdictFloor) {
      const candidate = floorVerdictMap[pattern.verdictFloor];
      if (verdictRank[candidate] > verdictRank[floorVerdict]) {
        floorVerdict = candidate;
      }
    }
  }
  normalizeSkillTags(input, tags);

  if (input.size === "Grand Charm" && input.skill?.trim()) {
    score += 2;
  }

  if (input.size === "Small Charm" && (input.magicFind ?? 0) >= 7) {
    score += 3;
  }

  if (
    input.size === "Small Charm" &&
    matchedPatternIds.includes("sc-life-res") &&
    ((input.allResist ?? 0) >= 5 ||
      (input.fireResist ?? 0) >= 9 ||
      (input.lightningResist ?? 0) >= 9 ||
      (input.coldResist ?? 0) >= 9 ||
      (input.poisonResist ?? 0) >= 9)
  ) {
    score += 2;
  }

  if (input.size === "Small Charm" && (input.maxDamage ?? 0) > 0 && (input.attackRating ?? 0) > 0) {
    score += 1;
  }

  if (input.mode === "SCNL" && input.size === "Large Charm" && matchedPatterns.length <= 1) {
    score -= 1;
  }

  if (input.mode === "SCL" && input.size === "Small Charm" && matchedPatterns.length > 0) {
    score += 1;
  }

  score -= awkwardPenalty(input, matchedPatterns);
  const saturatedStatStack = hasSaturatedStatStack(input);
  if (saturatedStatStack) {
    score = Math.min(score, 15);
  }

  let verdict = verdictFromScore(score);
  if (verdictRank[floorVerdict] > verdictRank[verdict]) {
    verdict = floorVerdict;
  }
  if (saturatedStatStack && verdictRank[verdict] > verdictRank.List) {
    verdict = "List";
  }

  const archetypeTags = Array.from(tags);
  const summary = topSummary(input) || "some usable stats";
  const patternText =
    matchedPatterns.length > 0 ? matchedPatterns.slice(0, 2).join(" and ") : "do not form a strong charm pattern";

  let explanation = "";
  if (matchedPatterns.length > 0) {
    if (isTopPoisonSmallCharm(input, matchedPatternIds)) {
      explanation = `${summary} is a top poison SC roll, not filler.`;
    } else if (matchedPatternIds.includes("sc-poison")) {
      explanation = `${summary} is a moderate poison small charm. Niche, not a jackpot.`;
    } else if (input.size === "Grand Charm" && isPlainSkiller(matchedPatternIds)) {
      explanation = `${summary} is a plain skiller; the tree decides how good it is.`;
    } else if (input.size === "Grand Charm" && input.skill?.trim()) {
      explanation = `${summary} is a skiller hit; the second mod pushes it higher.`;
    } else if (matchedPatternIds.includes("sc-mf") && input.size === "Small Charm" && (input.magicFind ?? 0) >= 7) {
      explanation = "7 MF is the max small charm roll.";
    } else if (input.size === "Small Charm") {
      explanation = `Good small charm: ${patternText} is the pattern.`;
    } else {
      explanation = `Decent ${input.size.toLowerCase()}: ${patternText} is the value signal.`;
    }
  } else {
    explanation = `${summary} is present, but it is not a real ${input.mode} charm pattern.`;
  }

  let recommendedAction = "";
  if (verdict === "Ignore") {
    recommendedAction = "Drop it unless you need a temporary charm.";
  } else if (verdict === "Low Priority") {
    recommendedAction = "Only keep it as a stopgap charm.";
  } else if (verdict === "Check") {
    recommendedAction = "Conditional keep. The pattern is usable.";
  } else if (isTopPoisonSmallCharm(input, matchedPatternIds)) {
    recommendedAction = "Keep it. Premium poison small charm.";
  } else if (isPlainSkiller(matchedPatternIds)) {
    recommendedAction = "Keep it if the skill tree is useful.";
  } else if (verdict === "Keep") {
    recommendedAction = "Keep it. This matches a real charm pattern.";
  } else if (verdict === "List") {
    recommendedAction = "Keep it. Good charm hit.";
  } else {
    recommendedAction = "Keep it. Premium charm hit.";
  }

  return {
    verdict,
    priority: capSaturatedCharmPriority(priorityFromCharm(verdict, input, matchedPatternIds, score), saturatedStatStack),
    liquidity: charmLiquidityFrom(input, score, input.mode, archetypeTags, matchedPatternIds),
    explanation,
    recommendedAction,
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}

export const charmSkillOptions = skillerOptions;
