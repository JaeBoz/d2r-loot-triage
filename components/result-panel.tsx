import { Card, Pill } from "@/components/ui";
import { TRADE_VALUE_STYLES } from "@/lib/constants";
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
    return "Situational trade value";
  }

  if (priority === "Low Trade Value") {
    return "Hard to trade";
  }

  return "No trade value";
}

function stripPrefix(value: string) {
  if (value.startsWith("No FRW:")) {
    return value;
  }

  return value.replace(/^[^:]{1,48}:\s+/, "");
}

function displayExplanation(explanation: string) {
  let text = stripPrefix(explanation.replace(/\s+/g, " ").trim()).replace(/\.$/, "");

  text = text
    .replace(/^No FRW:\s*(.+?) is usually a drop$/i, "No FRW + $1 → weak boot value")
    .replace(/^No FRW:\s*(.+?) is mostly self-use$/i, "No FRW + $1 → low trade value")
    .replace(/^(.+?) is the value$/i, "$1 → trade value")
    .replace(/^(.+?) is the hit$/i, "$1 → premium value")
    .replace(/^(.+?) is the reason to keep (?:it|them)$/i, "$1 → keep signal")
    .replace(/^(.+?) is a premium circlet hit$/i, "$1 → premium value")
    .replace(/^(.+?) is a good circlet hit$/i, "$1 → trade value")
    .replace(/^(.+?) is a good circlet, not a jackpot$/i, "$1 → keep signal")
    .replace(/^(.+?) is a partial hit, not a clean winner$/i, "$1 → conditional value")
    .replace(/^(.+?) is a top poison SC roll, not filler$/i, "$1 → premium poison value")
    .replace(/^(.+?) is a skiller hit; the second mod pushes it higher$/i, "$1 → skiller value")
    .replace(/^(.+?) is a plain skiller; the tree decides how good it is$/i, "$1 → skiller value")
    .replace(/^(.+?) is the max small charm roll$/i, "$1 → max small charm roll")
    .replace(/^(.+?) is the pattern$/i, "$1 → charm value")
    .replace(/^(.+?) is the value signal$/i, "$1 → value signal")
    .replace(/^(.+?) is conditional$/i, "$1 → conditional value")
    .replace(/^(.+?) does not come together$/i, "$1 → weak mix")
    .replace(/^(.+?) is not enough$/i, "$1 → no trade value")
    .replace(/^(.+?) needs a cleaner combo$/i, "$1 → conditional value")
    .replace(/^(.+?) needs better support$/i, "$1 → conditional value")
    .replace(/^High FCR shell, but the class skill does not line up$/i, "FCR + mismatched skills → conditional value")
    .replace(/^High FCR shell, but the skill roll makes it niche$/i, "FCR + mismatched skills → low demand")
    .replace(/^High FCR, but mismatch:\s*(.+?) keeps it niche$/i, "FCR + mismatched skills → build-specific value")
    .replace(/^High FCR, but mismatch:\s*(.+?) is the value$/i, "FCR + mismatched skills → trade value")
    .replace(/^Good roll, but the full stat mix decides the value$/i, "Stat mix → value check")
    .replace(/^Good roll, but the full boot mix decides the value$/i, "Boot mix → value check")
    .replace(/^Good roll package;\s*.+$/i, "Good rolls → trade value")
    .replace(/^Good roll;\s*.+$/i, "Good roll → trade value")
    .replace(/^Low roll;\s*.+$/i, "Low roll → limited value")
    .replace(/^Decent, not a standout;\s*.+$/i, "Mid rolls → conditional value")
    .replace(/^Rolls matter here;\s*.+$/i, "Variable rolls → value check")
    .replace(/^Reign of the Warlock item with a good roll package$/i, "RotW good roll package → trade value")
    .replace(/^Reign of the Warlock item with a good roll$/i, "RotW good roll → trade value")
    .replace(/^(.+?) is a staple unique; the drop itself is the value.*$/i, "Staple unique → trade value")
    .replace(/^.+ is (?:a|an) (.+? base); .*socket-dependent.*$/i, "$1 + sockets → conditional value")
    .replace(/^.+ is (?:a|an) (.+? base); Sockets are the value here.*$/i, "Sockets + $1 → trade value")
    .replace(/^.+ is (?:a|an) (.+? base); .+$/i, "$1 → base value")
    .replace(/^Unknown .+$/i, "Missing local rule → no trade value")
    .replace(/^Wrong ruleset.+$/i, "Ruleset mismatch → no value here");

  return text.split(".")[0]?.trim() || text;
}

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
          ? "border-emerald-500/35 bg-gradient-to-br from-emerald-950/25 via-panel/95 to-black/30 shadow-[0_0_0_1px_rgba(16,185,129,0.16),0_18px_50px_rgba(0,0,0,0.5)]"
          : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Result</p>
      {hasInput ? (
        <>
          <div className={`mt-2 rounded-2xl border p-3 sm:p-4 ${TRADE_VALUE_STYLES[result.priority]}`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-current/80">Decision</p>
              <h3 className="mt-1 text-4xl font-black leading-none text-white sm:text-5xl">{decision.label}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-current/80">{result.priority}</p>
              <p className="mt-1 text-xs leading-5 text-current/70">{tradeValueContext(result.priority)}</p>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">Recommended Action</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-white">{decision.actionLine}</p>
            </div>
          </div>

          <div className="mt-2.5 rounded-xl border border-border bg-black/20 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Why It Matters</p>
            <p className="mt-1.5 text-sm leading-5 text-zinc-300">{displayExplanation(result.explanation)}</p>
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
