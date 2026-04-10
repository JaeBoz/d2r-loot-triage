import { jewelModeAdjustments, jewelStatWeights, jewelSynergies } from "@/data/jewel-rules";
import {
  EvaluationPriority,
  JewelCheckInput,
  JewelCheckResult,
  JewelPatternInput,
  Liquidity,
  RingArchetype,
  Verdict
} from "@/lib/types";

type NormalizedJewelStats = Omit<JewelCheckInput, "mode">;

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

function normalizeStats(input: JewelCheckInput): NormalizedJewelStats {
  const stats: NormalizedJewelStats = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === "mode") continue;
    if (typeof value === "number" && !Number.isNaN(value) && value > 0) {
      stats[key as keyof NormalizedJewelStats] = value;
    }
  }

  return stats;
}

function statScoreFor(key: keyof NormalizedJewelStats, value: number) {
  const thresholds = jewelStatWeights[key as keyof typeof jewelStatWeights];
  if (!thresholds) return 0;
  const match = thresholds.find((threshold) => value >= threshold.min);
  return match?.score ?? 0;
}

function detectArchetypes(stats: NormalizedJewelStats): RingArchetype[] {
  const tags = new Set<RingArchetype>();

  if ((stats.increasedAttackSpeed ?? 0) >= 15 || (stats.allResist ?? 0) >= 6) {
    tags.add("PvM");
  }

  if ((stats.enhancedDamage ?? 0) >= 20 || (stats.maxDamage ?? 0) >= 4 || (stats.attackRating ?? 0) >= 30) {
    tags.add("melee");
  }

  if (
    (stats.increasedAttackSpeed ?? 0) >= 15 &&
    ((stats.enhancedDamage ?? 0) >= 20 || (stats.maxDamage ?? 0) >= 4 || (stats.attackRating ?? 0) >= 30)
  ) {
    tags.add("PvP");
  }

  if ((stats.allResist ?? 0) >= 10 || (stats.lightningResist ?? 0) >= 15) {
    tags.add("niche");
  }

  if (tags.size === 0) {
    tags.add("niche");
  }

  return Array.from(tags);
}

function toJewelPatternInput(stats: NormalizedJewelStats): JewelPatternInput {
  return {
    increasedAttackSpeed: stats.increasedAttackSpeed,
    enhancedDamage: stats.enhancedDamage,
    strength: stats.strength,
    dexterity: stats.dexterity,
    life: stats.life,
    attackRating: stats.attackRating,
    maxDamage: stats.maxDamage,
    minDamage: stats.minDamage,
    allResist: stats.allResist,
    fireResist: stats.fireResist,
    lightningResist: stats.lightningResist,
    coldResist: stats.coldResist,
    poisonResist: stats.poisonResist,
    requirementsReduction: stats.requirementsReduction,
    lifeLeech: stats.lifeLeech
  };
}

function synergyScore(stats: NormalizedJewelStats, tags: Set<RingArchetype>, highlights: string[]) {
  let score = 0;
  const patternInput = toJewelPatternInput(stats);

  for (const synergy of jewelSynergies) {
    if (synergy.check(patternInput)) {
      score += synergy.score;
      synergy.archetypes.forEach((tag) => tags.add(tag));
      highlights.push(synergy.label);
    }
  }

  return score;
}

function awkwardPenalty(stats: NormalizedJewelStats, highlights: string[]) {
  let penalty = 0;
  const hasAnchor =
    (stats.increasedAttackSpeed ?? 0) >= 15 ||
    (stats.enhancedDamage ?? 0) >= 20 ||
    (stats.allResist ?? 0) >= 10 ||
    (stats.lightningResist ?? 0) >= 15;

  if (Object.keys(stats).length >= 4 && !hasAnchor) {
    penalty += 2;
    highlights.push("scattered stats without a strong jewel pattern");
  }

  return penalty;
}

function liquidityFrom(score: number, mode: JewelCheckInput["mode"], tags: RingArchetype[], highlights: string[]): Liquidity {
  if (highlights.includes("IAS with resist support")) return "High";
  if (highlights.includes("IAS with enhanced damage")) return "High";
  if (highlights.includes("IAS with stat support")) return score >= 12 ? "High" : "Medium";
  if (highlights.includes("enhanced damage with -requirements")) return score >= 12 ? "High" : "Medium";

  let liquidityScore = score + jewelModeAdjustments[mode].liquidityBias;

  if (highlights.includes("resist utility jewel")) liquidityScore += 1;
  if (tags.includes("niche") && !tags.includes("melee")) liquidityScore -= 1;

  if (liquidityScore <= 5) return "Low";
  if (liquidityScore <= 11) return "Medium";
  return "High";
}

function topSummary(stats: NormalizedJewelStats) {
  const parts: string[] = [];
  if (stats.increasedAttackSpeed) parts.push(`${stats.increasedAttackSpeed} IAS`);
  if (stats.enhancedDamage) parts.push(`${stats.enhancedDamage}% ED`);
  if (stats.allResist) parts.push(`${stats.allResist} all resist`);
  if (!stats.allResist && stats.lightningResist) parts.push(`${stats.lightningResist} lightning resist`);
  if (stats.requirementsReduction) parts.push(`${stats.requirementsReduction}% -req`);
  if (stats.maxDamage && stats.attackRating) parts.push(`${stats.maxDamage} max damage / ${stats.attackRating} AR`);
  if (!stats.maxDamage && stats.strength) parts.push(`${stats.strength} strength`);
  return parts.slice(0, 3).join(", ");
}

function explanationFor(
  input: JewelCheckInput,
  verdict: Verdict,
  tags: RingArchetype[],
  highlights: string[],
  stats: NormalizedJewelStats
) {
  const summary = topSummary(stats) || "some usable stats";
  const comboText = highlights.length > 0 ? highlights.slice(0, 2).join(" and ") : "the overall stat mix";
  const leadTag = tags[0] ?? "niche";

  if (verdict === "Ignore") {
    return `This jewel has ${summary}, but it lacks a strong tradable pattern for ${input.mode}.`;
  }

  if (verdict === "Low Priority") {
    return `This looks like a ${leadTag} jewel with ${summary}, but the synergy is too thin for meaningful trade value.`;
  }

  if (verdict === "Check") {
    return `${summary} gives this jewel some ${leadTag} appeal. It is worth checking because of ${comboText}.`;
  }

  if (verdict === "Keep") {
    return `${summary} makes this a usable ${leadTag} jewel. ${comboText} gives it real value, even if liquidity may vary.`;
  }

  if (verdict === "List") {
    if (highlights.includes("enhanced damage with -requirements")) {
      return `${summary} makes this a tradable ${leadTag} jewel. ${comboText} has niche but real value for socketing awkward bases.`;
    }
    return `${summary} makes this a tradable ${leadTag} jewel. ${comboText} is a real marketable pattern.`;
  }

  return `${summary} makes this a premium ${leadTag} jewel. ${comboText} pushes it into premium trade territory.`;
}

function recommendedActionFor(verdict: Verdict, highlights: string[]) {
  if (verdict === "Ignore") return "Ignore it unless you need a temporary self-use jewel.";
  if (verdict === "Low Priority") return "Only keep it if you want a stash filler or niche utility option.";
  if (verdict === "Check") return "Check the mod mix carefully before tossing it. The jewel has at least one useful angle.";
  if (verdict === "Keep") return "Keep it. This is useful enough to stash for a future socket.";
  if (verdict === "List") {
    if (highlights.includes("IAS with resist support")) {
      return "Check market activity or list it. IAS + resist jewels are broadly useful and commonly tradable.";
    }
    if (highlights.includes("enhanced damage with -requirements")) {
      return "Check market activity or list it. ED + -requirements jewels have niche but real trade value.";
    }
    return "List it or compare it against similar trade jewels.";
  }
  return "Treat this as premium trade value and prepare to list it.";
}

export function evaluateJewel(input: JewelCheckInput): JewelCheckResult {
  const stats = normalizeStats(input);

  if (Object.keys(stats).length === 0) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No jewel stats were entered yet, so there is nothing meaningful to evaluate.",
      recommendedAction: "Enter the visible jewel mods to triage it.",
      qualityScore: 0,
      archetypeTags: ["niche"]
    };
  }

  let score = jewelModeAdjustments[input.mode].floorBonus;
  const tagSet = new Set<RingArchetype>(detectArchetypes(stats));
  const highlights: string[] = [];

  for (const [key, value] of Object.entries(stats)) {
    score += statScoreFor(key as keyof NormalizedJewelStats, value as number);
  }

  score += synergyScore(stats, tagSet, highlights);
  score -= awkwardPenalty(stats, highlights);

  if (input.mode === "SCNL" && score <= 8) {
    score -= 1;
  }

  if (input.mode === "SCL" && ((stats.increasedAttackSpeed ?? 0) >= 15 || (stats.allResist ?? 0) >= 10)) {
    score += 1;
  }

  const archetypeTags = Array.from(tagSet);
  const verdict = verdictFromScore(score);

  return {
    verdict,
    priority: priorityFromVerdict(verdict),
    liquidity: liquidityFrom(score, input.mode, archetypeTags, highlights),
    explanation: explanationFor(input, verdict, archetypeTags, highlights, stats),
    recommendedAction: recommendedActionFor(verdict, highlights),
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}
