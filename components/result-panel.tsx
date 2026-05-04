import { Card, Pill } from "@/components/ui";
import { TRADE_VALUE_STYLES } from "@/lib/constants";
import { EvaluationPriority, Liquidity, RingArchetype, Verdict } from "@/lib/types";

type ResultPanelResult = {
  verdict: Verdict;
  priority: EvaluationPriority;
  liquidity: Liquidity;
  explanation: string;
  recommendedAction: string;
  qualityScore?: number;
  archetypeTags?: RingArchetype[];
};

function displayContextTag(tag: RingArchetype, priority: EvaluationPriority) {
  if (tag !== "niche") {
    return tag;
  }

  if (priority === "Trash" || priority === "Low Trade Value") {
    return "Low demand";
  }

  if (priority === "Moderate Trade Value") {
    return "Situational";
  }

  return "Build-specific";
}

function tradeValueContext(priority: EvaluationPriority) {
  if (priority === "Premium Trade Value") {
    return "High demand, easy to trade";
  }

  if (priority === "High Trade Value") {
    return "Strong trade item";
  }

  if (priority === "Moderate Trade Value") {
    return "Mid-tier trade value";
  }

  if (priority === "Low Trade Value") {
    return "Low value, limited demand";
  }

  return "No trade value";
}

function tradeValueBadge(priority: EvaluationPriority) {
  if (priority === "Premium Trade Value") {
    return "Premium";
  }

  if (priority === "High Trade Value") {
    return "High";
  }

  if (priority === "Moderate Trade Value") {
    return "Moderate";
  }

  if (priority === "Low Trade Value") {
    return "Low";
  }

  return "Trash";
}

function recommendedAction(priority: EvaluationPriority, itemType?: "unique") {
  if (priority === "Premium Trade Value" || priority === "High Trade Value") {
    return "Keep it.";
  }

  if (priority === "Moderate Trade Value") {
    return "Keep or trade at a discount.";
  }

  if (priority === "Low Trade Value") {
    if (itemType === "unique") {
      return "Self-use or trade cheap.";
    }

    return "Only keep for self-use or a second look.";
  }

  return "Drop it.";
}

function stripPrefix(value: string) {
  if (value.startsWith("No FRW:")) {
    return value;
  }

  return value.replace(/^[^:]{1,48}:\s+/, "");
}

function displayExplanation(explanation: string) {
  const text = stripPrefix(explanation.replace(/\s+/g, " ").trim()).replace(/\.$/, "");
  const firstSentence = text.split(".")[0]?.trim() || text;

  return firstSentence.replace(/\bconditional\b/gi, "compare-only");
}

export function ResultPanel({
  result,
  hasInput = true,
  emptyMessage,
  itemType
}: {
  result: ResultPanelResult;
  hasInput?: boolean;
  emptyMessage?: string;
  itemType?: "unique";
}) {
  const isStrongResult = result.priority === "High Trade Value" || result.priority === "Premium Trade Value";

  return (
    <Card
      className={`h-fit ${
        isStrongResult
          ? "border-emerald-500/35 bg-gradient-to-br from-emerald-950/25 via-panel/95 to-black/30 shadow-[0_0_0_1px_rgba(16,185,129,0.16),0_18px_50px_rgba(0,0,0,0.5)]"
          : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Result</p>
      {hasInput ? (
        <>
          <div className={`mt-2 rounded-2xl border px-3.5 py-4 sm:px-4 ${TRADE_VALUE_STYLES[result.priority]}`}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-current/25 bg-black/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-current">
                {tradeValueBadge(result.priority)}
              </span>
              <span className="text-sm font-semibold leading-5 text-current/80">{tradeValueContext(result.priority)}</span>
            </div>

            <div className="my-4 border-t border-white/10" />

            <p className="text-lg font-black leading-6 text-white sm:text-xl">-&gt; {recommendedAction(result.priority, itemType)}</p>

            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-sm leading-5 text-current/75">{displayExplanation(result.explanation)}</p>
            </div>
          </div>

          {result.archetypeTags?.length ? (
            <div className="mt-2.5 rounded-xl border border-border bg-black/10 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.archetypeTags.map((tag) => (
                  <Pill key={tag}>{displayContextTag(tag, result.priority)}</Pill>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-2 rounded-2xl border border-dashed border-border bg-black/20 px-4 py-6 text-sm leading-6 text-zinc-400">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}
