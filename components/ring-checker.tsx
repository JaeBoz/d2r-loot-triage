"use client";

import { useMemo, useState } from "react";
import { AffixEntryPanel } from "@/components/affix-entry-panel";
import { Card, Pill } from "@/components/ui";
import { affixGuidanceByItemType, getAffixesForItemType, getCoreAffixesForItemType, getOptionalAffixesForItemType } from "@/data/variance-affixes";
import { ResultPanel } from "@/components/result-panel";
import { evaluateRing } from "@/lib/ring-checker";
import { GameMode, RingAffixKey } from "@/lib/types";

const ringFormKeys: RingAffixKey[] = [
  "fasterCastRate",
  "strength",
  "dexterity",
  "life",
  "mana",
  "attackRating",
  "allResist",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "magicFind",
  "lifeLeech",
  "manaLeech",
  "minDamage",
  "maxDamage",
  "levelRequirement",
  "energy",
  "replenishLife",
  "extraGold"
];

type RingFormState = Record<RingAffixKey, string>;

const emptyForm = ringFormKeys.reduce<RingFormState>((accumulator, key) => {
  accumulator[key] = "";
  return accumulator;
}, {} as RingFormState);

const ringCoreAffixes = getCoreAffixesForItemType("ring") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: RingAffixKey }>;
const ringOptionalAffixes = getOptionalAffixesForItemType("ring") as Array<(ReturnType<typeof getAffixesForItemType>[number]) & { key: RingAffixKey }>;
const defaultOptionalKeys: RingAffixKey[] = [];

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function RingChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<RingFormState>(emptyForm);
  const [activeOptionalKeys, setActiveOptionalKeys] = useState<RingAffixKey[]>(defaultOptionalKeys);
  const hasInput = Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateRing({
        mode,
        fasterCastRate: toOptionalNumber(form.fasterCastRate),
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        life: toOptionalNumber(form.life),
        mana: toOptionalNumber(form.mana),
        attackRating: toOptionalNumber(form.attackRating),
        allResist: toOptionalNumber(form.allResist),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        coldResist: toOptionalNumber(form.coldResist),
        poisonResist: toOptionalNumber(form.poisonResist),
        magicFind: toOptionalNumber(form.magicFind),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        manaLeech: toOptionalNumber(form.manaLeech),
        minDamage: toOptionalNumber(form.minDamage),
        maxDamage: toOptionalNumber(form.maxDamage),
        levelRequirement: toOptionalNumber(form.levelRequirement),
        energy: toOptionalNumber(form.energy),
        replenishLife: toOptionalNumber(form.replenishLife),
        extraGold: toOptionalNumber(form.extraGold)
      }),
    [form, mode]
  );

  const handleReset = () => {
    setForm(emptyForm);
    setActiveOptionalKeys(defaultOptionalKeys);
  };

  const handleValueChange = (key: RingAffixKey, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleAddAffix = (key: RingAffixKey) => {
    setActiveOptionalKeys((current) => (current.includes(key) ? current : [...current, key]));
  };

  const handleRemoveAffix = (key: RingAffixKey) => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rare / Crafted Ring Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast ring checks with core stats up front</h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-400">
              Supports rare and crafted rings. Blood craft leech ranges are included where they matter.
            </p>
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
            coreAffixes={ringCoreAffixes}
            optionalAffixes={ringOptionalAffixes}
            values={form}
            activeOptionalKeys={activeOptionalKeys}
            guidance={affixGuidanceByItemType.ring}
            capItemType="ring"
            onValueChange={handleValueChange}
            onAddAffix={handleAddAffix}
            onRemoveAffix={handleRemoveAffix}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>Deterministic scoring</Pill>
          <Pill>Caster and melee synergy</Pill>
          <Pill>Mode-aware liquidity</Pill>
        </div>
      </Card>

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Enter the visible ring mods to start triage. Core value stats stay up front, and optional affixes can be added only when they matter."
      />
    </div>
  );
}
