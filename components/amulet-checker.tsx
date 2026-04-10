"use client";

import { useMemo, useState } from "react";
import { AffixEntryPanel } from "@/components/affix-entry-panel";
import { Card, Pill } from "@/components/ui";
import { affixGuidanceByItemType, getAffixesForItemType, getCoreAffixesForItemType, getOptionalAffixesForItemType } from "@/data/variance-affixes";
import { VERDICT_STYLES } from "@/lib/constants";
import { evaluateAmulet } from "@/lib/amulet-checker";
import { AmuletAffixKey, AmuletClassSkill, GameMode } from "@/lib/types";

type VisibleAmuletAffixKey = Exclude<AmuletAffixKey, "classSkills">;

const amuletFormKeys: VisibleAmuletAffixKey[] = [
  "allSkills",
  "fasterCastRate",
  "strength",
  "dexterity",
  "life",
  "mana",
  "allResist",
  "fireResist",
  "lightningResist",
  "coldResist",
  "poisonResist",
  "magicFind",
  "attackRating",
  "minDamage",
  "maxDamage",
  "levelRequirement",
  "energy",
  "replenishLife",
  "extraGold"
];

type AmuletFormState = Record<VisibleAmuletAffixKey, string>;

const emptyForm = amuletFormKeys.reduce<AmuletFormState>((accumulator, key) => {
  accumulator[key] = "";
  return accumulator;
}, {} as AmuletFormState);

const amuletCoreAffixes = getCoreAffixesForItemType("amulet") as Array<
  (ReturnType<typeof getAffixesForItemType>[number]) & { key: AmuletAffixKey }
>;
const amuletOptionalAffixes = getOptionalAffixesForItemType("amulet") as Array<
  (ReturnType<typeof getAffixesForItemType>[number]) & { key: AmuletAffixKey }
>;
const defaultOptionalKeys: VisibleAmuletAffixKey[] = [];
const amuletClassSkillOptions: AmuletClassSkill[] = [
  "Amazon Skills",
  "Assassin Skills",
  "Barbarian Skills",
  "Druid Skills",
  "Necromancer Skills",
  "Paladin Skills",
  "Sorceress Skills"
];

const visibleCoreAffixes = amuletCoreAffixes.filter(
  (affix): affix is (typeof amuletCoreAffixes)[number] & { key: VisibleAmuletAffixKey } => affix.key !== "classSkills"
);
const visibleOptionalAffixes = amuletOptionalAffixes.filter(
  (affix): affix is (typeof amuletOptionalAffixes)[number] & { key: VisibleAmuletAffixKey } => affix.key !== "classSkills"
);

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function AmuletChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<AmuletFormState>(emptyForm);
  const [classSkillType, setClassSkillType] = useState<AmuletClassSkill | "">("");
  const [activeOptionalKeys, setActiveOptionalKeys] = useState<VisibleAmuletAffixKey[]>(defaultOptionalKeys);
  const hasInput = Object.values(form).some((value) => value.trim() !== "") || classSkillType !== "";

  const result = useMemo(
    () =>
      evaluateAmulet({
        mode,
        allSkills: toOptionalNumber(form.allSkills),
        classSkills: classSkillType ? 2 : undefined,
        classSkillType: classSkillType || undefined,
        fasterCastRate: toOptionalNumber(form.fasterCastRate),
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        life: toOptionalNumber(form.life),
        mana: toOptionalNumber(form.mana),
        allResist: toOptionalNumber(form.allResist),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        coldResist: toOptionalNumber(form.coldResist),
        poisonResist: toOptionalNumber(form.poisonResist),
        magicFind: toOptionalNumber(form.magicFind),
        attackRating: toOptionalNumber(form.attackRating),
        minDamage: toOptionalNumber(form.minDamage),
        maxDamage: toOptionalNumber(form.maxDamage),
        levelRequirement: toOptionalNumber(form.levelRequirement),
        energy: toOptionalNumber(form.energy),
        replenishLife: toOptionalNumber(form.replenishLife),
        extraGold: toOptionalNumber(form.extraGold)
      }),
    [classSkillType, form, mode]
  );

  const handleReset = () => {
    setForm(emptyForm);
    setClassSkillType("");
    setActiveOptionalKeys(defaultOptionalKeys);
  };

  const handleValueChange = (key: VisibleAmuletAffixKey, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleAddAffix = (key: VisibleAmuletAffixKey) => {
    setActiveOptionalKeys((current) => (current.includes(key) ? current : [...current, key]));
  };

  const handleRemoveAffix = (key: VisibleAmuletAffixKey) => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rare Amulet Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast amulet checks with important rolls up front</h2>
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
          <div className="mb-4 grid gap-2 text-sm text-zinc-300 sm:max-w-sm">
            <label htmlFor="amulet-class-skill">Class skill</label>
            <select
              id="amulet-class-skill"
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={classSkillType}
              onChange={(event) => setClassSkillType(event.target.value as AmuletClassSkill | "")}
            >
              <option value="">No class skill</option>
              {amuletClassSkillOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <AffixEntryPanel
            coreAffixes={visibleCoreAffixes}
            optionalAffixes={visibleOptionalAffixes}
            values={form}
            activeOptionalKeys={activeOptionalKeys}
            guidance={affixGuidanceByItemType.amulet}
            onValueChange={handleValueChange}
            onAddAffix={handleAddAffix}
            onRemoveAffix={handleRemoveAffix}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>Skills and FCR synergy</Pill>
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
            Enter the visible amulet mods to start triage. Optional affixes stay hidden until you decide they are worth capturing.
          </div>
        )}
      </Card>
    </div>
  );
}
