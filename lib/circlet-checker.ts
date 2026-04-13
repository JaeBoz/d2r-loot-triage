import {
  CircletCheckInput,
  CircletCheckResult,
  CircletFamily,
  Liquidity,
  RingArchetype,
  Verdict
} from "@/lib/types";
import { circletClassSkillDemand, circletFamilies, circletQualityNotes, circletTreeSkillDemand } from "@/data/circlet-rules";

const familyMap = new Map(circletFamilies.map((entry) => [entry.family, entry]));

function getFamilyData(family: CircletFamily) {
  return familyMap.get(family) ?? circletFamilies[0];
}

function verdictFromScore(score: number): Verdict {
  if (score <= 2) return "Ignore";
  if (score <= 6) return "Low Priority";
  if (score <= 11) return "Check";
  if (score <= 16) return "Keep";
  if (score <= 22) return "List";
  return "Premium";
}

function tradeValueFromVerdict(verdict: Verdict): CircletCheckResult["priority"] {
  if (verdict === "Ignore") return "Trash";
  if (verdict === "Low Priority") return "Low Trade Value";
  if (verdict === "Check" || verdict === "Keep") return "Moderate Trade Value";
  if (verdict === "List") return "High Trade Value";
  return "Premium Trade Value";
}

function hasUsefulSingleRes(input: CircletCheckInput) {
  return (input.fireResist ?? 0) >= 25 || (input.lightningResist ?? 0) >= 25;
}

function getSkillLabel(input: CircletCheckInput) {
  if (input.skillMode === "class" && input.classSkillType && input.classSkillValue) {
    return `+${input.classSkillValue} ${input.classSkillType}`;
  }

  if (input.skillMode === "tree" && input.skillTreeType && input.skillTreeValue) {
    return `+${input.skillTreeValue} ${input.skillTreeType}`;
  }

  return "No standout skill line";
}

function scoreMagicCirclet(input: CircletCheckInput, details: string[], tags: Set<RingArchetype>) {
  let score = 0;

  if (input.skillMode === "tree" && input.skillTreeType && input.skillTreeValue) {
    const skillTreeType = input.skillTreeType;
    score += input.skillTreeValue === 3 ? 10 : input.skillTreeValue === 2 ? 5 : 1;
    score += circletTreeSkillDemand[skillTreeType];
    tags.add("caster");
    details.push(`${getSkillLabel(input)} is one of the classic magic circlet value patterns.`);
  } else if (input.skillMode === "class" && input.classSkillType && input.classSkillValue) {
    const classSkillType = input.classSkillType;
    score += input.classSkillValue === 2 ? 7 : 3;
    score += circletClassSkillDemand[classSkillType];
    tags.add("caster");
    details.push(`${getSkillLabel(input)} gives it real magic circlet upside.`);
  }

  if ((input.fasterCastRate ?? 0) >= 20) {
    score += 6;
    tags.add("caster");
    details.push("20 FCR is a high-signal magic circlet roll.");
  } else if ((input.fasterCastRate ?? 0) >= 10) {
    score += 2;
  }

  if ((input.fasterRunWalk ?? 0) >= 30) {
    score += 4;
    tags.add("PvP");
    details.push("30 FRW adds real utility appeal.");
  }

  if ((input.sockets ?? 0) >= 2) {
    score += 6;
    tags.add("niche");
    details.push(`${input.sockets} sockets create real utility or PvP interest on magic circlets.`);
  } else if ((input.sockets ?? 0) === 1) {
    score += 2;
  }

  if ((input.allResist ?? 0) >= 20) {
    score += 3;
  }

  if ((input.life ?? 0) >= 40) {
    score += 3;
    tags.add("PvP");
  }

  if ((input.strength ?? 0) >= 15 || (input.dexterity ?? 0) >= 15) {
    score += 2;
  }

  if (input.skillMode === "tree" && (input.skillTreeValue ?? 0) >= 3 && (input.fasterCastRate ?? 0) >= 20) {
    score += 7;
    details.push("The +3 tree and 20 FCR combination is a true jackpot-style magic circlet outcome.");
  }

  if ((input.sockets ?? 0) >= 2 && (input.fasterRunWalk ?? 0) >= 30) {
    score += 5;
    details.push("Socket utility paired with FRW is a real specialty magic circlet hit.");
  }

  if ((input.sockets ?? 0) >= 2 && (input.skillMode === "class" || input.skillMode === "tree")) {
    score -= 3;
    details.push("Skills plus sockets on the same magic circlet is usually not a realistic hit, so trade confidence is reduced.");
  }

  if ((input.fasterCastRate ?? 0) >= 20 && (input.fasterRunWalk ?? 0) >= 30) {
    score -= 2;
    details.push("20 FCR and 30 FRW together on a magic circlet is unusually unlikely, so this result is treated conservatively.");
  }

  return score;
}

function scoreRareCirclet(input: CircletCheckInput, details: string[], tags: Set<RingArchetype>) {
  let score = 0;
  const hasClassSkills = input.skillMode === "class" && input.classSkillType && input.classSkillValue;
  const has20Fcr = (input.fasterCastRate ?? 0) >= 20;
  const hasStrongSupport =
    (input.allResist ?? 0) >= 15 ||
    (input.life ?? 0) >= 30 ||
    (input.strength ?? 0) >= 15 ||
    (input.dexterity ?? 0) >= 15;

  if (hasClassSkills) {
    const classSkillType = input.classSkillType;
    score += input.classSkillValue === 2 ? 7 : 2;
    if (classSkillType) {
      score += circletClassSkillDemand[classSkillType];
    }
    tags.add("caster");
    details.push(`${getSkillLabel(input)} is the main rare circlet value driver.`);
  }

  if (has20Fcr) {
    score += 4;
    tags.add("caster");
    details.push("20 FCR is the key caster breakpoint on rare circlets.");
  } else if ((input.fasterCastRate ?? 0) >= 10) {
    score += 1;
  }

  if ((input.fasterRunWalk ?? 0) >= 30) {
    score += 4;
    tags.add("PvP");
  } else if ((input.fasterRunWalk ?? 0) >= 20) {
    score += 2;
  }

  if ((input.allResist ?? 0) >= 20) {
    score += 5;
  } else if ((input.allResist ?? 0) >= 10) {
    score += 2;
  }

  if (hasUsefulSingleRes(input)) {
    score += 2;
  }

  if ((input.life ?? 0) >= 40) {
    score += 4;
    tags.add("PvP");
  } else if ((input.life ?? 0) >= 20) {
    score += 2;
  }

  if ((input.strength ?? 0) >= 15) {
    score += 3;
  }

  if ((input.dexterity ?? 0) >= 15) {
    score += 3;
  }

  if ((input.classSkillValue ?? 0) >= 2 && has20Fcr) {
    score += 10;
    details.push("+2 skills with 20 FCR is the core rare circlet jackpot pattern.");
  }

  if ((input.classSkillValue ?? 0) >= 2 && has20Fcr && hasStrongSupport) {
    score += 6;
    details.push("Strong secondary support pushes it into clearly tradable rare circlet territory.");
  }

  if ((input.fasterRunWalk ?? 0) >= 30 && ((input.allResist ?? 0) >= 15 || hasUsefulSingleRes(input))) {
    score += 4;
    details.push("FRW with solid resist support gives it real utility appeal.");
  }

  if (!has20Fcr && (input.classSkillValue ?? 0) >= 2 && !hasStrongSupport) {
    score -= 1;
    details.push("Without FCR or strong secondary support, this is more of a partial rare circlet hit than a finished jackpot.");
  }

  if (has20Fcr && !hasClassSkills && !hasStrongSupport && (input.fasterRunWalk ?? 0) < 30) {
    score -= 1;
    details.push("Standalone 20 FCR helps, but it usually needs stronger support to become clearly tradable.");
  }

  if ((input.sockets ?? 0) > 0) {
    score -= 3;
    details.push("Socket rolls are not part of rare circlet drops, so socket input is treated conservatively.");
  }

  return score;
}

function liquidityFor(input: CircletCheckInput, verdict: Verdict, tags: Set<RingArchetype>) {
  if (verdict === "Ignore" || verdict === "Low Priority") {
    return "Low" as Liquidity;
  }

  if (input.quality === "Magic" && input.skillMode === "tree" && (input.skillTreeValue ?? 0) >= 3 && (input.fasterCastRate ?? 0) >= 20) {
    return "High";
  }

  if (input.quality === "Rare" && (input.classSkillValue ?? 0) >= 2 && (input.fasterCastRate ?? 0) >= 20) {
    return input.mode === "SCNL" && !((input.allResist ?? 0) >= 15 || (input.life ?? 0) >= 30 || (input.strength ?? 0) >= 15 || (input.dexterity ?? 0) >= 15)
      ? "Medium"
      : "High";
  }

  if (tags.has("PvP") || tags.has("niche")) {
    return input.mode === "SCNL" ? "Medium" : "High";
  }

  return verdict === "List" || verdict === "Premium" ? "High" : "Medium";
}

export function evaluateCirclet(input: CircletCheckInput): CircletCheckResult {
  const family = getFamilyData(input.family);
  const details: string[] = [family.demandNote, circletQualityNotes[input.quality]];
  const tags = new Set<RingArchetype>();
  let score = family.familyBias;

  if (input.mode === "SCNL") {
    score -= 1;
    details.push("SCNL is more selective, so circlets usually need tighter rolls to feel tradable.");
  } else {
    score += 1;
    details.push("SCL is a bit more forgiving for usable caster and utility circlets.");
  }

  score += input.quality === "Magic" ? scoreMagicCirclet(input, details, tags) : scoreRareCirclet(input, details, tags);

  if (score <= 4 && !tags.size) {
    tags.add("niche");
  } else if (!tags.size) {
    tags.add("PvM");
  }

  const verdict = verdictFromScore(score);
  const priority = tradeValueFromVerdict(verdict);
  const liquidity = liquidityFor(input, verdict, tags);
  const verdictSummary =
    verdict === "Premium"
      ? "This is a premium circlet pattern that should stand out immediately during farming."
      : verdict === "List"
        ? "This is a clearly tradable circlet pattern rather than a marginal utility piece."
        : verdict === "Keep"
          ? "There is real value here, but the roll stops short of a true jackpot."
          : verdict === "Check"
            ? "There is at least one useful line here, but it reads more like a partial hit than a clean trade winner."
            : verdict === "Low Priority"
              ? "Some utility is present, but the combination is weak for real circlet trade demand."
              : "This does not match a meaningful high-signal circlet pattern.";

  let recommendedAction = "Ignore unless you specifically collect niche circlets.";
  if (verdict === "Low Priority") {
    recommendedAction = "Only keep if you see a specific niche use case or want a self-use placeholder.";
  } else if (verdict === "Check") {
    recommendedAction = "Check it more carefully. There may be a useful circlet pattern here, but it is not clearly tradable yet.";
  } else if (verdict === "Keep") {
    recommendedAction = "Keep it if you use this archetype. Trade value exists, but it may be selective.";
  } else if (verdict === "List") {
    recommendedAction = "Check market activity or list it. This circlet has a real tradable pattern.";
  } else if (verdict === "Premium") {
    recommendedAction = "Treat this as a premium circlet hit and compare it against strong market examples.";
  }

  const explanation = `${input.family} ${input.quality.toLowerCase()} circlet: ${details.join(" ")} ${verdictSummary}`;

  return {
    verdict,
    priority,
    liquidity,
    explanation,
    recommendedAction,
    qualityScore: Math.max(0, score),
    archetypeTags: Array.from(tags)
  };
}
