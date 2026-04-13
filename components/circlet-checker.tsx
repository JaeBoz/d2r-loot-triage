"use client";

import { useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { circletFamilies } from "@/data/circlet-rules";
import { VERDICT_STYLES } from "@/lib/constants";
import { evaluateCirclet } from "@/lib/circlet-checker";
import {
  CircletClassSkill,
  CircletFamily,
  CircletQuality,
  CircletSkillMode,
  CircletSkillTier,
  CircletSkillTree,
  GameMode
} from "@/lib/types";

const classSkillOptions: CircletClassSkill[] = [
  "Amazon Skills",
  "Assassin Skills",
  "Barbarian Skills",
  "Druid Skills",
  "Necromancer Skills",
  "Paladin Skills",
  "Sorceress Skills"
];

const treeSkillOptions: CircletSkillTree[] = [
  "Amazon Passive and Magic Skills",
  "Assassin Traps",
  "Druid Elemental Skills",
  "Necromancer Poison and Bone Skills",
  "Paladin Combat Skills",
  "Sorceress Cold Spells",
  "Sorceress Lightning Spells"
];

const rareSkillValues: Array<1 | 2> = [1, 2];
const magicClassSkillValues: Array<1 | 2> = [1, 2];
const magicTreeSkillValues: CircletSkillTier[] = [1, 2, 3];

type CircletFormState = {
  fasterCastRate: string;
  fasterRunWalk: string;
  sockets: string;
  strength: string;
  dexterity: string;
  life: string;
  allResist: string;
  fireResist: string;
  lightningResist: string;
};

const emptyForm: CircletFormState = {
  fasterCastRate: "",
  fasterRunWalk: "",
  sockets: "",
  strength: "",
  dexterity: "",
  life: "",
  allResist: "",
  fireResist: "",
  lightningResist: ""
};

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function CircletChecker({ mode }: { mode: GameMode }) {
  const [family, setFamily] = useState<CircletFamily>("Diadem");
  const [quality, setQuality] = useState<CircletQuality>("Rare");
  const [skillMode, setSkillMode] = useState<CircletSkillMode>("none");
  const [classSkillType, setClassSkillType] = useState<CircletClassSkill | "">("");
  const [classSkillValue, setClassSkillValue] = useState<1 | 2>(2);
  const [skillTreeType, setSkillTreeType] = useState<CircletSkillTree | "">("");
  const [skillTreeValue, setSkillTreeValue] = useState<CircletSkillTier>(3);
  const [form, setForm] = useState<CircletFormState>(emptyForm);

  const familyData = useMemo(() => circletFamilies.find((entry) => entry.family === family), [family]);
  const availableSocketOptions =
    quality === "Magic" ? Array.from({ length: familyData?.maxMagicSockets ?? 0 }, (_, index) => String(index + 1)) : [];
  const hasInput =
    quality !== "Rare" ||
    family !== "Diadem" ||
    skillMode !== "none" ||
    classSkillType !== "" ||
    skillTreeType !== "" ||
    Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateCirclet({
        mode,
        family,
        quality,
        skillMode,
        classSkillType: skillMode === "class" ? classSkillType || undefined : undefined,
        classSkillValue: skillMode === "class" ? classSkillValue : undefined,
        skillTreeType: skillMode === "tree" ? skillTreeType || undefined : undefined,
        skillTreeValue: skillMode === "tree" ? skillTreeValue : undefined,
        fasterCastRate: toOptionalNumber(form.fasterCastRate),
        fasterRunWalk: toOptionalNumber(form.fasterRunWalk),
        sockets: quality === "Magic" && skillMode === "none" ? toOptionalNumber(form.sockets) : undefined,
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        life: toOptionalNumber(form.life),
        allResist: toOptionalNumber(form.allResist),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist)
      }),
    [classSkillType, classSkillValue, family, form, mode, quality, skillMode, skillTreeType, skillTreeValue]
  );

  const handleReset = () => {
    setFamily("Diadem");
    setQuality("Rare");
    setSkillMode("none");
    setClassSkillType("");
    setClassSkillValue(2);
    setSkillTreeType("");
    setSkillTreeValue(3);
    setForm(emptyForm);
  };

  const handleQualityChange = (nextQuality: CircletQuality) => {
    setQuality(nextQuality);
    setSkillMode("none");
    setClassSkillType("");
    setSkillTreeType("");
    setForm((current) => ({
      ...current,
      sockets: ""
    }));
  };

  const handleSkillModeChange = (nextMode: CircletSkillMode) => {
    setSkillMode(nextMode);
    if (nextMode !== "none") {
      setForm((current) => ({
        ...current,
        sockets: ""
      }));
    }
    if (nextMode !== "class") {
      setClassSkillType("");
    }
    if (nextMode !== "tree") {
      setSkillTreeType("");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Circlet Triage</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Fast jackpot checks for magic and rare circlets</h2>
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
            Family
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={family}
              onChange={(event) => setFamily(event.target.value as CircletFamily)}
            >
              {circletFamilies.map((entry) => (
                <option key={entry.family} value={entry.family}>
                  {entry.family}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Quality
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={quality}
              onChange={(event) => handleQualityChange(event.target.value as CircletQuality)}
            >
              <option value="Magic">Magic</option>
              <option value="Rare">Rare</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            Skill line
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={skillMode}
              onChange={(event) => handleSkillModeChange(event.target.value as CircletSkillMode)}
            >
              <option value="none">No standout skill line</option>
              <option value="class">Class skills</option>
              {quality === "Magic" ? <option value="tree">Tree skills</option> : null}
            </select>
          </label>

          {skillMode === "class" ? (
            <>
              <label className="grid gap-2 text-sm text-zinc-300">
                Class skills
                <select
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  value={classSkillType}
                  onChange={(event) => setClassSkillType(event.target.value as CircletClassSkill | "")}
                >
                  <option value="">Select class</option>
                  {classSkillOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-zinc-300">
                Skill value
                <select
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  value={String(classSkillValue)}
                  onChange={(event) => setClassSkillValue(Number(event.target.value) as 1 | 2)}
                >
                  {(quality === "Magic" ? magicClassSkillValues : rareSkillValues).map((value) => (
                    <option key={value} value={value}>
                      +{value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}

          {skillMode === "tree" && quality === "Magic" ? (
            <>
              <label className="grid gap-2 text-sm text-zinc-300">
                Tree skills
                <select
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  value={skillTreeType}
                  onChange={(event) => setSkillTreeType(event.target.value as CircletSkillTree | "")}
                >
                  <option value="">Select tree</option>
                  {treeSkillOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-zinc-300">
                Skill value
                <select
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  value={String(skillTreeValue)}
                  onChange={(event) => setSkillTreeValue(Number(event.target.value) as CircletSkillTier)}
                >
                  {magicTreeSkillValues.map((value) => (
                    <option key={value} value={value}>
                      +{value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}

          <label className="grid gap-2 text-sm text-zinc-300">
            Faster Cast Rate
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fasterCastRate}
              onChange={(event) => setForm((current) => ({ ...current, fasterCastRate: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Faster Run/Walk
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fasterRunWalk}
              onChange={(event) => setForm((current) => ({ ...current, fasterRunWalk: event.target.value }))}
            />
          </label>

          {quality === "Magic" && skillMode === "none" ? (
            <label className="grid gap-2 text-sm text-zinc-300">
              Sockets
              <select
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                value={form.sockets}
                onChange={(event) => setForm((current) => ({ ...current, sockets: event.target.value }))}
              >
                <option value="">No socket roll</option>
                {availableSocketOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-2 text-sm text-zinc-300">
            Strength
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.strength}
              onChange={(event) => setForm((current) => ({ ...current, strength: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Dexterity
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.dexterity}
              onChange={(event) => setForm((current) => ({ ...current, dexterity: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Life
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.life}
              onChange={(event) => setForm((current) => ({ ...current, life: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            All Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.allResist}
              onChange={(event) => setForm((current) => ({ ...current, allResist: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Fire Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fireResist}
              onChange={(event) => setForm((current) => ({ ...current, fireResist: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Lightning Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Blank"
              value={form.lightningResist}
              onChange={(event) => setForm((current) => ({ ...current, lightningResist: event.target.value }))}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>{family}</Pill>
          <Pill>{quality}</Pill>
          <Pill>Jackpot patterns only</Pill>
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
            Choose the circlet family, quality, and only the standout visible rolls you care about. The panel stays clear until you start a check.
          </div>
        )}
      </Card>
    </div>
  );
}
