import { glovePatternRules, gloveQualityBias, gloveSkillDemand } from "@/data/glove-rules";
import { EvaluationPriority, GloveCheckInput, GloveCheckResult, Liquidity, RingArchetype, Verdict } from "@/lib/types";

const verdictFromScore = (score: number): Verdict => {
  if (score <= 1) return "Ignore";
  if (score <= 4) return "Low Priority";
  if (score <= 7) return "Check";
  if (score <= 11) return "Keep";
  if (score <= 15) return "List";
  return "Premium";
};

const priorityFromVerdict = (verdict: Verdict): EvaluationPriority => {
  if (verdict === "Ignore") return "Trash";
  if (verdict === "Low Priority") return "Low Trade Value";
  if (verdict === "Check" || verdict === "Keep") return "Moderate Trade Value";
  if (verdict === "List") return "High Trade Value";
  return "Premium Trade Value";
};

function supportScore(input: GloveCheckInput) {
  let score = 0;

  if ((input.resistSupport ?? 0) >= 30) score += 2;
  else if ((input.resistSupport ?? 0) >= 20) score += 1;

  if ((input.magicFind ?? 0) >= 20) score += 2;
  else if ((input.magicFind ?? 0) >= 10) score += 1;

  if ((input.strength ?? 0) >= 10) score += 2;
  else if ((input.strength ?? 0) >= 5) score += 1;

  if ((input.dexterity ?? 0) >= 10) score += 2;
  else if ((input.dexterity ?? 0) >= 5) score += 1;

  if ((input.life ?? 0) >= 15) score += 1;

  return score;
}

function weakStatPenalty(input: GloveCheckInput, matchedPatterns: string[]) {
  let penalty = 0;

  if (input.increasedAttackSpeed === 0) {
    penalty += input.skillType === "Javelin and Spear" && input.skillLevel >= 3 ? 2 : 4;
  }

  if (input.increasedAttackSpeed > 0 && input.increasedAttackSpeed < 20) {
    penalty += 2;
  }

  if ((input.crushingBlow ?? 0) > 0 && input.increasedAttackSpeed === 0 && matchedPatterns.length === 0) {
    penalty += 2;
  }

  if ((input.lifeLeech ?? 0) > 0 && input.increasedAttackSpeed === 0 && matchedPatterns.length === 0) {
    penalty += 1;
  }

  if (
    input.quality === "Magic" &&
    input.skillType !== "None" &&
    input.skillType !== "Javelin and Spear" &&
    input.increasedAttackSpeed === 20 &&
    !matchedPatterns.includes("IAS + strong support") &&
    supportScore(input) <= 1
  ) {
    penalty += 2;
  }

  return penalty;
}

function liquidityFor(input: GloveCheckInput, verdict: Verdict, matchedPatterns: string[]): Liquidity {
  if (verdict === "Ignore" || verdict === "Low Priority") return "Low";
  if (matchedPatterns.includes("+3 Jav / 20 IAS") || matchedPatterns.includes("+2 Jav / 20 IAS")) return "High";
  if (matchedPatterns.includes("IAS + Crushing Blow") || matchedPatterns.includes("skills + IAS")) return "Medium";
  if (input.mode === "SCL" && verdict === "Keep") return "Medium";
  return verdict === "Premium" || verdict === "List" ? "Medium" : "Low";
}

function explanationFor(input: GloveCheckInput, verdict: Verdict, matchedPatterns: string[]) {
  if (matchedPatterns.includes("+3 Jav / 20 IAS")) {
    return "+3 Jav / 20 IAS is the chase glove hit.";
  }

  if (matchedPatterns.includes("+2 Jav / 20 IAS")) {
    return "+2 Jav / 20 IAS is strong, but below the +3 magic chase.";
  }

  if (input.quality === "Magic" && input.skillType === "Bow and Crossbow" && input.increasedAttackSpeed === 20) {
    return "Bow + IAS can be useful, but it needs support.";
  }

  if (input.quality === "Magic" && input.skillType === "Martial Arts" && input.increasedAttackSpeed === 20) {
    return "Martial Arts + IAS is niche without strong support.";
  }

  if (matchedPatterns.includes("IAS + Crushing Blow")) {
    return "Blood-style hit: CB helps, but IAS and support make it real.";
  }

  if (matchedPatterns.includes("skills + IAS")) {
    return "Skills + IAS is the reason to care.";
  }

  if (input.increasedAttackSpeed === 20 && matchedPatterns.includes("IAS + strong support")) {
    return "IAS is the anchor; good support makes these worth checking.";
  }

  if (input.increasedAttackSpeed === 20) {
    return "IAS only is useful, but not enough by itself.";
  }

  if (input.skillType !== "None" && input.skillLevel > 0) {
    return "Skill roll is present, but no IAS. Usually a weak glove hit.";
  }

  if ((input.crushingBlow ?? 0) > 0 || (input.lifeLeech ?? 0) > 0) {
    return "Crushing Blow or leech alone does not carry gloves. It needs IAS and support.";
  }

  if (verdict === "Ignore") {
    return "No IAS and no strong glove pattern. Charsi-level gloves.";
  }

  return "Some support is present, but the glove pattern is not clean.";
}

function recommendedActionFor(verdict: Verdict, input: GloveCheckInput, matchedPatterns: string[]) {
  if (verdict === "Ignore") return "Charsi unless you need them for temporary self-use.";
  if (verdict === "Low Priority") return "Only keep for self-use or a very specific build.";
  if (matchedPatterns.includes("+3 Jav / 20 IAS")) return "Keep and compare. Big magic glove hit.";
  if (matchedPatterns.includes("+2 Jav / 20 IAS")) return "Check before tossing. Jav + IAS has real demand.";
  if (matchedPatterns.includes("IAS + Crushing Blow")) return "Check the full support package before tossing.";
  if (input.increasedAttackSpeed === 20) return "Check if the support lines are useful together.";
  if (verdict === "Premium") return "Premium glove pattern. Compare before listing.";
  return "Keep only if the pattern fits a build you care about.";
}

export function evaluateGloves(input: GloveCheckInput): GloveCheckResult {
  const tags = new Set<RingArchetype>();
  const matchedPatterns: string[] = [];
  let score = gloveQualityBias[input.quality];

  if (input.skillType !== "None" && input.skillLevel > 0) {
    score += Math.max(0, input.skillLevel - 1) + gloveSkillDemand[input.skillType];
    tags.add(input.skillType === "Javelin and Spear" ? "PvM" : "niche");
  }

  if (input.increasedAttackSpeed === 20) score += 3;
  else if (input.increasedAttackSpeed === 10) score += 1;

  if ((input.crushingBlow ?? 0) >= 8) score += 2;
  else if ((input.crushingBlow ?? 0) >= 5) score += 1;

  if ((input.lifeLeech ?? 0) >= 3) score += 1;
  score += supportScore(input);

  for (const pattern of glovePatternRules) {
    if (pattern.check(input)) {
      score += pattern.score;
      matchedPatterns.push(pattern.label);
      pattern.archetypes.forEach((tag) => tags.add(tag));
    }
  }

  score -= weakStatPenalty(input, matchedPatterns);

  if (input.mode === "SCNL" && score <= 9) score -= 1;
  if (input.mode === "SCL" && input.increasedAttackSpeed === 20) score += 1;

  const verdict = verdictFromScore(score);
  const archetypeTags = tags.size > 0 ? Array.from(tags) : ["niche" as RingArchetype];

  return {
    verdict,
    priority: priorityFromVerdict(verdict),
    liquidity: liquidityFor(input, verdict, matchedPatterns),
    explanation: explanationFor(input, verdict, matchedPatterns),
    recommendedAction: recommendedActionFor(verdict, input, matchedPatterns),
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}
