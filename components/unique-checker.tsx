"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { ResultPanel } from "@/components/result-panel";
import { evaluateUnique, isUniqueAvailableInRuleset, uniqueItems } from "@/lib/unique-checker";
import { GameMode, Ruleset, UniqueRollField, UniqueSelectField } from "@/lib/types";

const fieldLabels: Record<UniqueRollField, string> = {
  magicFind: "Magic Find",
  fasterCastRate: "Faster Cast Rate",
  fasterRunWalk: "Faster Run/Walk",
  fasterHitRecovery: "Faster Hit Recovery",
  damage: "Damage",
  defense: "Defense",
  dexterity: "Dexterity",
  attackRating: "Attack Rating",
  allResist: "All Resist",
  minusEnemyFireResist: "-Enemy Fire Res",
  minusEnemyColdResist: "-Enemy Cold Res",
  minusEnemyLightningResist: "-Enemy Lightning Res",
  minusEnemyPoisonResist: "-Enemy Poison Res",
  lightningSkillDamage: "Lightning Damage",
  fireSkillDamage: "Fire Skill Damage",
  elementalSkillDamage: "Elemental Skill Damage",
  enhancedDamage: "Enhanced Damage",
  enhancedDefense: "Enhanced Defense",
  strength: "Strength",
  lifeLeech: "Life Leech",
  damageReduction: "Damage Reduction",
  fireResist: "Fire Resist",
  lightningResist: "Lightning Resist",
  manaLeech: "Mana Leech",
  maxLifePercent: "Maximum Life",
  maxManaPercent: "Maximum Mana",
  magicSkillDamage: "Magic Skill Damage",
  magicDamageReduced: "Magic Damage Reduced",
  extraGold: "Extra Gold",
  manaAfterKill: "Mana After Each Kill",
  lifeAfterKill: "Life After Each Kill",
  apocalypse: "Apocalypse",
  bindDemon: "Bind Demon",
  consume: "Consume",
  bloodBoil: "Blood Boil",
  bloodOath: "Blood Oath",
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
  coldAbsorb: "Cold Absorb",
  allSkills: "All Skills",
  lightningAbsorb: "Lightning Absorb",
  vitality: "Vitality"
};

function getFieldLabel(field: UniqueRollField, selectedItem?: (typeof uniqueItems)[number]) {
  return selectedItem?.rollDefinitions?.find((definition) => definition.key === field)?.label ?? fieldLabels[field];
}

function getRollDefinition(field: UniqueRollField, selectedItem?: (typeof uniqueItems)[number]) {
  return selectedItem?.rollDefinitions?.find((definition) => definition.key === field);
}

type UniqueFormState = Record<UniqueRollField, string>;
type UniqueSelectFormState = Record<UniqueSelectField, string>;

const emptyForm: UniqueFormState = {
  magicFind: "",
  fasterCastRate: "",
  fasterRunWalk: "",
  fasterHitRecovery: "",
  damage: "",
  defense: "",
  dexterity: "",
  attackRating: "",
  allResist: "",
  minusEnemyFireResist: "",
  minusEnemyColdResist: "",
  minusEnemyLightningResist: "",
  minusEnemyPoisonResist: "",
  lightningSkillDamage: "",
  fireSkillDamage: "",
  elementalSkillDamage: "",
  enhancedDamage: "",
  enhancedDefense: "",
  strength: "",
  lifeLeech: "",
  damageReduction: "",
  fireResist: "",
  lightningResist: "",
  manaLeech: "",
  maxLifePercent: "",
  maxManaPercent: "",
  magicSkillDamage: "",
  magicDamageReduced: "",
  extraGold: "",
  manaAfterKill: "",
  lifeAfterKill: "",
  apocalypse: "",
  bindDemon: "",
  consume: "",
  bloodBoil: "",
  bloodOath: "",
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
  coldAbsorb: "",
  allSkills: "",
  lightningAbsorb: "",
  vitality: ""
};

const emptySelectForm: UniqueSelectFormState = {
  ormusSkillQuality: "",
  rainbowFacetElement: ""
};

function toOptionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function clampUniqueRollInput(value: string, field: UniqueRollField, selectedItem?: (typeof uniqueItems)[number]) {
  if (value.trim() === "") {
    return "";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return "";
  }

  const definition = getRollDefinition(field, selectedItem);
  if (!definition) {
    return String(Math.max(0, numericValue));
  }

  return String(Math.min(definition.max, Math.max(definition.min, numericValue)));
}

function displayUniqueNote(note: string) {
  return note.replace(/Warlock-only item/gi, "Reign of the Warlock item");
}

export function UniqueChecker({ mode, ruleset }: { mode: GameMode; ruleset: Ruleset }) {
  const availableUniqueItems = useMemo(
    () => uniqueItems.filter((item) => isUniqueAvailableInRuleset(item, ruleset)),
    [ruleset]
  );
  const defaultItemId = availableUniqueItems[0]?.id ?? "";
  const [itemId, setItemId] = useState(defaultItemId);
  const [form, setForm] = useState<UniqueFormState>(emptyForm);
  const [selectForm, setSelectForm] = useState<UniqueSelectFormState>(emptySelectForm);
  const [ethereal, setEthereal] = useState(false);

  useEffect(() => {
    setItemId(defaultItemId);
    setForm(emptyForm);
    setSelectForm(emptySelectForm);
    setEthereal(false);
  }, [defaultItemId, ruleset]);

  const selectedItem = useMemo(
    () => availableUniqueItems.find((item) => item.id === itemId),
    [availableUniqueItems, itemId]
  );
  const hasInput =
    itemId !== defaultItemId ||
    ethereal ||
    Object.values(form).some((value) => value.trim() !== "") ||
    Object.values(selectForm).some((value) => value.trim() !== "");

  const result = useMemo(
    () =>
      evaluateUnique({
        mode,
        ruleset,
        itemId,
        ethereal,
        magicFind: toOptionalNumber(form.magicFind),
        fasterCastRate: toOptionalNumber(form.fasterCastRate),
        fasterRunWalk: toOptionalNumber(form.fasterRunWalk),
        fasterHitRecovery: toOptionalNumber(form.fasterHitRecovery),
        damage: toOptionalNumber(form.damage),
        defense: toOptionalNumber(form.defense),
        dexterity: toOptionalNumber(form.dexterity),
        attackRating: toOptionalNumber(form.attackRating),
        allResist: toOptionalNumber(form.allResist),
        minusEnemyFireResist: toOptionalNumber(form.minusEnemyFireResist),
        minusEnemyColdResist: toOptionalNumber(form.minusEnemyColdResist),
        minusEnemyLightningResist: toOptionalNumber(form.minusEnemyLightningResist),
        minusEnemyPoisonResist: toOptionalNumber(form.minusEnemyPoisonResist),
        lightningSkillDamage: toOptionalNumber(form.lightningSkillDamage),
        fireSkillDamage: toOptionalNumber(form.fireSkillDamage),
        elementalSkillDamage: toOptionalNumber(form.elementalSkillDamage),
        enhancedDamage: toOptionalNumber(form.enhancedDamage),
        enhancedDefense: toOptionalNumber(form.enhancedDefense),
        strength: toOptionalNumber(form.strength),
        lifeLeech: toOptionalNumber(form.lifeLeech),
        damageReduction: toOptionalNumber(form.damageReduction),
        fireResist: toOptionalNumber(form.fireResist),
        lightningResist: toOptionalNumber(form.lightningResist),
        manaLeech: toOptionalNumber(form.manaLeech),
        maxLifePercent: toOptionalNumber(form.maxLifePercent),
        maxManaPercent: toOptionalNumber(form.maxManaPercent),
        magicSkillDamage: toOptionalNumber(form.magicSkillDamage),
        magicDamageReduced: toOptionalNumber(form.magicDamageReduced),
        extraGold: toOptionalNumber(form.extraGold),
        manaAfterKill: toOptionalNumber(form.manaAfterKill),
        lifeAfterKill: toOptionalNumber(form.lifeAfterKill),
        apocalypse: toOptionalNumber(form.apocalypse),
        bindDemon: toOptionalNumber(form.bindDemon),
        consume: toOptionalNumber(form.consume),
        bloodBoil: toOptionalNumber(form.bloodBoil),
        bloodOath: toOptionalNumber(form.bloodOath),
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
        coldAbsorb: toOptionalNumber(form.coldAbsorb),
        allSkills: toOptionalNumber(form.allSkills),
        lightningAbsorb: toOptionalNumber(form.lightningAbsorb),
        vitality: toOptionalNumber(form.vitality),
        ormusSkillQuality: selectForm.ormusSkillQuality || undefined,
        rainbowFacetElement: selectForm.rainbowFacetElement || undefined
      }),
    [ethereal, form, itemId, mode, ruleset, selectForm]
  );

  const handleReset = () => {
    setItemId(defaultItemId);
    setForm(emptyForm);
    setSelectForm(emptySelectForm);
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
              onChange={(event) => {
                setItemId(event.target.value);
                setSelectForm(emptySelectForm);
              }}
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

          {selectedItem?.selectDefinitions?.map((definition) => (
            <label key={definition.key} className="grid gap-2 text-sm text-zinc-300">
              {definition.label}
              <select
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                value={selectForm[definition.key]}
                onChange={(event) =>
                  setSelectForm((current) => ({
                    ...current,
                    [definition.key]: event.target.value
                  }))
                }
              >
                {definition.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}

          {selectedItem?.hasVariableRolls ? (
            selectedItem.keyRollFields.map((field) => {
              const definition = getRollDefinition(field, selectedItem);

              return (
                <label key={field} className="grid gap-2 text-sm text-zinc-300">
                  {getFieldLabel(field, selectedItem)}
                  <input
                    className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                    type="number"
                    min={definition?.min ?? 0}
                    max={definition?.max}
                    inputMode="numeric"
                    placeholder="Blank"
                    value={form[field]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: event.target.value
                      }))
                    }
                    onBlur={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: clampUniqueRollInput(event.target.value, field, selectedItem)
                      }))
                    }
                    aria-label={getFieldLabel(field, selectedItem)}
                  />
                </label>
              );
            })
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
              {selectedItem.ruleset === "warlock" ? <Pill>Reign of the Warlock item</Pill> : null}
              <Pill>{selectedItem.liquidity} liquidity</Pill>
              <Pill>{mode === "SCNL" ? selectedItem.scnlPriority : selectedItem.sclPriority}</Pill>
            </div>
            <p className="mt-2 text-sm leading-5 text-zinc-300">{displayUniqueNote(selectedItem.notes)}</p>
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
