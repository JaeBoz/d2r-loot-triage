import { bootsModeAdjustments, bootsStatWeights, bootsSynergies } from "@/data/boots-rules";
import { isValidMechanicsAffix } from "@/data/mechanics-affixes";
import { BootsCheckInput, BootsCheckResult, EvaluationPriority, Liquidity, RingArchetype, Verdict } from "@/lib/types";

type StatKey = keyof Omit<BootsCheckInput, "mode">;
type NormalizedBootsStats = Omit<BootsCheckInput, "mode">;

type RatedStat = {
  key: StatKey;
  value: number;
  score: number;
};

const numericKeys: StatKey[] = [
  "fasterRunWalk",
  "fasterHitRecovery",
  "magicFind",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "strength",
  "dexterity",
  "life",
  "mana",
  "manaRegen",
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
    if (!isValidMechanicsAffix("boots", key)) {
      continue;
    }

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

  if ((stats.fasterRunWalk ?? 0) >= 30 || (stats.lightningResist ?? 0) >= 25) {
    tags.add("PvM");
  }

  if ((stats.fasterRunWalk ?? 0) >= 30 && (stats.fasterHitRecovery ?? 0) >= 10) {
    tags.add("PvP");
  }

  if ((stats.strength ?? 0) >= 10 || (stats.dexterity ?? 0) >= 10) {
    tags.add("niche");
  }

  if ((stats.mana ?? 0) >= 20 || (stats.manaRegen ?? 0) >= 10) {
    tags.add("caster");
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
    highlights.push("scattered stats with no strong boot pattern");
  }

  return penalty;
}

function ratedStats(stats: NormalizedBootsStats): RatedStat[] {
  return Object.entries(stats)
    .map(([key, value]) => ({
      key: key as StatKey,
      value: value as number,
      score: statScoreFor(key as keyof NormalizedBootsStats, value as number)
    }))
    .filter((entry) => entry.score > 0);
}

function rollPackageAdjustment(stats: NormalizedBootsStats, rated: RatedStat[], highlights: string[]) {
  const highCount = rated.filter((entry) => entry.score >= 4).length;
  const mediumCount = rated.filter((entry) => entry.score >= 2).length;
  const lowCount = rated.filter((entry) => entry.score === 1).length;
  const resistHits = [stats.fireResist ?? 0, stats.lightningResist ?? 0, stats.coldResist ?? 0, stats.poisonResist ?? 0].filter(
    (value) => value >= 25
  ).length;
  const hasRealFrwAnchor = (stats.fasterRunWalk ?? 0) >= 30;
  const hasRealMfAnchor = (stats.magicFind ?? 0) >= 20;
  const hasRealResAnchor = resistHits >= 2;
  const hasPremiumShell =
    hasRealFrwAnchor &&
    (hasRealResAnchor || hasRealMfAnchor || ((stats.fasterHitRecovery ?? 0) >= 10 && (stats.lightningResist ?? 0) >= 25));

  if (hasPremiumShell) {
    highlights.push("premium boot shell");
    return 2;
  }

  if (highCount >= 3) {
    highlights.push("multiple strong utility rolls");
    return 2;
  }

  if (highCount >= 2 && mediumCount >= 3) {
    highlights.push("strong overall boot package");
    return 1;
  }

  if (highCount === 0 && mediumCount <= 1 && lowCount >= 2) {
    highlights.push("mostly filler stats");
    return -2;
  }

  if (!hasRealFrwAnchor && !hasRealResAnchor && !hasRealMfAnchor && mediumCount > 0 && lowCount > 0) {
    highlights.push("mixed stats with no strong boot pattern");
    return -1;
  }

  return 0;
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
  if (stats.lightningResist) parts.push(`${stats.lightningResist} lightning resist`);
  if (stats.mana) parts.push(`${stats.mana} mana`);
  if (stats.manaRegen) parts.push(`${stats.manaRegen}% mana regen`);
  if (stats.strength) parts.push(`${stats.strength} strength`);
  return parts.slice(0, 3).join(", ");
}

function displayHighlight(highlight: string) {
  const labelMap: Record<string, string> = {
    "tri-res utility boots": "tri-res utility",
    "FRW with strong resist support": "FRW + strong res",
    "FRW with magic find": "FRW + MF",
    "FRW, FHR, and resist support": "FRW/FHR/res",
    "stats with resist utility": "stats + res",
    "caster mana utility": "caster mana utility",
    "premium boot shell": "premium boot shell"
  };

  return labelMap[highlight] ?? highlight;
}

function comboTextFor(highlights: string[]) {
  const packageLabels = new Set(["premium boot shell", "multiple strong utility rolls", "strong overall boot package"]);
  const focusedHighlights = highlights.length > 1 ? highlights.filter((highlight) => !packageLabels.has(highlight)) : highlights;
  const displayHighlights = Array.from(new Set(focusedHighlights.map(displayHighlight)));
  return displayHighlights.length > 0 ? displayHighlights.slice(0, 2).join(" and ") : "the overall stat mix";
}

function explanationFor(
  input: BootsCheckInput,
  verdict: Verdict,
  tags: RingArchetype[],
  highlights: string[],
  stats: NormalizedBootsStats,
  rated: RatedStat[]
) {
  const summary = summaryFor(stats) || "some utility stats";
  const comboText = comboTextFor(highlights);
  const highCount = rated.filter((entry) => entry.score >= 4).length;
  const lowOnly = rated.length > 0 && rated.every((entry) => entry.score <= 1);

  if (verdict === "Ignore") {
    return `Charsi-level boots. ${summary} does not make a real ${input.mode} boot pattern.`;
  }

  if (verdict === "Low Priority") {
    return `Some useful lines, but not enough together. ${summary} is mostly self-use or niche.`;
  }

  if (verdict === "Check") {
    return `Decent partial hit. ${summary} is usable, but not a clean winner. Check because of ${comboText}.`;
  }

  if (verdict === "Keep") {
    return `Solid boots. ${summary}. ${comboText} is the reason to keep them.`;
  }

  if (verdict === "List") {
    return `Good boots. ${summary}. ${comboText} is the value here.`;
  }

  if (highCount >= 2 && !lowOnly) {
    return `Premium boots. ${summary}. ${comboText} is the hit.`;
  }

  return "Looks premium at a glance. Check the full boot mix before calling it a trophy.";
}

function recommendedActionFor(verdict: Verdict, highlights: string[]) {
  if (verdict === "Ignore") return "Charsi unless you need temporary self-use boots.";
  if (verdict === "Low Priority") return "Only keep them as a filler or specific self-use pair.";
  if (verdict === "Check") return "Check the full boot mix before tossing them.";
  if (verdict === "Keep") return "Keep them. Useful enough to stash or compare.";
  if (verdict === "List") {
    if (highlights.includes("FRW with magic find")) {
      return "Check market activity or list them. FRW + MF is easy to understand.";
    }
    return "List them or compare them against similar rare boots.";
  }
  return "Premium rare boots. Compare before listing.";
}

export function evaluateBoots(input: BootsCheckInput): BootsCheckResult {
  const stats = normalizeStats(input);

  if (Object.keys(stats).length === 0) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No boot stats entered yet.",
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
  const rated = ratedStats(stats);
  score += rollPackageAdjustment(stats, rated, highlights);

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
    explanation: explanationFor(input, verdict, archetypeTags, highlights, stats, rated),
    recommendedAction: recommendedActionFor(verdict, highlights),
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}
