import { EvaluationPriority, Verdict } from "@/lib/types";

export type DecisionLabel = "Keep" | "Conditional" | "Drop";

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
  const isSocketDependent = includesAny(text, [
    "socket-dependent",
    "socket potential",
    "socket it",
    "socket path",
    "right socket",
    "correct sockets",
    "needs 1 socket",
    "needs 2 sockets",
    "needs 3 sockets",
    "needs 4 sockets",
    "needs 5 sockets",
    "needs 6 sockets"
  ]);
  const isSelfUse = includesAny(text, ["self-use", "personal placeholder", "temporary", "specific buyer", "specific use case"]);
  const isNoRollStapleUnique = includesAny(text, ["is a staple unique"]);

  if (input.priority === "Trash" || input.verdict === "Ignore") {
    return {
      label: "Drop",
      actionLine: "Drop it.",
      caveat: isSelfUse ? "Self-use does not always trade." : undefined
    };
  }

  if (input.priority === "Premium Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep it.",
        caveat: "No-roll staple. The drop itself is the value."
      };
    }

    return {
      label: "Keep",
      actionLine: "Keep it.",
      caveat: "Compare before you list or mule it."
    };
  }

  if (input.priority === "High Trade Value") {
    if (isNoRollStapleUnique) {
      return {
        label: "Keep",
        actionLine: "Keep it.",
        caveat: isSocketDependent ? "Sockets are the reason it matters." : undefined
      };
    }

    return {
      label: "Keep",
      actionLine: "Keep it.",
      caveat: isSocketDependent ? "Sockets are the reason it matters." : undefined
    };
  }

  if (input.priority === "Moderate Trade Value") {
    return {
      label: "Conditional",
      actionLine: "Compare or keep for use.",
      caveat: isSelfUse ? "Niche or self-use." : undefined
    };
  }

  return {
    label: isSocketDependent || isSelfUse ? "Conditional" : "Drop",
    actionLine: isSocketDependent
      ? "Compare or keep for use."
      : "Drop it.",
    caveat: isSelfUse ? "Mostly self-use." : undefined
  };
}
