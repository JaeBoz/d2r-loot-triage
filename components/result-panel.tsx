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
    return "Keep it";
  }

  if (priority === "Moderate Trade Value") {
    return "Keep or trade at a discount";
  }

  if (priority === "Low Trade Value") {
    if (itemType === "unique") {
      return "Self-use or trade cheap";
    }

    return "Only keep for self-use or a second look";
  }

  return "Drop it";
}

function stripPrefix(value: string) {
  if (value.startsWith("No FRW:")) {
    return value;
  }

  return value.replace(/^[^:]{1,48}:\s+/, "");
}

function displayExplanation(explanation: string) {
  const normalized = stripPrefix(explanation.replace(/\s+/g, " ").trim())
    .replace(/\bconditional\b/gi, "compare-only")
    .replace(/\bmagic find\b/gi, "MF")
    .replace(/\bfcr\b/gi, "FCR")
    .replace(/\bias\b/gi, "IAS")
    .replace(/\bfrw\b/gi, "FRW")
    .replace(/\bfhr\b/gi, "FHR")
    .replace(/\bed\b/gi, "ED")
    .replace(/\bar\b/gi, "AR")
    .replace(/\bcb\b/gi, "CB")
    .replace(/\bthis is\b/gi, "")
    .replace(/\bgood base, but\b/gi, "")
    .replace(/\bnot an easy trade as-is\b/gi, "")
    .trim();

  const firstSentence = normalized.split(".")[0]?.trim() || normalized;
  return firstSentence.replace(/[.;,\s]+$/, "");
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
  return (
    <Card className="h-fit">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Result</p>
      {hasInput ? (
        <>
          <div className={`mt-2 rounded-2xl border bg-black/15 px-4 py-4 ${TRADE_VALUE_STYLES[result.priority]}`}>
            <div>
              <div className="text-xl font-black uppercase leading-6 tracking-[0.08em] text-current sm:text-2xl">
                {tradeValueBadge(result.priority)}
              </div>
              <div className="mt-1 text-sm font-semibold leading-5 text-zinc-400">{tradeValueContext(result.priority)}</div>
            </div>

            <div className="mb-4 mt-5 h-px bg-white/10" />

            <div className="text-lg font-black leading-6 text-white sm:text-xl">{recommendedAction(result.priority, itemType)}</div>

            <div className="mt-2.5">
              <div className="text-sm leading-5 text-zinc-400">{displayExplanation(result.explanation)}</div>
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
