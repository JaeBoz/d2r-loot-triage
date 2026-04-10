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

function baseTier(item: UniqueItemDefinition, mode: UniqueCheckInput["mode"]) {
  return mode === "SCNL" ? item.scnlPriority : item.sclPriority;
}

function scoreDefinitionRoll(input: UniqueCheckInput, definition: UniqueRollDefinition, details: string[]) {
  const value = input[definition.key];

  if (typeof value !== "number") {
    return 0;
  }

  const thresholds = definition.thresholds;
  if (!thresholds) {
    return 0;
  }

  const label = definition.label;

  if (definition.higherIsBetter) {
    if (thresholds.high !== undefined && value >= thresholds.high) {
      details.push(`${label} rolled near the top end.`);
      return 5;
    }

    if (thresholds.mid !== undefined && value >= thresholds.mid) {
      details.push(`${label} rolled in a solid tradable range.`);
      return 2;
    }

    if (thresholds.low !== undefined && value < thresholds.low) {
      details.push(`${label} is on the low side for this unique.`);
      return -2;
    }

    return 0;
  }

  if (thresholds.high !== undefined && value <= thresholds.high) {
    details.push(`${label} rolled near the top end.`);
    return 5;
  }

  if (thresholds.mid !== undefined && value <= thresholds.mid) {
    details.push(`${label} rolled in a solid tradable range.`);
    return 2;
  }

  if (thresholds.low !== undefined && value > thresholds.low) {
    details.push(`${label} is on the low side for this unique.`);
    return -2;
  }

  return 0;
}

function scoreRolls(input: UniqueCheckInput, item: UniqueItemDefinition, details: string[]) {
  let score = 0;

  if (!item.rollDefinitions) {
    return score;
  }

  for (const definition of item.rollDefinitions) {
    score += scoreDefinitionRoll(input, definition, details);
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

  score += scoreRolls(input, item, details);

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
  if (!item.hasVariableRolls) {
    explanation = `${item.name} is a staple unique with ${item.liquidity.toLowerCase()} trade demand. ${item.notes}`;
  } else if (item.rollDefinitions) {
    explanation = `${item.name} has real trade value, but value depends heavily on roll quality. ${details.join(" ")}`;
  } else {
    explanation = `${item.name} is generally worth caring about, though the exact appeal depends on the visible rolls. ${details.join(" ")}`;
  }

  let recommendedAction = "";
  if (verdict === "Ignore") {
    recommendedAction = "Usually ignore unless you need this exact unique for self-use.";
  } else if (verdict === "Low Priority") {
    recommendedAction = "Keep only if you want a personal placeholder or the market is unusually active.";
  } else if (verdict === "Check") {
    recommendedAction = "Check the roll more carefully before deciding whether to stash or trade it.";
  } else if (verdict === "Keep") {
    recommendedAction = "Keep it. This is at least a useful or selectively tradable unique.";
  } else if (verdict === "List") {
    recommendedAction = "Check market activity or list it. This unique has real trade value if the roll is competitive.";
  } else {
    recommendedAction = "Treat this as premium and compare it against top-end listings.";
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
