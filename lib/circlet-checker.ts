import {
  CircletCheckInput,
  CircletCheckResult,
  CircletFamily,
  Liquidity,
  RingArchetype,
  Verdict
} from "@/lib/types";
import { clampNumericAffixValue } from "@/data/affix-guardrails";
import { circletClassSkillDemand, circletFamilies, circletQualityNotes, circletTreeSkillDemand } from "@/data/circlet-rules";
import { sanitizeMechanicsInput } from "@/data/mechanics-affixes";

const familyMap = new Map(circletFamilies.map((entry) => [entry.family, entry]));

function getFamilyData(family: CircletFamily) {
  return familyMap.get(family) ?? circletFamilies[0];
}

function normalizeCircletInput(input: CircletCheckInput): CircletCheckInput {
  const stats = sanitizeMechanicsInput("circlet", input);

  return {
    mode: input.mode,
    family: input.family,
    quality: input.quality,
    skillMode: input.skillMode,
    classSkillType: stats.classSkillType,
    classSkillValue: stats.classSkillValue,
    skillTreeType: stats.skillTreeType,
    skillTreeValue: stats.skillTreeValue,
    fasterCastRate: typeof stats.fasterCastRate === "number" ? clampNumericAffixValue("fasterCastRate", stats.fasterCastRate) : undefined,
    fasterRunWalk: typeof stats.fasterRunWalk === "number" ? clampNumericAffixValue("fasterRunWalk", stats.fasterRunWalk) : undefined,
    sockets: stats.sockets,
    strength: typeof stats.strength === "number" ? clampNumericAffixValue("strength", stats.strength) : undefined,
    dexterity: typeof stats.dexterity === "number" ? clampNumericAffixValue("dexterity", stats.dexterity) : undefined,
    life: typeof stats.life === "number" ? clampNumericAffixValue("life", stats.life) : undefined,
    allResist: typeof stats.allResist === "number" ? clampNumericAffixValue("allResist", stats.allResist) : undefined,
    fireResist: typeof stats.fireResist === "number" ? clampNumericAffixValue("fireResist", stats.fireResist) : undefined,
    lightningResist: typeof stats.lightningResist === "number" ? clampNumericAffixValue("lightningResist", stats.lightningResist) : undefined
  };
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

function compactCircletIdentity(input: CircletCheckInput) {
  const skillLabel = getSkillLabel(input);
  const parts: string[] = [];

  if (skillLabel !== "No standout skill line") {
    parts.push(skillLabel);
  }

  if ((input.fasterCastRate ?? 0) >= 20) {
    parts.push("20 FCR");
  } else if ((input.fasterCastRate ?? 0) >= 10) {
    parts.push(`${input.fasterCastRate} FCR`);
  }

  if ((input.fasterRunWalk ?? 0) >= 20) {
    parts.push(`${input.fasterRunWalk} FRW`);
  }

  if ((input.sockets ?? 0) > 0) {
    parts.push(`${input.sockets}os`);
  }

  return parts.length > 0 ? parts.join(" / ") : "no standout core roll";
}

function compactCircletSupport(input: CircletCheckInput) {
  const support: string[] = [];

  if ((input.allResist ?? 0) >= 10) {
    support.push(`${input.allResist} all res`);
  } else if ((input.fireResist ?? 0) >= 25) {
    support.push(`${input.fireResist} fire res`);
  } else if ((input.lightningResist ?? 0) >= 25) {
    support.push(`${input.lightningResist} lightning res`);
  }

  if ((input.strength ?? 0) >= 15) {
    support.push(`${input.strength} strength`);
  }

  if ((input.dexterity ?? 0) >= 15) {
    support.push(`${input.dexterity} dex`);
  }

  if ((input.life ?? 0) >= 20) {
    support.push(`${input.life} life`);
  }

  return support.length > 0 ? `Support: ${support.slice(0, 3).join(", ")}.` : "Support is light.";
}

function scoreMagicCirclet(input: CircletCheckInput, details: string[], tags: Set<RingArchetype>) {
  let score = 0;

  if (input.skillMode === "tree" && input.skillTreeType && input.skillTreeValue) {
    const skillTreeType = input.skillTreeType;
    score += input.skillTreeValue === 3 ? 10 : input.skillTreeValue === 2 ? 5 : 1;
    score += circletTreeSkillDemand[skillTreeType];
    tags.add("caster");
    details.push(`${getSkillLabel(input)} is the classic magic circlet angle.`);
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
    details.push("20 FCR is the caster line people notice.");
  } else if ((input.fasterCastRate ?? 0) >= 10) {
    score += 2;
  }

  if ((input.fasterRunWalk ?? 0) >= 30) {
    score += 4;
    tags.add("PvP");
    details.push("30 FRW gives it PvP utility.");
  }

  if ((input.sockets ?? 0) >= 2) {
    score += (input.sockets ?? 0) >= 3 ? 8 : 6;
    tags.add("niche");
    details.push(`${input.sockets} sockets are the value here for magic circlet utility and PvP setups.`);
  } else if ((input.sockets ?? 0) === 1) {
    score += 2;
    details.push("One socket helps, but multi-socket magic circlets are the real target.");
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
    details.push("+3 tree with 20 FCR is the magic circlet jackpot.");
  }

  if ((input.sockets ?? 0) >= 2 && (input.fasterRunWalk ?? 0) >= 30) {
    score += (input.sockets ?? 0) >= 3 ? 6 : 5;
    details.push("Sockets plus FRW is a real specialty hit.");
  }

  if ((input.sockets ?? 0) >= 2 && (input.skillMode === "class" || input.skillMode === "tree")) {
    score -= 3;
    details.push("Skills plus sockets on the same magic circlet is usually suspect, so treat it carefully.");
  }

  if ((input.fasterCastRate ?? 0) >= 20 && (input.fasterRunWalk ?? 0) >= 30) {
    score -= 2;
    details.push("20 FCR with 30 FRW is unusually unlikely, so this is treated conservatively.");
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
  const hasSocketUtility = (input.sockets ?? 0) > 0;

  if (hasClassSkills) {
    const classSkillType = input.classSkillType;
    score += input.classSkillValue === 2 ? 5 : 2;
    if (classSkillType) {
      score += circletClassSkillDemand[classSkillType];
    }
    tags.add("caster");
    details.push(`${getSkillLabel(input)} is the main rare circlet line.`);
  }

  if (has20Fcr) {
    score += 4;
    tags.add("caster");
    details.push("20 FCR is the caster breakpoint people want.");
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
    details.push("+2 skills with 20 FCR is the core rare circlet hit.");
  }

  if ((input.classSkillValue ?? 0) >= 2 && has20Fcr && hasStrongSupport) {
    score += 6;
    details.push("Strong support makes it a real circlet.");
  }

  if ((input.fasterRunWalk ?? 0) >= 30 && ((input.allResist ?? 0) >= 15 || hasUsefulSingleRes(input))) {
    score += 4;
    details.push("FRW with resists gives it real utility.");
  }

  if (!has20Fcr && (input.classSkillValue ?? 0) >= 2 && !hasStrongSupport && !hasSocketUtility) {
    score -= 3;
    details.push("+2 skills alone is only a partial hit without FCR, sockets, or strong support.");
  }

  if (has20Fcr && !hasClassSkills && !hasStrongSupport && (input.fasterRunWalk ?? 0) < 30) {
    score -= 1;
    details.push("20 FCR helps, but needs support to be a clean winner.");
  }

  if ((input.sockets ?? 0) > 0) {
    score += 2;
    details.push("A socket matters most when paired with skills, FCR, or strong support.");
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

export function evaluateCirclet(rawInput: CircletCheckInput): CircletCheckResult {
  const input = normalizeCircletInput(rawInput);
  const family = getFamilyData(input.family);
  const details: string[] = [family.demandNote, circletQualityNotes[input.quality]];
  const tags = new Set<RingArchetype>();
  let score = family.familyBias;

  if (input.mode === "SCNL") {
    score -= 1;
    details.push("SCNL is stricter. Circlets need tighter rolls.");
  } else {
    score += 1;
    details.push("SCL is more forgiving for usable caster and utility circlets.");
  }

  score += input.quality === "Magic" ? scoreMagicCirclet(input, details, tags) : scoreRareCirclet(input, details, tags);

  const hasSkillLine =
    (input.skillMode === "class" && Boolean(input.classSkillType) && Boolean(input.classSkillValue)) ||
    (input.skillMode === "tree" && Boolean(input.skillTreeType) && Boolean(input.skillTreeValue));

  if (!hasSkillLine && score > 15) {
    score = 15;
    details.push("No +skills. Big support stats alone are capped below true jackpot circlet value.");
  }

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
      ? "Premium circlet hit. This should stand out immediately."
      : verdict === "List"
        ? "Good circlet. This is a real listing candidate."
        : verdict === "Keep"
          ? "Solid circlet, but not a jackpot."
          : verdict === "Check"
            ? "Partial hit. At least one useful line, but not a clean winner."
            : verdict === "Low Priority"
              ? "Some utility, but the combo is weak."
              : "No real circlet pattern here.";

  let recommendedAction = "Charsi unless you specifically collect niche circlets.";
  if (verdict === "Low Priority") {
    recommendedAction = "Only keep for a specific niche use case or self-use placeholder.";
  } else if (verdict === "Check") {
    recommendedAction = "Check it once before tossing. It is not clearly tradable yet.";
  } else if (verdict === "Keep") {
    recommendedAction = "Keep it if the archetype matters. Demand may be selective.";
  } else if (verdict === "List") {
    recommendedAction = "Check market activity or list it. This circlet has a real pattern.";
  } else if (verdict === "Premium") {
    recommendedAction = "Premium circlet. Compare it against strong examples before listing.";
  }

  const explanation = `${input.quality} ${input.family}: ${compactCircletIdentity(input)}. ${compactCircletSupport(input)} ${verdictSummary}`;

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
