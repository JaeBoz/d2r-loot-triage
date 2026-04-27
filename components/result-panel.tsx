import { Card, Pill } from "@/components/ui";
import { VERDICT_STYLES } from "@/lib/constants";
import { mapDecisionOutput } from "@/lib/decision-output";
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

export function ResultPanel({
  result,
  hasInput = true,
  emptyMessage
}: {
  result: ResultPanelResult;
  hasInput?: boolean;
  emptyMessage?: string;
}) {
  const decision = mapDecisionOutput(result);
  const isStrongResult = result.priority === "High Trade Value" || result.priority === "Premium Trade Value";

  return (
    <Card
      className={`h-fit ${
        isStrongResult
          ? "border-amber-500/35 bg-gradient-to-br from-amber-950/30 via-panel/95 to-black/30 shadow-[0_0_0_1px_rgba(245,158,11,0.18),0_18px_50px_rgba(0,0,0,0.5)]"
          : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Result</p>
      {hasInput ? (
        <>
          <div className={`mt-2 rounded-2xl border p-3 sm:p-4 ${VERDICT_STYLES[result.verdict]}`}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-current/80">Decision</p>
                <h3 className="mt-1 text-3xl font-black leading-none text-white sm:text-4xl">{decision.label}</h3>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-5 text-zinc-100">{decision.actionLine}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-300">Trade Value</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-50">{result.priority}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-300">Demand</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-50">{result.liquidity}</p>
                </div>
                {typeof result.qualityScore === "number" ? (
                  <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-300">Score</p>
                    <p className="mt-0.5 text-sm font-semibold text-zinc-50">{result.qualityScore}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">Recommended Action</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-white">{result.recommendedAction}</p>
              {decision.caveat ? <p className="mt-1.5 text-xs leading-5 text-zinc-300">{decision.caveat}</p> : null}
            </div>
          </div>

          {result.archetypeTags?.length ? (
            <div className="mt-2.5 rounded-xl border border-border bg-black/20 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Context</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.archetypeTags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-2.5 rounded-xl border border-border bg-black/20 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Why It Matters</p>
            <p className="mt-1.5 text-sm leading-5 text-zinc-300">{result.explanation}</p>
          </div>
        </>
      ) : (
        <div className="mt-2 rounded-2xl border border-dashed border-border bg-black/20 px-4 py-6 text-sm leading-6 text-zinc-400">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}
