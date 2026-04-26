"use client";

import { useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { ResultPanel } from "@/components/result-panel";
import { evaluateUnique, uniqueItems } from "@/lib/unique-checker";
import { GameMode, UniqueCheckInput, UniqueRollField } from "@/lib/types";

const fieldLabels: Record<UniqueRollField, string> = {
  magicFind: "Magic Find",
  damage: "Damage",
  dexterity: "Dexterity",
  attackRating: "Attack Rating",
  allResist: "All Resist",
  minusEnemyLightningResist: "-Enemy Lightning Res",
  minusEnemyPoisonResist: "-Enemy Poison Res",
  lightningSkillDamage: "Lightning Damage",
  fireSkillDamage: "Fire Skill Damage",
  enhancedDamage: "Enhanced Damage",
  strength: "Strength",
  lifeLeech: "Life Leech",
  damageReduction: "Damage Reduction",
  sockets: "Sockets",
  poisonAndBoneSkills: "Poison and Bone Skills",
  energy: "Energy",
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
  minusEnemyPoisonResist: "",
  lightningSkillDamage: "",
  fireSkillDamage: "",
  enhancedDamage: "",
  strength: "",
  lifeLeech: "",
  damageReduction: "",
  sockets: "",
  poisonAndBoneSkills: "",
  energy: "",
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
  const [ethereal, setEthereal] = useState(false);

  const selectedItem = useMemo(() => uniqueItems.find((item) => item.id === itemId), [itemId]);
  const hasInput =
    itemId !== defaultItemId || ethereal || Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateUnique({
        mode,
        itemId,
        ethereal,
        magicFind: toOptionalNumber(form.magicFind),
        damage: toOptionalNumber(form.damage),
        dexterity: toOptionalNumber(form.dexterity),
        attackRating: toOptionalNumber(form.attackRating),
        allResist: toOptionalNumber(form.allResist),
        minusEnemyLightningResist: toOptionalNumber(form.minusEnemyLightningResist),
        minusEnemyPoisonResist: toOptionalNumber(form.minusEnemyPoisonResist),
        lightningSkillDamage: toOptionalNumber(form.lightningSkillDamage),
        fireSkillDamage: toOptionalNumber(form.fireSkillDamage),
        enhancedDamage: toOptionalNumber(form.enhancedDamage),
        strength: toOptionalNumber(form.strength),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        damageReduction: toOptionalNumber(form.damageReduction),
        sockets: toOptionalNumber(form.sockets),
        poisonAndBoneSkills: toOptionalNumber(form.poisonAndBoneSkills),
        energy: toOptionalNumber(form.energy),
        coldSkillDamage: toOptionalNumber(form.coldSkillDamage),
        allSkills: toOptionalNumber(form.allSkills)
      }),
    [ethereal, form, itemId, mode]
  );

  const handleReset = () => {
    setItemId(defaultItemId);
    setForm(emptyForm);
    setEthereal(false);
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

          {selectedItem?.etherealRelevant ? (
            <label className="flex items-center gap-3 rounded-xl border border-border bg-black/10 px-3 py-3 text-sm text-zinc-200 md:col-span-2">
              <input
                className="h-4 w-4 rounded border-border bg-black/20 text-accent focus:ring-accent"
                type="checkbox"
                checked={ethereal}
                onChange={(event) => setEthereal(event.target.checked)}
              />
              Ethereal
            </label>
          ) : null}

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

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Select a unique and add any relevant roll values. The panel stays clear until you start a check."
      />
    </div>
  );
}
