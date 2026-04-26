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

  return (
    <Card className="h-fit">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Result</p>
      {hasInput ? (
        <>
          <div className={`mt-3 rounded-2xl border p-4 ${VERDICT_STYLES[result.verdict]}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Decision</p>
                <h3 className="mt-1 text-3xl font-black text-white">{decision.label}</h3>
                <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-zinc-100">{decision.actionLine}</p>
              </div>

              <div className="grid gap-2 sm:text-right">
                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Trade Value</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">{result.priority}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Demand</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">{result.liquidity}</p>
                </div>
                {typeof result.qualityScore === "number" ? (
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Score</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-50">{result.qualityScore}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">Recommended Action</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-white">{result.recommendedAction}</p>
              {decision.caveat ? <p className="mt-2 text-xs leading-5 text-zinc-300">{decision.caveat}</p> : null}
            </div>
          </div>

          {result.archetypeTags?.length ? (
            <div className="mt-3 rounded-xl border border-border bg-black/20 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Context</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.archetypeTags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-3 rounded-xl border border-border bg-black/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Why It Matters</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{result.explanation}</p>
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-black/20 px-4 py-8 text-sm leading-6 text-zinc-400">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}
