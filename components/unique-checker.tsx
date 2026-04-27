"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { ResultPanel } from "@/components/result-panel";
import { evaluateUnique, uniqueItems } from "@/lib/unique-checker";
import { GameMode, Ruleset, UniqueRollField } from "@/lib/types";

const fieldLabels: Record<UniqueRollField, string> = {
  magicFind: "Magic Find",
  fasterCastRate: "Faster Cast Rate",
  damage: "Damage",
  dexterity: "Dexterity",
  attackRating: "Attack Rating",
  allResist: "All Resist",
  minusEnemyFireResist: "-Enemy Fire Res",
  minusEnemyColdResist: "-Enemy Cold Res",
  minusEnemyLightningResist: "-Enemy Lightning Res",
  minusEnemyPoisonResist: "-Enemy Poison Res",
  lightningSkillDamage: "Lightning Damage",
  fireSkillDamage: "Fire Skill Damage",
  enhancedDamage: "Enhanced Damage",
  enhancedDefense: "Enhanced Defense",
  strength: "Strength",
  lifeLeech: "Life Leech",
  damageReduction: "Damage Reduction",
  fireResist: "Fire Resist",
  manaAfterKill: "Mana After Each Kill",
  lifeAfterKill: "Life After Each Kill",
  apocalypse: "Apocalypse",
  consume: "Consume",
  bloodBoil: "Blood Boil",
  engorge: "Engorge",
  demonicMastery: "Demonic Mastery",
  minusEnemyMagicResist: "-Enemy Magic Res",
  flameWave: "Flame Wave",
  ringOfFire: "Ring of Fire",
  summonTainted: "Summon Tainted",
  sockets: "Sockets",
  poisonAndBoneSkills: "Poison and Bone Skills",
  energy: "Energy",
  coldSkillDamage: "Cold Skill Damage",
  allSkills: "All Skills",
  lightningAbsorb: "Lightning Absorb",
  vitality: "Vitality"
};

function getFieldLabel(field: UniqueRollField, selectedItem?: (typeof uniqueItems)[number]) {
  return selectedItem?.rollDefinitions?.find((definition) => definition.key === field)?.label ?? fieldLabels[field];
}

type UniqueFormState = Record<UniqueRollField, string>;

const emptyForm: UniqueFormState = {
  magicFind: "",
  fasterCastRate: "",
  damage: "",
  dexterity: "",
  attackRating: "",
  allResist: "",
  minusEnemyFireResist: "",
  minusEnemyColdResist: "",
  minusEnemyLightningResist: "",
  minusEnemyPoisonResist: "",
  lightningSkillDamage: "",
  fireSkillDamage: "",
  enhancedDamage: "",
  enhancedDefense: "",
  strength: "",
  lifeLeech: "",
  damageReduction: "",
  fireResist: "",
  manaAfterKill: "",
  lifeAfterKill: "",
  apocalypse: "",
  consume: "",
  bloodBoil: "",
  engorge: "",
  demonicMastery: "",
  minusEnemyMagicResist: "",
  flameWave: "",
  ringOfFire: "",
  summonTainted: "",
  sockets: "",
  poisonAndBoneSkills: "",
  energy: "",
  coldSkillDamage: "",
  allSkills: "",
  lightningAbsorb: "",
  vitality: ""
};

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export function UniqueChecker({ mode, ruleset }: { mode: GameMode; ruleset: Ruleset }) {
  const availableUniqueItems = useMemo(
    () => uniqueItems.filter((item) => (item.ruleset ?? "lod") === ruleset),
    [ruleset]
  );
  const defaultItemId = availableUniqueItems[0]?.id ?? "";
  const [itemId, setItemId] = useState(defaultItemId);
  const [form, setForm] = useState<UniqueFormState>(emptyForm);
  const [ethereal, setEthereal] = useState(false);

  useEffect(() => {
    setItemId(defaultItemId);
    setForm(emptyForm);
    setEthereal(false);
  }, [defaultItemId, ruleset]);

  const selectedItem = useMemo(
    () => availableUniqueItems.find((item) => item.id === itemId),
    [availableUniqueItems, itemId]
  );
  const hasInput =
    itemId !== defaultItemId || ethereal || Object.values(form).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateUnique({
        mode,
        ruleset,
        itemId,
        ethereal,
        magicFind: toOptionalNumber(form.magicFind),
        fasterCastRate: toOptionalNumber(form.fasterCastRate),
        damage: toOptionalNumber(form.damage),
        dexterity: toOptionalNumber(form.dexterity),
        attackRating: toOptionalNumber(form.attackRating),
        allResist: toOptionalNumber(form.allResist),
        minusEnemyFireResist: toOptionalNumber(form.minusEnemyFireResist),
        minusEnemyColdResist: toOptionalNumber(form.minusEnemyColdResist),
        minusEnemyLightningResist: toOptionalNumber(form.minusEnemyLightningResist),
        minusEnemyPoisonResist: toOptionalNumber(form.minusEnemyPoisonResist),
        lightningSkillDamage: toOptionalNumber(form.lightningSkillDamage),
        fireSkillDamage: toOptionalNumber(form.fireSkillDamage),
        enhancedDamage: toOptionalNumber(form.enhancedDamage),
        enhancedDefense: toOptionalNumber(form.enhancedDefense),
        strength: toOptionalNumber(form.strength),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        damageReduction: toOptionalNumber(form.damageReduction),
        fireResist: toOptionalNumber(form.fireResist),
        manaAfterKill: toOptionalNumber(form.manaAfterKill),
        lifeAfterKill: toOptionalNumber(form.lifeAfterKill),
        apocalypse: toOptionalNumber(form.apocalypse),
        consume: toOptionalNumber(form.consume),
        bloodBoil: toOptionalNumber(form.bloodBoil),
        engorge: toOptionalNumber(form.engorge),
        demonicMastery: toOptionalNumber(form.demonicMastery),
        minusEnemyMagicResist: toOptionalNumber(form.minusEnemyMagicResist),
        flameWave: toOptionalNumber(form.flameWave),
        ringOfFire: toOptionalNumber(form.ringOfFire),
        summonTainted: toOptionalNumber(form.summonTainted),
        sockets: toOptionalNumber(form.sockets),
        poisonAndBoneSkills: toOptionalNumber(form.poisonAndBoneSkills),
        energy: toOptionalNumber(form.energy),
        coldSkillDamage: toOptionalNumber(form.coldSkillDamage),
        allSkills: toOptionalNumber(form.allSkills),
        lightningAbsorb: toOptionalNumber(form.lightningAbsorb),
        vitality: toOptionalNumber(form.vitality)
      }),
    [ethereal, form, itemId, mode, ruleset]
  );

  const handleReset = () => {
    setItemId(defaultItemId);
    setForm(emptyForm);
    setEthereal(false);
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[1.02fr_0.98fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Unique Triage</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Identify the unique, then check only meaningful rolls</h2>
          </div>
          <div className="flex items-center gap-2">
            <Pill active>{mode}</Pill>
            <Pill>{ruleset === "warlock" ? "Warlock" : "LOD"}</Pill>
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
          <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            Unique item
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
            >
              {availableUniqueItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {selectedItem?.etherealRelevant ? (
            <label className="flex items-center gap-3 rounded-xl border border-border bg-black/10 px-3 py-2.5 text-sm text-zinc-200 md:col-span-2">
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
            <div className="rounded-xl border border-dashed border-border bg-black/10 px-3 py-2.5 text-sm leading-5 text-zinc-400 md:col-span-2">
              This unique is mostly judged by whether it is a staple at all. No roll input is needed for the MVP.
            </div>
          )}
        </div>

        {selectedItem ? (
          <div className="mt-4 rounded-2xl border border-amber-900/50 bg-gradient-to-br from-black/35 via-amber-950/15 to-black/15 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">Identified Unique</p>
            <h3 className="mt-1 text-xl font-black text-white">{selectedItem.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill>Unique {selectedItem.category}</Pill>
              {selectedItem.ruleset === "warlock" ? <Pill>Warlock-only item</Pill> : null}
              <Pill>{selectedItem.liquidity} liquidity</Pill>
              <Pill>{mode === "SCNL" ? selectedItem.scnlPriority : selectedItem.sclPriority}</Pill>
            </div>
            <p className="mt-2 text-sm leading-5 text-zinc-300">{selectedItem.notes}</p>
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
