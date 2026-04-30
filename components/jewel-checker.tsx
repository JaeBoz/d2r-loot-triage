"use client";

import { useMemo, useState } from "react";
import { AffixEntryPanel } from "@/components/affix-entry-panel";
import { Card, Pill } from "@/components/ui";
import { affixGuidanceByItemType, getAffixesForItemType, getCoreAffixesForItemType, getOptionalAffixesForItemType } from "@/data/variance-affixes";
import { ResultPanel } from "@/components/result-panel";
import { evaluateJewel } from "@/lib/jewel-checker";
import { GameMode, JewelAffixKey } from "@/lib/types";

const jewelFormKeys: JewelAffixKey[] = [
  "increasedAttackSpeed",
  "enhancedDamage",
  "strength",
  "dexterity",
  "life",
  "attackRating",
  "maxDamage",
  "minDamage",
  "allResist",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "requirementsReduction",
  "energy",
  "extraGold"
];

type JewelFormState = Record<JewelAffixKey, string>;

const emptyForm = jewelFormKeys.reduce<JewelFormState>((accumulator, key) => {
  accumulator[key] = "";
  return accumulator;
}, {} as JewelFormState);

const jewelCoreAffixes = getCoreAffixesForItemType("jewel") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: JewelAffixKey }>;
const jewelOptionalAffixes = getOptionalAffixesForItemType("jewel") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: JewelAffixKey }>;
const defaultOptionalKeys: JewelAffixKey[] = [];

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function JewelChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<JewelFormState>(emptyForm);
  const [activeOptionalKeys, setActiveOptionalKeys] = useState<JewelAffixKey[]>(defaultOptionalKeys);
  const hasInput = Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateJewel({
        mode,
        increasedAttackSpeed: toOptionalNumber(form.increasedAttackSpeed),
        enhancedDamage: toOptionalNumber(form.enhancedDamage),
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        life: toOptionalNumber(form.life),
        attackRating: toOptionalNumber(form.attackRating),
        maxDamage: toOptionalNumber(form.maxDamage),
        minDamage: toOptionalNumber(form.minDamage),
        allResist: toOptionalNumber(form.allResist),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        coldResist: toOptionalNumber(form.coldResist),
        poisonResist: toOptionalNumber(form.poisonResist),
        requirementsReduction: toOptionalNumber(form.requirementsReduction) ? 15 : undefined,
        energy: toOptionalNumber(form.energy),
        extraGold: toOptionalNumber(form.extraGold)
      }),
    [form, mode]
  );

  const handleReset = () => {
    setForm(emptyForm);
    setActiveOptionalKeys(defaultOptionalKeys);
  };

  const handleValueChange = (key: JewelAffixKey, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleAddAffix = (key: JewelAffixKey) => {
    setActiveOptionalKeys((current) => (current.includes(key) ? current : [...current, key]));
  };

  const handleRemoveAffix = (key: JewelAffixKey) => {
    setActiveOptionalKeys((current) => current.filter((entry) => entry !== key));
    setForm((current) => ({
      ...current,
      [key]: ""
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Jewel Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast jewel checks with tradable patterns up front</h2>
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

        <div className="mt-6">
          <AffixEntryPanel
            coreAffixes={jewelCoreAffixes}
            optionalAffixes={jewelOptionalAffixes}
            values={form}
            activeOptionalKeys={activeOptionalKeys}
            guidance={affixGuidanceByItemType.jewel}
            onValueChange={handleValueChange}
            onAddAffix={handleAddAffix}
            onRemoveAffix={handleRemoveAffix}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>Pattern-based triage</Pill>
          <Pill>IAS and ED combos</Pill>
          <Pill>Mode-aware liquidity</Pill>
        </div>
      </Card>

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Enter the visible jewel mods to start triage. Optional affixes are available when you need to capture niche details without cluttering every check."
      />
    </div>
  );
}
