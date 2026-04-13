"use client";

import { useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { VERDICT_STYLES } from "@/lib/constants";
import { charmSkillOptions, evaluateCharm } from "@/lib/charm-checker";
import { CharmCheckInput, CharmSize, GameMode } from "@/lib/types";

const numericFields: Array<{ key: keyof Omit<CharmCheckInput, "mode" | "size" | "skill">; label: string }> = [
  { key: "life", label: "Life" },
  { key: "mana", label: "Mana" },
  { key: "magicFind", label: "Magic Find" },
  { key: "allResist", label: "All Resist" },
  { key: "fireResist", label: "Fire Resist" },
  { key: "lightningResist", label: "Lightning Resist" },
  { key: "coldResist", label: "Cold Resist" },
  { key: "poisonResist", label: "Poison Resist" },
  { key: "fasterRunWalk", label: "FRW" },
  { key: "fasterHitRecovery", label: "FHR" },
  { key: "poisonDamage", label: "Poison Damage" },
  { key: "maxDamage", label: "Max Damage" },
  { key: "attackRating", label: "Attack Rating" }
];

type CharmFormState = {
  size: CharmSize;
  skill: string;
} & Record<keyof Omit<CharmCheckInput, "mode" | "size" | "skill">, string>;

const emptyForm: CharmFormState = {
  size: "Small Charm",
  skill: "",
  life: "",
  mana: "",
  magicFind: "",
  allResist: "",
  fireResist: "",
  lightningResist: "",
  coldResist: "",
  poisonResist: "",
  fasterRunWalk: "",
  fasterHitRecovery: "",
  poisonDamage: "",
  maxDamage: "",
  attackRating: ""
};

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function CharmChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<CharmFormState>(emptyForm);
  const hasInput =
    !!form.skill.trim() || Object.entries(form).some(([key, value]) => key !== "size" && key !== "skill" && value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateCharm({
        mode,
        size: form.size,
        skill: form.size === "Grand Charm" ? form.skill.trim() || undefined : undefined,
        life: toOptionalNumber(form.life),
        mana: toOptionalNumber(form.mana),
        magicFind: toOptionalNumber(form.magicFind),
        allResist: toOptionalNumber(form.allResist),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        coldResist: toOptionalNumber(form.coldResist),
        poisonResist: toOptionalNumber(form.poisonResist),
        fasterRunWalk: toOptionalNumber(form.fasterRunWalk),
        fasterHitRecovery: toOptionalNumber(form.fasterHitRecovery),
        poisonDamage: toOptionalNumber(form.poisonDamage),
        maxDamage: toOptionalNumber(form.maxDamage),
        attackRating: toOptionalNumber(form.attackRating)
      }),
    [form, mode]
  );

  const handleReset = () => {
    setForm(emptyForm);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Charm Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast pattern check for useful charms</h2>
          </div>
          <div className="flex items-center gap-2">
            <Pill active>{mode}</Pill>
            <button
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-zinc-300">
            Charm size
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={form.size}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  size: event.target.value as CharmSize,
                  skill: event.target.value === "Grand Charm" ? current.skill : ""
                }))
              }
            >
              <option value="Small Charm">Small Charm</option>
              <option value="Large Charm">Large Charm</option>
              <option value="Grand Charm">Grand Charm</option>
            </select>
          </label>

          {form.size === "Grand Charm" ? (
            <label className="grid gap-2 text-sm text-zinc-300">
              Skill
              <select
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                value={form.skill}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    skill: event.target.value
                  }))
                }
              >
                {charmSkillOptions.map((option) => (
                  <option key={option || "none"} value={option}>
                    {option || "None"}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-black/10 px-4 py-3 text-sm text-zinc-400">
              Skill input only applies to grand charms.
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {numericFields.map((field) => (
            <label key={field.key} className="grid gap-2 text-sm text-zinc-300">
              {field.label}
              <input
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Blank"
                value={form[field.key]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field.key]: event.target.value
                  }))
                }
                aria-label={field.label}
              />
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>Pattern-based triage</Pill>
          <Pill>SCNL and SCL aware</Pill>
          <Pill>Charm-size specific</Pill>
        </div>
      </Card>

      <Card className="h-fit">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Verdict</p>
        {hasInput ? (
          <>
            <div className={`mt-3 rounded-2xl border p-4 ${VERDICT_STYLES[result.verdict]}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">{result.verdict}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">Trade Value</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{result.priority}</h3>
                </div>
                <div className="grid gap-2 sm:text-right">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Liquidity</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-50">{result.liquidity}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Score</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-50">{result.qualityScore}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-black/20 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Archetypes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.archetypeTags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="rounded-xl border border-border bg-black/20 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Explanation</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{result.explanation}</p>
              </div>

              <div className="rounded-xl border border-border bg-black/20 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Recommended action</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{result.recommendedAction}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-black/20 px-4 py-8 text-sm leading-6 text-zinc-400">
            Pick a charm size and enter any visible stats to start triage. The panel stays clear until you begin a new check.
          </div>
        )}
      </Card>
    </div>
  );
}
