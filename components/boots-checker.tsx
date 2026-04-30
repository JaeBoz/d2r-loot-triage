"use client";

import { useMemo, useState } from "react";
import { AffixEntryPanel } from "@/components/affix-entry-panel";
import { Card, Pill } from "@/components/ui";
import { affixGuidanceByItemType, getAffixesForItemType, getCoreAffixesForItemType, getOptionalAffixesForItemType } from "@/data/variance-affixes";
import { ResultPanel } from "@/components/result-panel";
import { evaluateBoots } from "@/lib/boots-checker";
import { BootsAffixKey, GameMode } from "@/lib/types";

const bootsFormKeys: BootsAffixKey[] = [
  "fasterRunWalk",
  "fasterHitRecovery",
  "magicFind",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "strength",
  "dexterity",
  "life",
  "mana",
  "manaRegen",
  "extraGold",
  "replenishLife"
];

type BootsFormState = Record<BootsAffixKey, string>;

const emptyForm = bootsFormKeys.reduce<BootsFormState>((accumulator, key) => {
  accumulator[key] = "";
  return accumulator;
}, {} as BootsFormState);

const bootsCoreAffixes = getCoreAffixesForItemType("boots") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: BootsAffixKey }>;
const bootsOptionalAffixes = getOptionalAffixesForItemType("boots") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: BootsAffixKey }>;
const defaultOptionalKeys: BootsAffixKey[] = [];

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function BootsChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<BootsFormState>(emptyForm);
  const [activeOptionalKeys, setActiveOptionalKeys] = useState<BootsAffixKey[]>(defaultOptionalKeys);
  const hasInput = Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateBoots({
        mode,
        fasterRunWalk: toOptionalNumber(form.fasterRunWalk),
        fasterHitRecovery: toOptionalNumber(form.fasterHitRecovery),
        magicFind: toOptionalNumber(form.magicFind),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        coldResist: toOptionalNumber(form.coldResist),
        poisonResist: toOptionalNumber(form.poisonResist),
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        life: toOptionalNumber(form.life),
        mana: toOptionalNumber(form.mana),
        manaRegen: toOptionalNumber(form.manaRegen),
        extraGold: toOptionalNumber(form.extraGold),
        replenishLife: toOptionalNumber(form.replenishLife)
      }),
    [form, mode]
  );

  const handleReset = () => {
    setForm(emptyForm);
    setActiveOptionalKeys(defaultOptionalKeys);
  };

  const handleValueChange = (key: BootsAffixKey, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleAddAffix = (key: BootsAffixKey) => {
    setActiveOptionalKeys((current) => (current.includes(key) ? current : [...current, key]));
  };

  const handleRemoveAffix = (key: BootsAffixKey) => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rare / Crafted Boots Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast boot checks built around FRW and support</h2>
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
            coreAffixes={bootsCoreAffixes}
            optionalAffixes={bootsOptionalAffixes}
            values={form}
            activeOptionalKeys={activeOptionalKeys}
            guidance={affixGuidanceByItemType.boots}
            onValueChange={handleValueChange}
            onAddAffix={handleAddAffix}
            onRemoveAffix={handleRemoveAffix}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>FRW is the anchor</Pill>
          <Pill>Dual/triple res matters</Pill>
          <Pill>No FRW is usually Charsi</Pill>
          <Pill>Mana stays secondary</Pill>
        </div>
      </Card>

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Enter the visible boot mods to start triage. Core boot value stats stay visible, while lower-impact affixes remain optional."
      />
    </div>
  );
}
