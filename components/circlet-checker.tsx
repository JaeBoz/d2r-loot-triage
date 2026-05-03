"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { clampAffixInputValue, getAffixValueCap } from "@/data/affix-guardrails";
import { circletFamilies } from "@/data/circlet-rules";
import { ResultPanel } from "@/components/result-panel";
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

function getMagicSocketOptions(family: CircletFamily) {
  const familyData = circletFamilies.find((entry) => entry.family === family);
  return Array.from({ length: familyData?.maxMagicSockets ?? 0 }, (_, index) => String(index + 1));
}

function clampCircletValue(key: keyof CircletFormState, value: string) {
  return key === "sockets" ? value : clampAffixInputValue(key, value, "circlet");
}

function updateCircletTextField(
  setForm: Dispatch<SetStateAction<CircletFormState>>,
  key: keyof CircletFormState,
  value: string,
  shouldClamp = false
) {
  setForm((current) => ({
    ...current,
    [key]: shouldClamp ? clampCircletValue(key, value) : value
  }));
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

  const availableSocketOptions = quality === "Magic" ? getMagicSocketOptions(family) : ["0", "1", "2"];
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
        sockets: quality === "Magic" || quality === "Rare" ? toOptionalNumber(form.sockets) : undefined,
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

  const handleFamilyChange = (nextFamily: CircletFamily) => {
    setFamily(nextFamily);
    setForm((current) => {
      if (quality !== "Magic" || current.sockets === "") {
        return current;
      }

      return getMagicSocketOptions(nextFamily).includes(current.sockets) ? current : { ...current, sockets: "" };
    });
  };

  const handleSkillModeChange = (nextMode: CircletSkillMode) => {
    setSkillMode(nextMode);
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
              onChange={(event) => handleFamilyChange(event.target.value as CircletFamily)}
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
              max={getAffixValueCap("fasterCastRate", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fasterCastRate}
              onChange={(event) => updateCircletTextField(setForm, "fasterCastRate", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "fasterCastRate", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Faster Run/Walk
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("fasterRunWalk", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fasterRunWalk}
              onChange={(event) => updateCircletTextField(setForm, "fasterRunWalk", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "fasterRunWalk", event.target.value, true)}
            />
          </label>

          {quality === "Rare" || quality === "Magic" ? (
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
              max={getAffixValueCap("strength", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.strength}
              onChange={(event) => updateCircletTextField(setForm, "strength", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "strength", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Dexterity
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("dexterity", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.dexterity}
              onChange={(event) => updateCircletTextField(setForm, "dexterity", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "dexterity", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Life
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("life", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.life}
              onChange={(event) => updateCircletTextField(setForm, "life", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "life", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            All Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("allResist", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.allResist}
              onChange={(event) => updateCircletTextField(setForm, "allResist", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "allResist", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Fire Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("fireResist", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.fireResist}
              onChange={(event) => updateCircletTextField(setForm, "fireResist", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "fireResist", event.target.value, true)}
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Lightning Resist
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap("lightningResist", "circlet")}
              inputMode="numeric"
              placeholder="Blank"
              value={form.lightningResist}
              onChange={(event) => updateCircletTextField(setForm, "lightningResist", event.target.value)}
              onBlur={(event) => updateCircletTextField(setForm, "lightningResist", event.target.value, true)}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>{family}</Pill>
          <Pill>{quality}</Pill>
          <Pill>Jackpot patterns only</Pill>
        </div>
      </Card>

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Choose the circlet family, quality, and only the standout visible rolls you care about. The panel stays clear until you start a check."
      />
    </div>
  );
}
