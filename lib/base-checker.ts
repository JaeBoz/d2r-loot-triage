import { baseItemMap } from "@/lib/data";
import {
  BaseCheckInput,
  BaseCheckResult,
  BaseItem,
  BasePriorityTier,
  EvaluationPriority,
  GameMode,
  Liquidity,
  Verdict
} from "@/lib/types";

const tierScore: Record<BasePriorityTier, number> = {
  low: 1,
  medium: 3,
  high: 5,
  premium: 7
};

const scoreToVerdict = (score: number): Verdict => {
  if (score <= 1) return "Ignore";
  if (score <= 3) return "Low Priority";
  if (score <= 6) return "Keep";
  return "Premium";
};

const scoreToPriority = (score: number): EvaluationPriority => {
  if (score <= 0) return "Trash";
  if (score <= 2) return "Low Trade Value";
  if (score <= 5) return "Moderate Trade Value";
  if (score <= 7) return "High Trade Value";
  return "Premium Trade Value";
};

const liquidityFromTier = (tier: BasePriorityTier, mode: GameMode, item: BaseItem): Liquidity => {
  let score = tierScore[tier];

  if (mode === "SCNL") {
    score -= 1;
  }

  if (mode === "SCL" && item.tags.includes("ladder-staple")) {
    score += 1;
  }

  if (item.category === "Polearm" || item.name === "Archon Plate") {
    score += 1;
  }

  if (score <= 2) return "Low";
  if (score <= 5) return "Medium";
  return "High";
};

const formatSockets = (sockets: number[]) => {
  if (sockets.length === 1) {
    return `${sockets[0]} socket${sockets[0] === 1 ? "" : "s"}`;
  }

  const initial = sockets.slice(0, -1).map((socket) => `${socket}`);
  const last = sockets[sockets.length - 1];
  return `${initial.join(", ")} or ${last} sockets`;
};

const articleFor = (value: string) => (/^[aeiou]/i.test(value) ? "an" : "a");

const modePriority = (item: BaseItem, mode: GameMode) => (mode === "SCNL" ? item.scnlPriority : item.sclPriority);

const primaryUseCase = (item: BaseItem) => item.runewordUseCases[0] ?? "runeword";

function adjustForEtherealState(score: number, input: BaseCheckInput, item: BaseItem, details: string[]) {
  if (input.ethereal) {
    if (!item.etherealAllowed) {
      details.push(`Ethereal ${item.name} loses value because buyers usually want a self-use version.`);
      return score - 4;
    }

    if (item.ethPriority === "required") {
      details.push(`Ethereal status is required for this ${primaryUseCase(item)} profile to matter.`);
      return score + 4;
    }

    if (item.ethPriority === "high") {
      details.push(`Ethereal status is a major upside for this ${item.category.toLowerCase()} base.`);
      return score + 3;
    }

    if (item.ethPriority === "medium") {
      details.push(`Ethereal status adds meaningful upside for some buyers.`);
      return score + 1;
    }

    details.push("Ethereal status does not meaningfully improve this base.");
    return score - 1;
  }

  if (item.ethPriority === "required") {
    details.push(`Non-eth ${item.name} misses the core demand pattern for this base.`);
    return score - 5;
  }

  if (item.ethPriority === "high") {
    details.push(`Non-eth version has reduced demand on ${input.mode}.`);
    return score - 3;
  }

  if (item.ethPriority === "medium") {
    details.push("Non-eth is still usable, but it is not the preferred version.");
    return score - 1;
  }

  return score;
}

function adjustForSockets(score: number, input: BaseCheckInput, item: BaseItem, details: string[]) {
  if (!item.socketSensitive) {
    return score;
  }

  if (!item.validSockets.includes(input.sockets)) {
    details.push(`${input.sockets} sockets is not a possible outcome for ${item.name}.`);
    return score - 4;
  }

  if (input.sockets === 0) {
    details.push(`Unsocketed ${item.name} can still matter because buyers may want to control the final ${formatSockets(item.desiredSockets)} outcome.`);
    return score + (item.socketSensitive ? 1 : 0);
  }

  if (item.desiredSockets.includes(input.sockets)) {
    details.push(`${input.sockets} sockets matches the most desirable setup for ${primaryUseCase(item)}.`);
    return score + 2;
  }

  details.push(
    `${input.sockets} sockets is off-pattern for this base. The usual target is ${formatSockets(item.desiredSockets)}.`
  );
  return score - 3;
}

function adjustForAffixes(score: number, input: BaseCheckInput, item: BaseItem, details: string[]) {
  let nextScore = score;
  const isCircletFamily = item.tags.includes("circlet");

  if (input.superior) {
    nextScore += 1;
    details.push("Superior quality adds a small extra bump.");
  }

  if (item.category === "Armor" && typeof input.defenseOrEd === "number") {
    if (input.defenseOrEd >= 500) {
      nextScore += 1;
      details.push("High defense helps this armor stand out.");
    } else if (input.defenseOrEd < 430) {
      nextScore -= 1;
      details.push("Low defense reduces upside unless the base is especially liquid.");
    }
  }

  if (isCircletFamily && typeof input.defenseOrEd === "number") {
    if (input.defenseOrEd >= 45) {
      nextScore += 2;
      details.push("Strong circlet-family defense makes this base more attractive for superior socketed setups.");
    } else if (input.defenseOrEd >= 30) {
      nextScore += 1;
      details.push("Respectable circlet-family defense helps the base stand out.");
    }
  }

  if (isCircletFamily && input.superior && typeof input.durabilityBonus === "number") {
    if (input.durabilityBonus >= 10) {
      nextScore += 1;
      details.push("Superior durability is a real quality bump on circlet-family bases.");
    } else if (input.durabilityBonus > 0) {
      details.push("Superior durability is present, but the roll is not especially notable.");
    }
  }

  if (item.category === "Shield" && typeof input.allRes === "number") {
    if (input.allRes >= 40) {
      nextScore += 3;
      details.push("High all-res automod is a premium paladin shield trait.");
    } else if (input.allRes >= 30) {
      nextScore += 1;
      details.push("Good all-res keeps the shield worth holding.");
    } else if (input.allRes > 0) {
      details.push("The all-res roll is usable but not exceptional.");
    }
  }

  return nextScore;
}

function buildExplanation(item: BaseItem, input: BaseCheckInput, verdict: Verdict, details: string[]) {
  const ethLabel = input.ethereal ? "Eth " : "Non-eth ";
  const useCase = primaryUseCase(item);

  if (item.tags.includes("circlet")) {
    return `${ethLabel}${item.name} is a circlet-family base for ${input.mode}. ${details.join(" ")}`;
  }

  return `${ethLabel}${item.name} is ${articleFor(useCase)} ${useCase} base for ${input.mode}. ${details.join(" ")}`;
}

function buildRecommendedAction(item: BaseItem, verdict: Verdict) {
  if (verdict === "Ignore") {
    return "Ignore unless you need the base personally.";
  }

  if (verdict === "Low Priority") {
    return "Stash only if you have room; move on unless the market is unusually active.";
  }

  if (verdict === "Keep") {
    return "Keep it and compare against your local reference list before listing.";
  }

  return "Treat this as a premium trade base and prepare to list or mule it.";
}

export function evaluateBase(input: BaseCheckInput): BaseCheckResult {
  const item = baseItemMap.get(input.itemId);

  if (!item) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "Unknown base item. The current local dataset does not contain a rule for it.",
      recommendedAction: "Ignore it for now or extend the local data file."
    };
  }

  const tier = modePriority(item, input.mode);
  const details: string[] = [item.notes];
  let score = tierScore[tier];

  score = adjustForEtherealState(score, input, item, details);
  score = adjustForSockets(score, input, item, details);
  score = adjustForAffixes(score, input, item, details);

  if (input.mode === "SCL" && item.tags.includes("ladder-staple")) {
    score += 1;
    details.push("Ladder demand keeps this base moving more quickly.");
  }

  if (input.mode === "SCNL" && tier !== "premium" && item.category !== "Polearm") {
    score -= 1;
    details.push("SCNL liquidity is usually softer for common bases.");
  }

  const liquidity = liquidityFromTier(tier, input.mode, item);
  const priority = scoreToPriority(score);

  const verdict = scoreToVerdict(score);

  return {
    verdict,
    priority,
    liquidity,
    explanation: buildExplanation(item, input, verdict, details),
    recommendedAction: buildRecommendedAction(item, verdict)
  };
}
