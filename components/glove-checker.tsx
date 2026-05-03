"use client";

import { useMemo, useState } from "react";
import { clampAffixInputValue, getAffixValueCap } from "@/data/affix-guardrails";
import { Card, Pill } from "@/components/ui";
import { ResultPanel } from "@/components/result-panel";
import { evaluateGloves } from "@/lib/glove-checker";
import { GameMode, GloveQuality, GloveSkillType } from "@/lib/types";

type GloveFormState = {
  quality: GloveQuality;
  skillType: GloveSkillType;
  skillLevel: "0" | "1" | "2" | "3";
  increasedAttackSpeed: "0" | "10" | "20";
  crushingBlow: string;
  lifeLeech: string;
  life: string;
  magicFind: string;
  strength: string;
  dexterity: string;
  resistSupport: string;
};

const emptyForm: GloveFormState = {
  quality: "Magic",
  skillType: "None",
  skillLevel: "0",
  increasedAttackSpeed: "0",
  crushingBlow: "",
  lifeLeech: "",
  life: "",
  magicFind: "",
  strength: "",
  dexterity: "",
  resistSupport: ""
};

const skillTypes: GloveSkillType[] = ["None", "Javelin and Spear", "Bow and Crossbow", "Martial Arts"];
const qualities: GloveQuality[] = ["Magic", "Rare", "Crafted"];
const iasValues = ["0", "10", "20"] as const;
const gloveFieldCaps: Partial<Record<keyof GloveFormState, number>> = {
  crushingBlow: 10,
  resistSupport: 30
};

function getGloveFieldCap(key: keyof GloveFormState) {
  if (key === "magicFind" || key === "strength" || key === "dexterity" || key === "life" || key === "lifeLeech") {
    return getAffixValueCap(key, "glove");
  }

  return gloveFieldCaps[key];
}

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function skillLevelOptions(quality: GloveQuality) {
  return quality === "Magic" ? (["0", "1", "2", "3"] as const) : (["0", "1", "2"] as const);
}

export function GloveChecker({ mode }: { mode: GameMode }) {
  const [form, setForm] = useState<GloveFormState>(emptyForm);
  const hasInput =
    form.quality !== emptyForm.quality ||
    form.skillType !== emptyForm.skillType ||
    form.skillLevel !== emptyForm.skillLevel ||
    form.increasedAttackSpeed !== emptyForm.increasedAttackSpeed ||
    Object.entries(form).some(([key, value]) => !["quality", "skillType", "skillLevel", "increasedAttackSpeed"].includes(key) && value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateGloves({
        mode,
        quality: form.quality,
        skillType: form.skillType,
        skillLevel: Number(form.skillLevel) as 0 | 1 | 2 | 3,
        increasedAttackSpeed: Number(form.increasedAttackSpeed) as 0 | 10 | 20,
        crushingBlow: toOptionalNumber(form.crushingBlow),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        life: toOptionalNumber(form.life),
        magicFind: toOptionalNumber(form.magicFind),
        strength: toOptionalNumber(form.strength),
        dexterity: toOptionalNumber(form.dexterity),
        resistSupport: toOptionalNumber(form.resistSupport)
      }),
    [form, mode]
  );

  const updateForm = (key: keyof GloveFormState, value: string) => {
    setForm((current) => {
      const cap = getGloveFieldCap(key);
      const cappedValue =
        key === "magicFind" || key === "strength" || key === "dexterity" || key === "life" || key === "lifeLeech"
          ? clampAffixInputValue(key, value, "glove")
          : cap === undefined || value.trim() === "" || Number.isNaN(Number(value))
            ? value
            : String(Math.min(Math.max(0, Number(value)), cap));
      const next = { ...current, [key]: cappedValue };

      if (key === "quality" && value !== "Magic" && next.skillLevel === "3") {
        next.skillLevel = "2";
      }

      if (key === "skillType" && value === "None") {
        next.skillLevel = "0";
      }

      return next;
    });
  };

  const handleReset = () => setForm(emptyForm);

  const numberField = (key: keyof GloveFormState, label: string, placeholder = "Blank") => (
    <label className="grid gap-2 text-sm text-zinc-300">
      {label}
      <input
        className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
        type="number"
        min={0}
        max={getGloveFieldCap(key)}
        inputMode="numeric"
        placeholder={placeholder}
        value={form[key]}
        onChange={(event) => updateForm(key, event.target.value)}
        aria-label={label}
      />
    </label>
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[1.02fr_0.98fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Magic / Rare / Crafted Gloves</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Pattern checks for Jav, IAS, and Blood-style hits</h2>
          </div>
          <div className="flex items-center gap-2">
            <Pill active>{mode}</Pill>
            <button
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-zinc-300">
            Glove quality
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={form.quality}
              onChange={(event) => updateForm("quality", event.target.value)}
            >
              {qualities.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Skill type
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={form.skillType}
              onChange={(event) => updateForm("skillType", event.target.value)}
            >
              {skillTypes.map((skillType) => (
                <option key={skillType} value={skillType}>
                  {skillType}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Skill level
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={form.skillLevel}
              onChange={(event) => updateForm("skillLevel", event.target.value)}
              disabled={form.skillType === "None"}
            >
              {skillLevelOptions(form.quality).map((level) => (
                <option key={level} value={level}>
                  +{level}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            IAS
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={form.increasedAttackSpeed}
              onChange={(event) => updateForm("increasedAttackSpeed", event.target.value)}
            >
              {iasValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          {numberField("crushingBlow", "Crushing Blow")}
          {numberField("lifeLeech", "Life Leech")}
          {numberField("life", "Life")}
          {numberField("magicFind", "Magic Find")}
          {numberField("strength", "Strength")}
          {numberField("dexterity", "Dexterity")}
          {numberField("resistSupport", "Resist support")}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-black/20 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">What to look for</p>
          <div className="mt-2 grid gap-1 text-sm leading-5 text-zinc-300 sm:grid-cols-2">
            <span>+2/3 Jav + 20 IAS = big hit</span>
            <span>IAS + strong support = worth checking</span>
            <span>Blood gloves: IAS + Crushing Blow can matter</span>
            <span>No IAS = usually Charsi</span>
          </div>
        </div>
      </Card>

      <ResultPanel
        result={result}
        hasInput={hasInput}
        emptyMessage="Enter the glove quality and visible high-signal mods. Gloves care about patterns first: skills, IAS, Crushing Blow, and support."
      />
    </div>
  );
}
