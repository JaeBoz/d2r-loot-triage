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
      caveat: isSelfUse ? "Useful for you does not always mean tradable." : undefined
    };
  }

  if (input.priority === "Premium Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. It has clear value or staple demand.",
        caveat: "No-roll staples are keeps. The drop itself is the value."
      };
    }

    return {
      label: "Check Before Tossing",
      actionLine: "Do not drop this blindly. Compare or review it before tossing.",
      caveat: "Premium hits deserve a real look before listing or muling."
    };
  }

  if (input.priority === "High Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. It has clear value or staple demand.",
        caveat: isSocketDependent ? "Make sure the sockets are the reason it matters." : undefined
      };
    }

    return {
      label: isMarketCheck ? "Check Before Tossing" : "Keep",
      actionLine: isMarketCheck ? "Do not drop this blindly. Compare or review it before tossing." : "Keep it for trade or comparison.",
      caveat: isSocketDependent ? "Make sure the sockets are the reason it matters." : undefined
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
      caveat: isSelfUse ? "Likely niche or self-use, not an easy trade." : undefined
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
