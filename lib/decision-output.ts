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
  const isMarketCheck = includesAny(text, ["check market", "list it", "worth checking", "commonly sought", "commonly traded", "easy to trade"]);
  const isNoRollStapleUnique = includesAny(text, ["is a staple unique"]);

  if (input.priority === "Trash" || input.verdict === "Ignore") {
    return {
      label: "Drop",
      actionLine: "Drop it unless you need it right now.",
      caveat: isSelfUse ? "Self-use does not always trade." : undefined
    };
  }

  if (input.priority === "Premium Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. Staple value.",
        caveat: "No-roll staple. The drop itself is the value."
      };
    }

    return {
      label: "Check Before Tossing",
      actionLine: "Check it before you toss it.",
      caveat: "Real hit. Compare before you list or mule it."
    };
  }

  if (input.priority === "High Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep this. Staple value.",
        caveat: isSocketDependent ? "Sockets are the reason it matters." : undefined
      };
    }

    return {
      label: isMarketCheck ? "Check Before Tossing" : "Keep",
      actionLine: isMarketCheck ? "Check it before you toss it." : "Keep it and compare later.",
      caveat: isSocketDependent ? "Sockets are the reason it matters." : undefined
    };
  }

  if (input.priority === "Moderate Trade Value") {
    return {
      label: isMarketCheck && !isSelfUse ? "Check Before Tossing" : "Conditional",
      actionLine:
        isMarketCheck && !isSelfUse
          ? "Check it before you toss it."
          : isSocketDependent
            ? "Keep only if you will socket or reroll it."
            : "Keep only if you will use it or compare it.",
      caveat: isSelfUse ? "Niche or self-use." : undefined
    };
  }

  return {
    label: isSocketDependent || isSelfUse ? "Conditional" : "Drop",
    actionLine: isSocketDependent
      ? "Keep only if you will finish the socket path."
      : "Usually drop it unless you need it.",
    caveat: isSelfUse ? "Mostly self-use." : undefined
  };
}
