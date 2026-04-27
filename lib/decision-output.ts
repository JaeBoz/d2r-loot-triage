import { EvaluationPriority, Verdict } from "@/lib/types";

export type DecisionLabel = "Keep" | "Check Before Tossing" | "Conditional" | "Drop";

export type DecisionOutput = {
  label: DecisionLabel;
  actionLine: string;
  caveat?: string;
};

export type DecisionInput = {
  verdict: Verdict;
  priority: EvaluationPriority;
  recommendedAction: string;
  explanation: string;
};

function includesAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

export function mapDecisionOutput(input: DecisionInput): DecisionOutput {
  const text = `${input.recommendedAction} ${input.explanation}`.toLowerCase();
  const isSocketDependent = includesAny(text, ["socket-dependent", "socket it", "socket path", "right socket", "correct sockets"]);
  const isSelfUse = includesAny(text, ["self-use", "personal placeholder", "temporary", "specific buyer", "specific use case"]);
  const isMarketCheck = includesAny(text, ["check market", "list it", "commonly sought", "commonly traded", "easy to trade"]);
  const isNoRollStapleUnique = includesAny(text, ["is a staple unique"]);

  if (input.priority === "Trash" || input.verdict === "Ignore") {
    return {
      label: "Drop",
      actionLine: "Drop it unless you need it for immediate self-use.",
      caveat: isSelfUse ? "Self-use is not the same as trade value." : undefined
    };
  }

  if (input.priority === "Premium Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. It has clear current value or strong staple demand.",
        caveat: "No-roll staple uniques should not be tossed quickly."
      };
    }

    return {
      label: "Check Before Tossing",
      actionLine: "Do not drop this blindly. Compare or review it before tossing.",
      caveat: "Premium outcomes should not be tossed quickly."
    };
  }

  if (input.priority === "High Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. It has clear current value or strong staple demand.",
        caveat: isSocketDependent ? "Make sure the current socket state is the reason it is valuable." : undefined
      };
    }

    return {
      label: isMarketCheck ? "Check Before Tossing" : "Keep",
      actionLine: isMarketCheck ? "Do not drop this blindly. Compare or review it before tossing." : "Keep it for trade or comparison.",
      caveat: isSocketDependent ? "Make sure the current socket state is the reason it is valuable." : undefined
    };
  }

  if (input.priority === "Moderate Trade Value") {
    return {
      label: isMarketCheck && !isSelfUse ? "Check Before Tossing" : "Conditional",
      actionLine:
        isMarketCheck && !isSelfUse
          ? "Do not drop this blindly. Compare or review it before tossing."
          : isSocketDependent
            ? "Keep only if you plan to socket, reroll, or re-check the final state."
            : "Keep only if the use case matters to you or the roll deserves a closer look.",
      caveat: isSelfUse ? "Likely selective demand rather than an easy trade." : undefined
    };
  }

  return {
    label: isSocketDependent || isSelfUse ? "Conditional" : "Drop",
    actionLine: isSocketDependent
      ? "Only keep if you plan to complete the socket or crafting path."
      : "Usually drop it unless you have a specific use case.",
    caveat: isSelfUse ? "Mostly self-use or niche demand." : undefined
  };
}
