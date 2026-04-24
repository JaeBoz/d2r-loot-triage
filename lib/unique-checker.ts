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

function scoreDefinitionRoll(input: UniqueCheckInput, definition: UniqueRollDefinition, details: string[]) {
  const label = definition.label;
  const band = getRollBand(input, definition);

  if (band === "high") {
    details.push(`${label} rolled near the top end.`);
    return 5;
  }

  if (band === "mid") {
    details.push(`${label} rolled in a solid tradable range.`);
    return 2;
  }

  if (band === "low") {
    details.push(`${label} is on the low side for this unique.`);
    return -2;
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

    assessment.score += scoreDefinitionRoll(input, definition, details);
  }

  return assessment;
}

function scoreRollPackage(item: UniqueItemDefinition, assessment: RollAssessment, details: string[]) {
  if (!item.rollDefinitions || assessment.provided === 0) {
    return 0;
  }

  if (assessment.high >= 2) {
    details.push("Multiple key rolls landed near the top end, which materially boosts trade appeal.");
    return 2;
  }

  if (assessment.low >= assessment.provided && assessment.provided > 0) {
    details.push("The tracked rolls are mostly low, so this version is much less exciting than the item name alone suggests.");
    return -2;
  }

  if (assessment.low > 0 && assessment.high === 0 && assessment.mid === 0) {
    details.push("None of the tracked rolls landed in a strong tradable range.");
    return -1;
  }

  if (assessment.high === 0 && assessment.mid > 0 && assessment.low > 0) {
    details.push("This is a mixed roll package rather than a clearly strong one.");
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
      details.push("Ethereal adds real javazon appeal here, but it is a selective premium rather than a generic huge upgrade.");
      return 2;
    }

    details.push("Non-eth Titan's is still tradable, but it gives up the extra appeal eth rolls can have.");
    return -1;
  }

  if (item.id === "the-reapers-toll") {
    if (input.ethereal) {
      details.push("Ethereal is a major value jump on Reaper's Toll because mercenary demand strongly favors it.");
      return 4;
    }

    details.push("Non-eth Reaper's Toll is still useful, but it misses the strongest mercenary demand.");
    return -2;
  }

  if (input.ethereal) {
    if (item.ethPriority === "required") {
      details.push("Ethereal is effectively required for the strongest trade appeal on this unique.");
      return 4;
    }

    if (item.ethPriority === "high") {
      details.push("Ethereal meaningfully boosts trade appeal on this unique.");
      return 3;
    }

    if (item.ethPriority === "medium") {
      details.push("Ethereal adds some extra trade appeal here.");
      return 1;
    }

    details.push("Ethereal is valid here, but only a minor value factor.");
    return 0;
  }

  if (item.ethPriority === "required") {
    details.push("Non-eth versions are much less desirable for the highest-end demand.");
    return -3;
  }

  if (item.ethPriority === "high") {
    details.push("Non-eth versions are still usable, but they miss the premium eth appeal.");
    return -2;
  }

  return 0;
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
    return "It is commonly sought after, so demand can be steady even when the roll is not premium.";
  }

  if (item.liquidity === "Medium") {
    return "Demand is more selective, so roll quality or the right buyer matters more than the item name alone.";
  }

  if (item.liquidity === "Low") {
    return "Demand is limited, so this is mostly a self-use or niche-market check.";
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

  const details: string[] = [item.notes];
  let score = tierScore[baseTier(item, input.mode)];

  if (input.mode === "SCNL" && item.liquidity !== "High") {
    score -= 1;
    details.push("SCNL is more selective because long-term supply is deeper.");
  }

  if (input.mode === "SCL" && item.liquidity !== "Low") {
    score += 1;
    details.push("SCL is a bit more permissive because progression demand is broader.");
  }

  const rollAssessment = scoreRolls(input, item, details);
  score += rollAssessment.score;
  score += scoreRollPackage(item, rollAssessment, details);
  score += scoreEthereal(input, item, details);

  const verdict = verdictFromScore(score);
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
        ? "This version has a genuinely strong roll package."
        : rollAssessment.high >= 1 && rollAssessment.low === 0
          ? "At least one key roll landed high enough to matter."
          : rollAssessment.low >= rollAssessment.provided && rollAssessment.provided > 0
            ? "The visible rolls are mostly weak for this unique."
            : rollAssessment.mid > 0 || rollAssessment.low > 0
              ? "This looks more middling than premium."
              : "Roll quality is the main separator on this unique.";
    explanation = `${item.name} has real trade value, but value depends heavily on roll quality. ${rollSummary} ${details.join(" ")} ${demandNote}`.trim();
  } else {
    explanation = `${item.name} is generally worth caring about, though the exact appeal depends on the visible rolls. ${details.join(" ")} ${demandNote}`.trim();
  }

  let recommendedAction = "";
  if (verdict === "Ignore") {
    recommendedAction = "Usually ignore unless you need this exact unique for self-use.";
  } else if (verdict === "Low Priority") {
    recommendedAction = "Keep only if you want a personal placeholder or the market is unusually active.";
  } else if (verdict === "Check") {
    recommendedAction =
      item.liquidity === "High"
        ? "Check the roll, but do not toss it quickly. This is a commonly sought-after unique."
        : "Check the roll more carefully before deciding whether to stash or trade it.";
  } else if (verdict === "Keep") {
    recommendedAction =
      item.liquidity === "High"
        ? "Keep it and check market activity. Demand is steady even if this is not a premium-roll outcome."
        : "Keep it if you have stash room. This is useful, but demand may be selective.";
  } else if (verdict === "List") {
    recommendedAction =
      item.liquidity === "High"
        ? "Check market activity or list it. It is easy to understand and commonly traded, but roll quality still matters."
        : "Check market activity or list it only if the roll is competitive; demand is more niche.";
  } else {
    recommendedAction = "Treat this as premium and compare it against top-end listings.";
  }

  if (item.etherealRelevant && input.ethereal && verdict !== "Ignore" && verdict !== "Low Priority") {
    recommendedAction =
      verdict === "Premium"
        ? "Treat this as a premium eth unique and compare it against top-end listings."
        : "Keep or list it. Ethereal meaningfully improves this unique's trade appeal.";
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
