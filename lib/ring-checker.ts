import { ringModeAdjustments, ringStatWeights, ringSynergies } from "@/data/ring-rules";
import {
  EvaluationPriority,
  Liquidity,
  RingArchetype,
  RingCheckInput,
  RingCheckResult,
  Verdict
} from "@/lib/types";

type StatKey = keyof Omit<RingCheckInput, "mode" | "levelRequirement"> | "levelRequirement";

type NormalizedRingStats = Omit<RingCheckInput, "mode">;

type RatedStat = {
  key: StatKey;
  value: number;
  score: number;
};

const numericKeys: StatKey[] = [
  "fasterCastRate",
  "strength",
  "dexterity",
  "life",
  "mana",
  "attackRating",
  "allResist",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "magicFind",
  "lifeLeech",
  "manaLeech",
  "minDamage",
  "maxDamage",
  "levelRequirement",
  "energy",
  "replenishLife",
  "extraGold"
];

const labelByKey: Record<StatKey, string> = {
  fasterCastRate: "FCR",
  strength: "strength",
  dexterity: "dexterity",
  life: "life",
  mana: "mana",
  attackRating: "attack rating",
  allResist: "all resist",
  fireResist: "fire resist",
  lightningResist: "lightning resist",
  coldResist: "cold resist",
  poisonResist: "poison resist",
  magicFind: "magic find",
  lifeLeech: "life leech",
  manaLeech: "mana leech",
  minDamage: "min damage",
  maxDamage: "max damage",
  levelRequirement: "level requirement",
  energy: "energy",
  replenishLife: "replenish life",
  extraGold: "extra gold"
};

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

function normalizeStats(input: RingCheckInput): NormalizedRingStats {
  const stats: NormalizedRingStats = {};

  for (const key of numericKeys) {
    const value = input[key];
    if (typeof value === "number" && !Number.isNaN(value) && value > 0) {
      stats[key] = value;
    }
  }

  return stats;
}

function statScoreFor(key: keyof NormalizedRingStats, value: number) {
  const rule = ringStatWeights.find((entry) => entry.key === key);
  if (!rule) {
    return 0;
  }

  const match = rule.thresholds.find((threshold) => value >= threshold.min);
  return match?.score ?? 0;
}

function detectArchetypes(stats: NormalizedRingStats): RingArchetype[] {
  const tags = new Set<RingArchetype>();

  if ((stats.fasterCastRate ?? 0) >= 10) {
    tags.add("caster");
  }

  if ((stats.lifeLeech ?? 0) >= 3 || (stats.manaLeech ?? 0) >= 3 || (stats.attackRating ?? 0) >= 60) {
    tags.add("melee");
  }

  if ((stats.magicFind ?? 0) >= 10) {
    tags.add("MF");
  }

  if ((stats.fasterCastRate ?? 0) >= 10 && (stats.dexterity ?? 0) >= 8) {
    tags.add("PvP");
  }

  if ((stats.life ?? 0) >= 20 || (stats.allResist ?? 0) >= 5 || (stats.lightningResist ?? 0) >= 20) {
    tags.add("PvM");
  }

  if (tags.size === 0 || ((stats.magicFind ?? 0) >= 10 && (stats.poisonResist ?? 0) >= 15)) {
    tags.add("niche");
  }

  return Array.from(tags);
}

function synergyScore(stats: NormalizedRingStats, tags: Set<RingArchetype>, highlights: string[]) {
  let score = 0;

  for (const synergy of ringSynergies) {
    if (synergy.check(stats as Record<string, number | undefined>)) {
      score += synergy.score;
      synergy.archetypes.forEach((tag) => tags.add(tag));
      highlights.push(synergy.label);
    }
  }

  return score;
}

function awkwardComboPenalty(stats: NormalizedRingStats, tags: RingArchetype[], highlights: string[]) {
  let penalty = 0;

  const hasCasterAnchor = (stats.fasterCastRate ?? 0) >= 10;
  const hasMeleeAnchor =
    (stats.lifeLeech ?? 0) >= 3 || (stats.manaLeech ?? 0) >= 3 || (stats.attackRating ?? 0) >= 60;
  const hasMostlyScatteredStats =
    Object.keys(stats).length >= 4 &&
    !hasCasterAnchor &&
    !hasMeleeAnchor &&
    (stats.allResist ?? 0) < 5 &&
    (stats.magicFind ?? 0) < 10;

  if (hasMostlyScatteredStats) {
    penalty += 2;
    highlights.push("scattered stats without a strong anchor");
  }

  if (tags.includes("caster") && tags.includes("melee") && !hasCasterAnchor) {
    penalty += 1;
  }

  if ((stats.levelRequirement ?? 0) >= 51) {
    penalty += 1;
    highlights.push("elevated level requirement");
  }

  if ((stats.levelRequirement ?? 0) >= 71) {
    penalty += 2;
  }

  return penalty;
}

function ratedStats(stats: NormalizedRingStats): RatedStat[] {
  return Object.entries(stats)
    .filter(([key]) => key !== "levelRequirement")
    .map(([key, value]) => ({
      key: key as StatKey,
      value: value as number,
      score: statScoreFor(key as keyof NormalizedRingStats, value as number)
    }))
    .filter((entry) => entry.score > 0);
}

function topStats(stats: NormalizedRingStats) {
  return ratedStats(stats)
    .sort((left, right) => right.score - left.score || right.value - left.value)
    .slice(0, 4);
}

function rollPackageAdjustment(
  stats: NormalizedRingStats,
  rated: RatedStat[],
  tags: RingArchetype[],
  highlights: string[]
) {
  const highCount = rated.filter((entry) => entry.score >= 4).length;
  const mediumCount = rated.filter((entry) => entry.score >= 2).length;
  const lowCount = rated.filter((entry) => entry.score === 1).length;
  const hasCasterAnchor = (stats.fasterCastRate ?? 0) >= 10;
  const hasMeleeAnchor =
    (stats.lifeLeech ?? 0) >= 4 || (stats.manaLeech ?? 0) >= 4 || (stats.attackRating ?? 0) >= 60;
  const hasRealResSupport = (stats.allResist ?? 0) >= 7 || (stats.lightningResist ?? 0) >= 20;
  const hasPremiumCasterShell =
    hasCasterAnchor && ((stats.strength ?? 0) >= 10 || (stats.dexterity ?? 0) >= 10) && hasRealResSupport;
  const hasPremiumMeleeShell =
    ((stats.lifeLeech ?? 0) >= 4 || (stats.manaLeech ?? 0) >= 4) &&
    (stats.attackRating ?? 0) >= 60 &&
    (((stats.strength ?? 0) >= 8 && (stats.dexterity ?? 0) >= 8) || (stats.maxDamage ?? 0) >= 5);

  if (hasPremiumCasterShell || hasPremiumMeleeShell) {
    highlights.push("coherent premium shell");
    return 2;
  }

  if (highCount >= 3) {
    highlights.push("multiple high-impact rolls");
    return 2;
  }

  if (highCount >= 2 && mediumCount >= 3) {
    highlights.push("strong overall stat package");
    return 1;
  }

  if (highCount === 0 && mediumCount <= 1 && lowCount >= 2) {
    highlights.push("mostly filler-level stats");
    return -2;
  }

  if (highCount === 0 && mediumCount > 0 && lowCount > 0 && !hasCasterAnchor && !hasMeleeAnchor) {
    highlights.push("mixed utility without a strong anchor");
    return -1;
  }

  if (tags.includes("caster") && !hasCasterAnchor) {
    return -1;
  }

  return 0;
}

function liquidityFrom(score: number, mode: RingCheckInput["mode"], tags: RingArchetype[]): Liquidity {
  let liquidityScore = score + ringModeAdjustments[mode].liquidityBias;

  if (tags.includes("caster")) {
    liquidityScore += 2;
  }

  if (tags.includes("MF")) {
    liquidityScore -= 1;
  }

  if (tags.includes("niche") && !tags.includes("caster") && !tags.includes("melee")) {
    liquidityScore -= 1;
  }

  if (liquidityScore <= 5) return "Low";
  if (liquidityScore <= 11) return "Medium";
  return "High";
}

function explanationFor(
  input: RingCheckInput,
  verdict: Verdict,
  tags: RingArchetype[],
  highlights: string[],
  topRated: Array<{ key: StatKey; value: number }>,
  rated: RatedStat[]
) {
  const leadTag = tags[0] ?? "niche";
  const summaryBits = topRated.slice(0, 3).map((entry) => `${entry.value} ${labelByKey[entry.key]}`);
  const summaryText = summaryBits.length > 0 ? summaryBits.join(", ") : "very little usable value";
  const comboText =
    highlights.length > 0 ? highlights.slice(0, 2).join(" and ") : "the overall stat mix";
  const highCount = rated.filter((entry) => entry.score >= 4).length;
  const lowOnly = rated.length > 0 && rated.every((entry) => entry.score <= 1);

  if (verdict === "Ignore") {
    return `This ring has ${summaryText}, but the combination is too weak for meaningful ${input.mode} demand.`;
  }

  if (verdict === "Low Priority") {
    return `This looks like a ${leadTag} ring with ${summaryText}, but the synergy is too thin for strong ${input.mode} demand.`;
  }

  if (verdict === "Check") {
    return `${summaryText} gives this ring some ${leadTag} appeal, but it still reads more like a partial hit than a clean winner. ${comboText} is the main reason to check it more closely.`;
  }

  if (verdict === "Keep") {
    return `${summaryText} makes this a practical ${leadTag} ring. The combination of ${comboText} gives it real use value, even if it stops short of premium trade territory.`;
  }

  if (verdict === "List") {
    return `${summaryText} makes this a real ${leadTag} ring worth listing. ${comboText} gives it a strong, marketable profile.`;
  }

  if (highCount >= 2 && !lowOnly) {
    return `${summaryText} makes this a premium ${leadTag} ring. ${comboText} pushes it into premium trade territory.`;
  }

  return `${summaryText} makes this a premium ${leadTag} ring, but it is still worth checking carefully because the value depends on how the full stat mix comes together.`;
}

function recommendedActionFor(verdict: Verdict, mode: RingCheckInput["mode"]) {
  if (verdict === "Ignore") {
    return "Ignore it unless you need a temporary self-use ring.";
  }

  if (verdict === "Low Priority") {
    return "Only keep it if you want a stopgap ring for progression.";
  }

  if (verdict === "Check") {
    return "Check the full mod mix carefully before tossing it. The ring has enough going on to merit a second pass.";
  }

  if (verdict === "Keep") {
    return `Keep it. This is good enough to stash and compare against other ${mode} utility rings.`;
  }

  if (verdict === "List") {
    return "List it or price-check it against comparable rare rings.";
  }

  return "Treat this as premium trade value and prepare to list it.";
}

export function evaluateRing(input: RingCheckInput): RingCheckResult {
  const stats = normalizeStats(input);
  const presentStats = Object.keys(stats).filter((key) => key !== "levelRequirement").length;

  if (presentStats === 0) {
    return {
      verdict: "Ignore",
      priority: "Trash",
      liquidity: "Low",
      explanation: "No ring stats were entered yet, so there is nothing meaningful to evaluate.",
      recommendedAction: "Enter the visible mods to triage the ring.",
      qualityScore: 0,
      archetypeTags: ["niche"]
    };
  }

  let score = ringModeAdjustments[input.mode].floorBonus;
  const tagSet = new Set<RingArchetype>(detectArchetypes(stats));
  const highlights: string[] = [];

  for (const [key, value] of Object.entries(stats)) {
    if (key === "levelRequirement") {
      continue;
    }
    score += statScoreFor(key as keyof NormalizedRingStats, value as number);
  }

  score += synergyScore(stats, tagSet, highlights);
  const archetypeTags = Array.from(tagSet);
  score -= awkwardComboPenalty(stats, archetypeTags, highlights);
  const rated = ratedStats(stats);
  score += rollPackageAdjustment(stats, rated, archetypeTags, highlights);

  if (input.mode === "SCNL" && score <= 8) {
    score -= 1;
  }

  if (input.mode === "SCL" && ((stats.fasterCastRate ?? 0) >= 10 || (stats.allResist ?? 0) >= 7)) {
    score += 1;
  }

  const verdict = verdictFromScore(score);
  const topRated = topStats(stats);
  const explanation = explanationFor(input, verdict, archetypeTags, highlights, topRated, rated);

  return {
    verdict,
    priority: priorityFromVerdict(verdict),
    liquidity: liquidityFrom(score, input.mode, archetypeTags),
    explanation,
    recommendedAction: recommendedActionFor(verdict, input.mode),
    qualityScore: Math.max(0, score),
    archetypeTags
  };
}
