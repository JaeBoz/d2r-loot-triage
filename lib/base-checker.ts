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
  if (score <= 3) return "Low Trade Value";
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

const SUPERIOR_ROLL_CAP = 15;

function clampSuperiorRoll(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(SUPERIOR_ROLL_CAP, Math.max(0, value));
}

function isWeaponBase(item: BaseItem) {
  return item.category === "Weapon" || item.category === "Polearm";
}

function isArmorLikeBase(item: BaseItem) {
  return item.category === "Armor" || item.category === "Shield" || item.category === "Helm";
}

function hasMeaningfulUnsocketedDemand(input: BaseCheckInput, item: BaseItem) {
  if (item.tags.includes("merc") && input.ethereal && item.ethPriority !== "low") {
    return true;
  }

  if (item.category === "Armor" && (item.scnlPriority === "high" || item.scnlPriority === "premium")) {
    return true;
  }

  if (item.tags.includes("paladin") && (input.allRes ?? 0) >= 30) {
    return true;
  }

  if (item.tags.includes("circlet")) {
    return true;
  }

  return false;
}

function baseDemandPhrase(item: BaseItem, input: BaseCheckInput) {
  const superiorEd = clampSuperiorRoll(input.superiorEnhancedDamage);
  const superiorEDef = clampSuperiorRoll(input.superiorEnhancedDefense);

  if (input.superior && isWeaponBase(item) && superiorEd >= 15 && item.socketSensitive && item.desiredSockets.includes(input.sockets)) {
    return "Superior ED boosts the base";
  }

  if (input.superior && isArmorLikeBase(item) && superiorEDef >= 15 && item.socketSensitive && item.desiredSockets.includes(input.sockets)) {
    return "Superior EDef boosts the base";
  }

  if (item.socketSensitive && input.sockets === 0 && !hasMeaningfulUnsocketedDemand(input, item)) {
    return "Socket state drives value";
  }

  if (item.socketSensitive && input.sockets > 0 && !item.desiredSockets.includes(input.sockets)) {
    return "Wrong socket state drives value";
  }

  if (item.socketSensitive && item.desiredSockets.includes(input.sockets)) {
    return `${input.sockets}os makes the ${primaryUseCase(item)} base`;
  }

  if (item.socketSensitive && input.sockets === 0 && item.tags.includes("merc") && input.ethereal && item.ethPriority !== "low") {
    return "Eth merc base drives value";
  }

  if (item.tags.includes("merc") && input.ethereal && item.ethPriority !== "low") {
    return "Eth merc base drives value";
  }

  if (item.tags.includes("paladin") && (input.allRes ?? 0) >= 30) {
    return "Paladin all res drives value";
  }

  if (item.scnlPriority === "low" || item.tags.includes("staffmods")) {
    return "Build-specific use drives value";
  }

  return "Runeword plan drives value";
}

function adjustForEtherealState(score: number, input: BaseCheckInput, item: BaseItem, details: string[]) {
  if (input.ethereal) {
    if (!item.etherealAllowed) {
      details.push(`Eth ${item.name} is usually worse because buyers want a self-use version.`);
      return score - 4;
    }

    if (item.ethPriority === "required") {
      details.push(`Eth is required for this ${primaryUseCase(item)} setup to matter.`);
      return score + 4;
    }

    if (item.ethPriority === "high") {
      details.push(`Eth is a major upside for this ${item.category.toLowerCase()} base.`);
      return score + 3;
    }

    if (item.ethPriority === "medium") {
      details.push("Eth adds a real bump for some buyers.");
      return score + 1;
    }

    details.push("Eth does not really improve this base.");
    return score - 1;
  }

  if (item.ethPriority === "required") {
    details.push(`Non-eth ${item.name} misses the main version people want.`);
    return score - 5;
  }

  if (item.ethPriority === "high") {
    details.push(`Non-eth is a weaker hit on ${input.mode}.`);
    return score - 3;
  }

  if (item.ethPriority === "medium") {
    details.push("Non-eth is usable, but not preferred.");
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
    details.push(
      `Unsocketed ${item.name} can hit ${formatSockets(item.desiredSockets)}, but it needs the right socket state before it is a clean trade base.`
    );

    if (hasMeaningfulUnsocketedDemand(input, item)) {
      let nextScore = score;

      if (item.tags.includes("merc") && input.ethereal) {
        details.push("Unsocketed eth merc bases can still matter because buyers may want socket control.");
        nextScore += 1;
      } else {
        details.push("Socket potential, not a finished socket hit.");
      }

      return nextScore;
    }

    let nextScore = score - 1;

    if (input.mode === "SCNL" && (item.category === "Weapon" || item.category === "Shield")) {
      details.push("On SCNL, common unsocketed weapons and shields are everywhere. They usually need correct sockets.");
    }

    return nextScore;
  }

  if (item.desiredSockets.includes(input.sockets)) {
    details.push(`${input.sockets} sockets hits the normal ${primaryUseCase(item)} setup.`);
    return score + 2;
  }

  details.push(
    `${input.sockets} sockets is off-pattern. The usual target is ${formatSockets(item.desiredSockets)}.`
  );
  return score - 3;
}

function adjustForAffixes(score: number, input: BaseCheckInput, item: BaseItem, details: string[]) {
  let nextScore = score;
  const isCircletFamily = item.tags.includes("circlet");
  const superiorEd = clampSuperiorRoll(input.superiorEnhancedDamage);
  const superiorEDef = clampSuperiorRoll(input.superiorEnhancedDefense);
  const superiorDurability = clampSuperiorRoll(input.durabilityBonus);
  const hasUsefulBaseState =
    (item.socketSensitive && item.desiredSockets.includes(input.sockets)) ||
    (input.sockets === 0 && hasMeaningfulUnsocketedDemand(input, item)) ||
    (!item.socketSensitive && modePriority(item, input.mode) !== "low");

  if (input.superior) {
    if (hasUsefulBaseState) {
      details.push("Superior roll supports a useful base state.");
    } else {
      details.push("Superior roll cannot rescue a weak base state.");
    }
  }

  if (item.category === "Armor" && typeof input.defenseOrEd === "number") {
    if (input.defenseOrEd >= 500) {
      nextScore += 1;
      details.push("High defense helps this armor stand out.");
    } else if (input.defenseOrEd < 430) {
      nextScore -= 1;
      details.push("Low defense makes it less exciting.");
    }
  }

  if (isCircletFamily && typeof input.defenseOrEd === "number") {
    if (input.defenseOrEd >= 45) {
      nextScore += 2;
      details.push("Strong circlet defense helps the superior socketed setup.");
    } else if (input.defenseOrEd >= 30) {
      nextScore += 1;
      details.push("Decent circlet defense helps it stand out.");
    }
  }

  if (input.superior && hasUsefulBaseState) {
    if (isWeaponBase(item) && superiorEd > 0) {
      if (superiorEd >= 15) {
        nextScore += 3;
        details.push("15 ED superior roll.");
      } else if (superiorEd >= 10) {
        nextScore += 2;
        details.push("Strong superior ED roll.");
      } else {
        nextScore += 1;
        details.push("Superior ED adds minor support.");
      }
    }

    if (isArmorLikeBase(item) && superiorEDef > 0) {
      if (superiorEDef >= 15) {
        nextScore += 3;
        details.push("15 EDef superior roll.");
      } else if (superiorEDef >= 10) {
        nextScore += 2;
        details.push("Strong superior EDef roll.");
      } else {
        nextScore += 1;
        details.push("Superior EDef adds minor support.");
      }
    }

    if (superiorDurability > 0) {
      nextScore += superiorDurability >= 10 ? 1 : 0;
      details.push("Superior durability adds minor support.");
    }
  }

  if (item.category === "Shield" && typeof input.allRes === "number") {
    if (input.allRes >= 40) {
      nextScore += 3;
      details.push("High all-res is the paladin shield hit.");
    } else if (input.allRes >= 30) {
      nextScore += 1;
      details.push("Good all-res keeps the shield worth holding.");
    } else if (input.allRes > 0) {
      details.push("Usable all-res, but not a standout.");
    }
  }

  return nextScore;
}

function buildExplanation(item: BaseItem, input: BaseCheckInput, verdict: Verdict, details: string[]) {
  return baseDemandPhrase(item, input);
}

function buildRecommendedAction(item: BaseItem, input: BaseCheckInput, verdict: Verdict) {
  if (item.socketSensitive && input.sockets === 0 && hasMeaningfulUnsocketedDemand(input, item)) {
    return `Good base. Socket potential matters, but it needs ${formatSockets(item.desiredSockets)} before it is a finished trade piece.`;
  }

  if (item.socketSensitive && input.sockets === 0 && !hasMeaningfulUnsocketedDemand(input, item)) {
    return `Conditional keep. It needs ${formatSockets(item.desiredSockets)} to be clean.`;
  }

  if (item.socketSensitive && input.sockets > 0 && !item.desiredSockets.includes(input.sockets)) {
    return `Usually move on. This misses the normal ${formatSockets(item.desiredSockets)} target.`;
  }

  if (item.socketSensitive && item.desiredSockets.includes(input.sockets)) {
    return "Right sockets. Keep it and compare later.";
  }

  if (verdict === "Ignore") {
    return "Drop it unless you need the base personally.";
  }

  if (verdict === "Low Priority") {
    return "Only stash for a specific buyer or use case.";
  }

  if (verdict === "Keep") {
    return "Keep it. Real base, not always instant trade.";
  }

  return "Keep it. Premium base hit.";
}

export function evaluateBase(input: BaseCheckInput): BaseCheckResult {
  const item = baseItemMap.get(input.itemId);

  if (!item) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "Unknown base item. The current local dataset does not contain a rule for it.",
      recommendedAction: "Ignore it for now or add a local rule later."
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
    details.push("Ladder keeps this base moving faster.");
  }

  if (input.mode === "SCNL" && tier !== "premium" && item.category !== "Polearm") {
    score -= 1;
    details.push("SCNL is tougher on common bases.");
  }

  const liquidity = liquidityFromTier(tier, input.mode, item);
  const priority = scoreToPriority(score);

  const verdict = scoreToVerdict(score);

  return {
    verdict,
    priority,
    liquidity,
    explanation: buildExplanation(item, input, verdict, details),
    recommendedAction: buildRecommendedAction(item, input, verdict)
  };
}
