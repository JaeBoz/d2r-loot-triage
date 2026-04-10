import { bootsModeAdjustments, bootsStatWeights, bootsSynergies } from "@/data/boots-rules";
import { BootsCheckInput, BootsCheckResult, EvaluationPriority, Liquidity, RingArchetype, Verdict } from "@/lib/types";

type StatKey = keyof Omit<BootsCheckInput, "mode">;
type NormalizedBootsStats = Omit<BootsCheckInput, "mode">;

const numericKeys: StatKey[] = [
  "fasterRunWalk",
  "fasterHitRecovery",
  "magicFind",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "allResist",
  "strength",
  "dexterity",
  "life",
  "extraGold",
  "replenishLife"
];

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

function normalizeStats(input: BootsCheckInput): NormalizedBootsStats {
  const stats: NormalizedBootsStats = {};

  for (const key of numericKeys) {
    const value = input[key];
    if (typeof value === "number" && !Number.isNaN(value) && value > 0) {
      stats[key] = value;
    }
  }

  return stats;
}

function statScoreFor(key: keyof NormalizedBootsStats, value: number) {
  const rule = bootsStatWeights.find((entry) => entry.key === key);
  if (!rule) return 0;
  const match = rule.thresholds.find((threshold) => value >= threshold.min);
  return match?.score ?? 0;
}

function detectArchetypes(stats: NormalizedBootsStats): RingArchetype[] {
  const tags = new Set<RingArchetype>();

  if ((stats.magicFind ?? 0) >= 15) {
    tags.add("MF");
  }

  if ((stats.fasterRunWalk ?? 0) >= 30 || (stats.lightningResist ?? 0) >= 25 || (stats.allResist ?? 0) >= 8) {
    tags.add("PvM");
  }

  if ((stats.fasterRunWalk ?? 0) >= 30 && (stats.fasterHitRecovery ?? 0) >= 10) {
    tags.add("PvP");
  }

  if ((stats.strength ?? 0) >= 10 || (stats.dexterity ?? 0) >= 10) {
    tags.add("niche");
  }

  if (tags.size === 0) {
    tags.add("niche");
  }

  return Array.from(tags);
}

function synergyScore(stats: NormalizedBootsStats, tags: Set<RingArchetype>, highlights: string[]) {
  let score = 0;

  for (const synergy of bootsSynergies) {
    if (synergy.check(stats as Record<string, number | undefined>)) {
      score += synergy.score;
      synergy.archetypes.forEach((tag) => tags.add(tag));
      highlights.push(synergy.label);
    }
  }

  return score;
}

function awkwardPenalty(stats: NormalizedBootsStats, highlights: string[]) {
  let penalty = 0;
  const resistHits = [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0, stats.poisonResist ?? 0].filter((value) => value >= 20).length;
  const hasAnchor = (stats.fasterRunWalk ?? 0) >= 20 || resistHits >= 2 || (stats.magicFind ?? 0) >= 15;

  if (Object.keys(stats).length >= 4 && !hasAnchor) {
    penalty += 2;
    highlights.push("scattered stats without a strong boot pattern");
  }

  return penalty;
}

function liquidityFrom(score: number, mode: BootsCheckInput["mode"], tags: RingArchetype[], highlights: string[]): Liquidity {
  if (highlights.includes("tri-res utility boots")) return mode === "SCNL" ? "Medium" : "High";
  if (highlights.includes("FRW with strong resist support")) return "High";
  if (highlights.includes("FRW with magic find")) return "High";
  if (highlights.includes("FRW, FHR, and resist support")) return "High";

  let liquidityScore = score + bootsModeAdjustments[mode].liquidityBias;

  if (tags.includes("MF")) liquidityScore += 1;
  if (tags.includes("niche") && !tags.includes("PvM")) liquidityScore -= 1;

  if (liquidityScore <= 5) return "Low";
  if (liquidityScore <= 11) return "Medium";
  return "High";
}

function summaryFor(stats: NormalizedBootsStats) {
  const parts: string[] = [];
  if (stats.fasterRunWalk) parts.push(`${stats.fasterRunWalk} FRW`);
  if (stats.fasterHitRecovery) parts.push(`${stats.fasterHitRecovery} FHR`);
  if (stats.magicFind) parts.push(`${stats.magicFind} MF`);
  if (stats.allResist) parts.push(`${stats.allResist} all resist`);
  if (!stats.allResist && stats.lightningResist) parts.push(`${stats.lightningResist} lightning resist`);
  if (stats.strength) parts.push(`${stats.strength} strength`);
  return parts.slice(0, 3).join(", ");
}

function explanationFor(
  input: BootsCheckInput,
  verdict: Verdict,
  tags: RingArchetype[],
  highlights: string[],
  stats: NormalizedBootsStats
) {
  const summary = summaryFor(stats) || "some utility stats";
  const comboText = highlights.length > 0 ? highlights.slice(0, 2).join(" and ") : "the overall stat mix";

  if (verdict === "Ignore") {
    return `These boots have ${summary}, but they do not form a strong tradable pattern for ${input.mode}.`;
  }

  if (verdict === "Low Priority") {
    return `These boots show ${summary}, but the combination is still too thin for strong ${input.mode} demand.`;
  }

  if (verdict === "Check") {
    return `${summary} gives these boots some utility appeal. They are worth a second look because of ${comboText}.`;
  }

  if (verdict === "Keep") {
    return `${summary} makes these boots useful. ${comboText} gives them real self-use or selective trade appeal.`;
  }

  if (verdict === "List") {
    return `${summary} makes these boots clearly tradable. ${comboText} is a real marketable boot pattern.`;
  }

  return `${summary} makes these boots premium. ${comboText} pushes them into premium trade territory.`;
}

function recommendedActionFor(verdict: Verdict, highlights: string[]) {
  if (verdict === "Ignore") return "Ignore them unless you need temporary self-use boots.";
  if (verdict === "Low Priority") return "Only keep them if you want a progression filler or specific self-use utility.";
  if (verdict === "Check") return "Check the full boot mix more carefully before tossing them.";
  if (verdict === "Keep") return "Keep them. These boots are useful enough to stash or compare.";
  if (verdict === "List") {
    if (highlights.includes("FRW with magic find")) {
      return "Check market activity or list them. FRW + MF boots are broadly useful and easy to understand.";
    }
    return "List them or compare them against similar rare utility boots.";
  }
  return "Treat these as premium trade value and compare them against premium rare boot listings.";
}

export function evaluateBoots(input: BootsCheckInput): BootsCheckResult {
  const stats = normalizeStats(input);

  if (Object.keys(stats).length === 0) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No boot stats were entered yet, so there is nothing meaningful to evaluate.",
      recommendedAction: "Enter the visible boot mods to triage them.",
      qualityScore: 0,
      archetypeTags: ["niche"]
    };
  }

  let score = bootsModeAdjustments[input.mode].floorBonus;
  const tagSet = new Set<RingArchetype>(detectArchetypes(stats));
  const highlights: string[] = [];

  for (const [key, value] of Object.entries(stats)) {
    score += statScoreFor(key as keyof NormalizedBootsStats, value as number);
  }

  score += synergyScore(stats, tagSet, highlights);
  score -= awkwardPenalty(stats, highlights);

  if (input.mode === "SCNL" && score <= 9) {
    score -= 1;
  }

  if (input.mode === "SCL" && ((stats.fasterRunWalk ?? 0) >= 30 || (stats.lightningResist ?? 0) >= 25)) {
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
