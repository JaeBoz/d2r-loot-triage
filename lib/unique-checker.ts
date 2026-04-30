import { uniqueItems } from "@/data/unique-items";
import {
  BasePriorityTier,
  Liquidity,
  UniqueCheckInput,
  UniqueCheckResult,
  UniqueItemDefinition,
  UniqueRollDefinition,
  Verdict
} from "@/lib/types";

const uniqueItemMap = new Map(uniqueItems.map((item) => [item.id, item]));

const tierScore: Record<BasePriorityTier, number> = {
  low: 2,
  medium: 5,
  high: 8,
  premium: 12
};

const verdictFromScore = (score: number): Verdict => {
  if (score <= 1) return "Ignore";
  if (score <= 4) return "Low Priority";
  if (score <= 7) return "Check";
  if (score <= 11) return "Keep";
  if (score <= 15) return "List";
  return "Premium";
};

const uniqueVerdictRank: Record<Verdict, number> = {
  Ignore: 0,
  "Low Priority": 1,
  Check: 2,
  "Check sockets": 2,
  Keep: 3,
  List: 4,
  Premium: 5
};

const primeEvilGrimoires = new Set(["ars-al-diabolos", "ars-tor-baalos", "ars-dul-mephistos"]);

const uniqueRollWeights: Record<string, Partial<Record<UniqueRollDefinition["key"], number>>> = {
  "ormus-robes": {
    elementalSkillDamage: 1,
    fasterCastRate: 0.2
  },
  dreadfang: {
    enhancedDamage: 1,
    manaLeech: 0.8
  },
  "bloodpact-shard": {
    bindDemon: 1,
    bloodBoil: 1,
    bloodOath: 1,
    maxLifePercent: 0.8,
    magicFind: 0.6
  },
  wraithstep: {
    defense: 0.25,
    dexterity: 0.6,
    energy: 0.4
  },
  sling: {
    minusEnemyMagicResist: 0.8,
    energy: 0.4,
    magicFind: 0.5
  },
  opalvein: {
    fireResist: 0.4,
    manaAfterKill: 0.5,
    lifeAfterKill: 0.5
  },
  "entropy-locket": {
    fasterCastRate: 1,
    magicSkillDamage: 1,
    maxManaPercent: 0.7,
    lightningResist: 0.4,
    magicDamageReduced: 0.3
  },
  "gheeds-wager": {
    fasterRunWalk: 0.8,
    fasterCastRate: 1,
    fasterHitRecovery: 0.7,
    minusEnemyMagicResist: 0.8,
    enhancedDefense: 0.3,
    fireResist: 0.3,
    extraGold: 0.2
  },
  "hellwardens-will": {
    minusEnemyMagicResist: 0.8,
    minusEnemyFireResist: 0.8,
    enhancedDefense: 0.3,
    manaAfterKill: 0.5
  },
  "measured-wrath": {
    flameWave: 0.6,
    ringOfFire: 0.6,
    summonTainted: 0.6,
    enhancedDefense: 0.3,
    vitality: 0.4,
    fireResist: 0.3,
    lifeAfterKill: 0.2
  }
};

function rollWeightFor(item: UniqueItemDefinition, definition: UniqueRollDefinition) {
  return uniqueRollWeights[item.id]?.[definition.key] ?? 1;
}

function applyDemandFloor(item: UniqueItemDefinition, verdict: Verdict, details: string[]) {
  const isHighDemandStaple = !item.hasVariableRolls && item.liquidity === "High" && item.scnlPriority !== "low";

  if (isHighDemandStaple && uniqueVerdictRank[verdict] < uniqueVerdictRank.List) {
    return "List" as Verdict;
  }

  if ((item.ruleset ?? "lod") === "warlock" && item.hasVariableRolls && uniqueVerdictRank[verdict] < uniqueVerdictRank["Low Priority"]) {
    details.push(
      primeEvilGrimoires.has(item.id)
        ? "Prime Evil books are still worth a second look, even on low rolls."
        : "Warlock demand is still settling, so weak copies are treated as low-value checks instead of automatic trash."
    );
    return "Low Priority" as Verdict;
  }

  return verdict;
}

type RollBand = "high" | "mid" | "low" | null;

type RollAssessment = {
  score: number;
  provided: number;
  high: number;
  mid: number;
  low: number;
};

function baseTier(item: UniqueItemDefinition, mode: UniqueCheckInput["mode"]) {
  return mode === "SCNL" ? item.scnlPriority : item.sclPriority;
}

function getRollBand(input: UniqueCheckInput, definition: UniqueRollDefinition): RollBand {
  const value = input[definition.key];

  if (typeof value !== "number") {
    return null;
  }

  const thresholds = definition.thresholds;
  if (!thresholds) {
    return null;
  }

  if (definition.higherIsBetter) {
    if (thresholds.high !== undefined && value >= thresholds.high) {
      return "high";
    }

    if (thresholds.mid !== undefined && value >= thresholds.mid) {
      return "mid";
    }

    if (thresholds.low !== undefined && value < thresholds.low) {
      return "low";
    }

    return null;
  }

  if (thresholds.high !== undefined && value <= thresholds.high) {
    return "high";
  }

  if (thresholds.mid !== undefined && value <= thresholds.mid) {
    return "mid";
  }

  if (thresholds.low !== undefined && value > thresholds.low) {
    return "low";
  }

  return null;
}

function scoreDefinitionRoll(
  input: UniqueCheckInput,
  item: UniqueItemDefinition,
  definition: UniqueRollDefinition,
  details: string[]
) {
  const label = definition.label;
  const band = getRollBand(input, definition);
  const weight = rollWeightFor(item, definition);

  if (band === "high") {
    details.push(`Good ${label} roll.`);
    return 5 * weight;
  }

  if (band === "mid") {
    details.push(`Solid ${label} roll.`);
    return 2 * weight;
  }

  if (band === "low") {
    details.push(`Low ${label} roll.`);
    return -2 * Math.min(weight, 1);
  }

  return 0;
}

function scoreRolls(input: UniqueCheckInput, item: UniqueItemDefinition, details: string[]): RollAssessment {
  const assessment: RollAssessment = {
    score: 0,
    provided: 0,
    high: 0,
    mid: 0,
    low: 0
  };

  if (!item.rollDefinitions) {
    return assessment;
  }

  for (const definition of item.rollDefinitions) {
    const band = getRollBand(input, definition);

    if (band) {
      assessment.provided += 1;
      assessment[band] += 1;
    }

    assessment.score += scoreDefinitionRoll(input, item, definition, details);
  }

  return assessment;
}

function scoreRollPackage(item: UniqueItemDefinition, assessment: RollAssessment, details: string[]) {
  if (!item.rollDefinitions || assessment.provided === 0) {
    return 0;
  }

  if (assessment.high >= 2) {
    details.push("Multiple good rolls make this copy stand out.");
    return 2;
  }

  if (assessment.low >= assessment.provided && assessment.provided > 0) {
    details.push("Mostly low rolls. The name is better than this copy.");
    return -2;
  }

  if (assessment.low > 0 && assessment.high === 0 && assessment.mid === 0) {
    details.push("No tracked roll landed well.");
    return -1;
  }

  if (assessment.high === 0 && assessment.mid > 0 && assessment.low > 0) {
    details.push("Mixed rolls. Decent, not a standout.");
    return -1;
  }

  return 0;
}

function scoreEthereal(input: UniqueCheckInput, item: UniqueItemDefinition, details: string[]) {
  if (!item.etherealRelevant || !item.ethPriority) {
    return 0;
  }

  if (item.id === "titans-revenge") {
    if (input.ethereal) {
      details.push("Eth adds real javazon appeal, but it is still a specific-buyer upgrade.");
      return 2;
    }

    details.push("Non-eth Titan's is still usable, but eth is the better hit.");
    return -1;
  }

  if (item.id === "the-reapers-toll") {
    if (input.ethereal) {
      details.push("Eth is a major jump here. Merc Reaper's wants eth.");
      return 4;
    }

    details.push("Non-eth Reaper's is useful, but misses the main merc version.");
    return -2;
  }

  if (input.ethereal) {
    if (item.ethPriority === "required") {
      details.push("Eth is basically required for the best version.");
      return 4;
    }

    if (item.ethPriority === "high") {
      details.push("Eth is a meaningful upgrade here.");
      return 3;
    }

    if (item.ethPriority === "medium") {
      details.push("Eth adds a small bump here.");
      return 1;
    }

    details.push("Eth is valid, but not the reason to care.");
    return 0;
  }

  if (item.ethPriority === "required") {
    details.push("Non-eth misses the version buyers usually want.");
    return -3;
  }

  if (item.ethPriority === "high") {
    details.push("Non-eth is usable, but gives up the eth premium.");
    return -2;
  }

  return 0;
}

function scoreUniqueSelects(input: UniqueCheckInput, item: UniqueItemDefinition, details: string[]) {
  if (item.id === "ormus-robes") {
    if (input.ormusSkillQuality === "desirable") {
      details.push("Desirable skill roll. That's what makes Ormus worth checking.");
      return 4;
    }

    if (input.ormusSkillQuality === "useful") {
      details.push("Useful skill roll. Decent, but the exact skill still matters.");
      return 1;
    }

    if (input.ormusSkillQuality === "wrong") {
      details.push("Wrong skill roll. Ormus falls off hard without the right skill.");
      return -8;
    }
  }

  if (item.id === "rainbow-facet" && input.rainbowFacetElement) {
    details.push(`${input.rainbowFacetElement} facet. The 5/5 roll is the real check.`);
  }

  return 0;
}

function applyItemSpecificScoreAdjustments(item: UniqueItemDefinition, score: number, details: string[]) {
  if (item.id === "crown-of-ages" && score <= 1) {
    details.push("Even a weak CoA is still worth a quick second look. Sockets are the value here.");
    return 2;
  }

  if (item.id === "entropy-locket" && score > 15) {
    details.push("Entropy Locket is niche, so even a great roll caps as a high-value check.");
    return 15;
  }

  return score;
}

function liquidityFor(item: UniqueItemDefinition, mode: UniqueCheckInput["mode"], verdict: Verdict) {
  if (verdict === "Ignore" || verdict === "Low Priority") {
    return "Low" as Liquidity;
  }

  if (item.liquidity === "High") {
    return "High";
  }

  if (item.liquidity === "Medium" && mode === "SCNL" && verdict === "Keep") {
    return "Medium";
  }

  return item.liquidity;
}

function demandContext(item: UniqueItemDefinition, verdict: Verdict) {
  if (item.liquidity === "High" && verdict !== "Premium") {
    return "Staple demand is steady even when the roll is not perfect.";
  }

  if (item.liquidity === "Medium") {
    return "More niche. Rolls or the right buyer matter here.";
  }

  if (item.liquidity === "Low") {
    return "Mostly self-use or a niche-market check.";
  }

  return "";
}

export function evaluateUnique(input: UniqueCheckInput): UniqueCheckResult {
  const item = uniqueItemMap.get(input.itemId);

  if (!item) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "Unknown unique item. The current curated list does not include it yet.",
      recommendedAction: "Ignore for now or extend the local unique item list.",
      qualityScore: 0
    };
  }

  const activeRuleset = input.ruleset ?? "lod";
  if ((item.ruleset ?? "lod") !== activeRuleset) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "Wrong ruleset. This unique is not available in the selected ruleset.",
      recommendedAction: "Switch rulesets if you are checking a Warlock or LOD-only item.",
      qualityScore: 0
    };
  }

  const details: string[] = [item.notes];
  let score = tierScore[baseTier(item, input.mode)];

  if (input.mode === "SCNL" && item.liquidity !== "High") {
    score -= 1;
    details.push("SCNL has deep supply, so weak rolls get punished.");
  }

  if (input.mode === "SCL" && item.liquidity !== "Low") {
    score += 1;
    details.push("SCL is more forgiving because progression items move better.");
  }

  const rollAssessment = scoreRolls(input, item, details);
  score += rollAssessment.score;
  score += scoreRollPackage(item, rollAssessment, details);
  score += scoreEthereal(input, item, details);
  score += scoreUniqueSelects(input, item, details);
  score = applyItemSpecificScoreAdjustments(item, score, details);

  const verdict = applyDemandFloor(item, verdictFromScore(score), details);
  const priority =
    verdict === "Ignore"
      ? "Trash"
      : verdict === "Low Priority"
        ? "Low Trade Value"
        : verdict === "Check" || verdict === "Keep"
          ? "Moderate Trade Value"
          : verdict === "List"
            ? "High Trade Value"
            : "Premium Trade Value";

  let explanation = "";
  const demandNote = demandContext(item, verdict);
  if (!item.hasVariableRolls) {
    explanation = `${item.name} is a staple unique. ${item.notes} ${demandNote}`.trim();
  } else if (item.rollDefinitions) {
    const rollSummary =
      rollAssessment.high >= 2
        ? "Good roll package."
        : rollAssessment.high >= 1 && rollAssessment.low === 0
          ? "At least one key roll is strong."
          : rollAssessment.low >= rollAssessment.provided && rollAssessment.provided > 0
            ? "Low roll copy."
            : rollAssessment.mid > 0 || rollAssessment.low > 0
              ? "Decent, but not a standout."
              : "Rolls matter here.";
    explanation = `${item.name}: ${rollSummary} You're mainly paying for the key rolls here. ${details.join(" ")} ${demandNote}`.trim();
  } else {
    explanation = `${item.name}: worth a look. The visible rolls decide whether it is more than self-use. ${details.join(" ")} ${demandNote}`.trim();
  }

  let recommendedAction = "";
  if (verdict === "Ignore") {
    recommendedAction = "Usually Charsi unless you need this exact unique for self-use.";
  } else if (verdict === "Low Priority") {
    recommendedAction = "Keep only as a placeholder or specific self-use piece.";
  } else if (verdict === "Check") {
    recommendedAction =
      item.liquidity === "High"
        ? "Check the roll, but do not toss it quickly. This is a commonly sought-after unique."
        : "Check the roll before tossing it. Low copies may just be self-use.";
  } else if (verdict === "Keep") {
    recommendedAction =
      item.liquidity === "High"
        ? "Keep it and check market activity. Staple demand is steady even when the roll is not perfect."
        : "Keep if you have room. Useful, but more niche.";
  } else if (verdict === "List") {
    recommendedAction =
      !item.hasVariableRolls && item.liquidity === "High"
        ? "Keep it. The drop itself is the value and it is commonly traded."
        : item.liquidity === "High"
          ? "Check market activity or list it. It is commonly traded, but rolls still matter."
          : "List only if the roll is competitive. This one is more niche.";
  } else {
    recommendedAction = "Premium hit. Compare it against strong examples before listing.";
  }

  if (item.etherealRelevant && input.ethereal && verdict !== "Ignore" && verdict !== "Low Priority") {
    recommendedAction =
      verdict === "Premium"
        ? "Premium eth hit. Compare it against strong examples before listing."
        : "Keep or list it. Eth is a real reason this copy matters.";
  }

  return {
    verdict,
    priority,
    liquidity: liquidityFor(item, input.mode, verdict),
    explanation,
    recommendedAction,
    qualityScore: Math.max(0, score)
  };
}

export { uniqueItems };
