"use client";

import { useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { VERDICT_STYLES } from "@/lib/constants";
import { evaluateUnique, uniqueItems } from "@/lib/unique-checker";
import { GameMode, UniqueCheckInput, UniqueRollField } from "@/lib/types";

const fieldLabels: Record<UniqueRollField, string> = {
  magicFind: "Magic Find",
  damage: "Damage",
  dexterity: "Dexterity",
  attackRating: "Attack Rating",
  allResist: "All Resist",
  minusEnemyLightningResist: "-Enemy Lightning Res",
  lightningSkillDamage: "Lightning Damage",
  enhancedDamage: "Enhanced Damage",
  strength: "Strength",
  lifeLeech: "Life Leech",
  coldSkillDamage: "Cold Skill Damage",
  allSkills: "All Skills"
};

function getFieldLabel(field: UniqueRollField, selectedItem?: (typeof uniqueItems)[number]) {
  return selectedItem?.rollDefinitions?.find((definition) => definition.key === field)?.label ?? fieldLabels[field];
}

type UniqueFormState = Record<UniqueRollField, string>;

const emptyForm: UniqueFormState = {
  magicFind: "",
  damage: "",
  dexterity: "",
  attackRating: "",
  allResist: "",
  minusEnemyLightningResist: "",
  lightningSkillDamage: "",
  enhancedDamage: "",
  strength: "",
  lifeLeech: "",
  coldSkillDamage: "",
  allSkills: ""
};

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function UniqueChecker({ mode }: { mode: GameMode }) {
  const defaultItemId = uniqueItems[0]?.id ?? "";
  const [itemId, setItemId] = useState(defaultItemId);
  const [form, setForm] = useState<UniqueFormState>(emptyForm);

  const selectedItem = useMemo(() => uniqueItems.find((item) => item.id === itemId), [itemId]);
  const hasInput =
    itemId !== defaultItemId || Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateUnique({
        mode,
        itemId,
        magicFind: toOptionalNumber(form.magicFind),
        damage: toOptionalNumber(form.damage),
        dexterity: toOptionalNumber(form.dexterity),
        attackRating: toOptionalNumber(form.attackRating),
        allResist: toOptionalNumber(form.allResist),
        minusEnemyLightningResist: toOptionalNumber(form.minusEnemyLightningResist),
        lightningSkillDamage: toOptionalNumber(form.lightningSkillDamage),
        enhancedDamage: toOptionalNumber(form.enhancedDamage),
        strength: toOptionalNumber(form.strength),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        coldSkillDamage: toOptionalNumber(form.coldSkillDamage),
        allSkills: toOptionalNumber(form.allSkills)
      }),
    [form, itemId, mode]
  );

  const handleReset = () => {
    setItemId(defaultItemId);
    setForm(emptyForm);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Unique Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Select a curated unique and check key rolls</h2>
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
          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            Unique item
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
            >
              {uniqueItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {selectedItem?.hasVariableRolls ? (
            selectedItem.keyRollFields.map((field) => (
              <label key={field} className="grid gap-2 text-sm text-zinc-300">
                {getFieldLabel(field, selectedItem)}
                <input
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Blank"
                  value={form[field]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field]: event.target.value
                    }))
                  }
                  aria-label={getFieldLabel(field, selectedItem)}
                />
              </label>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-black/10 px-4 py-3 text-sm leading-6 text-zinc-400 md:col-span-2">
              This unique is mostly judged by whether it is a staple at all. No roll input is needed for the MVP.
            </div>
          )}
        </div>

        {selectedItem ? (
          <div className="mt-6 rounded-2xl border border-border bg-black/20 p-4">
            <div className="flex flex-wrap gap-2">
              <Pill>{selectedItem.category}</Pill>
              <Pill>{selectedItem.liquidity} liquidity</Pill>
              <Pill>{mode === "SCNL" ? selectedItem.scnlPriority : selectedItem.sclPriority}</Pill>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{selectedItem.notes}</p>
          </div>
        ) : null}
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
            Select a unique and add any relevant roll values. The panel stays clear until you start a check.
          </div>
        )}
      </Card>
    </div>
  );
}
