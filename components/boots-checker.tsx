"use client";

import { useMemo, useState } from "react";
import { AffixEntryPanel } from "@/components/affix-entry-panel";
import { Card, Pill } from "@/components/ui";
import { affixGuidanceByItemType, getAffixesForItemType, getCoreAffixesForItemType, getOptionalAffixesForItemType } from "@/data/variance-affixes";
import { VERDICT_STYLES } from "@/lib/constants";
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rare Boots Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast boot checks with tradable utility patterns</h2>
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
          <Pill>FRW and tri-res patterns</Pill>
          <Pill>Mode-aware liquidity</Pill>
          <Pill>Deterministic scoring</Pill>
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
            Enter the visible boot mods to start triage. Core boot value stats stay visible, while lower-impact affixes remain optional.
          </div>
        )}
      </Card>
    </div>
  );
}
