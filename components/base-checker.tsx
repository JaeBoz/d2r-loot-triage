"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Pill } from "@/components/ui";
import { ResultPanel } from "@/components/result-panel";
import { baseItems } from "@/lib/data";
import { evaluateBase } from "@/lib/base-checker";
import { GameMode } from "@/lib/types";

const SUPERIOR_ROLL_CAP = 15;

function matchesBaseSearch(search: string, item: (typeof baseItems)[number]) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return (
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
    item.runewordUseCases.some((useCase) => useCase.toLowerCase().includes(query))
  );
}

function clampSuperiorRoll(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return undefined;
  }

  return Math.min(SUPERIOR_ROLL_CAP, Math.max(0, numericValue));
}

export function BaseChecker({ mode }: { mode: GameMode }) {
  const defaultItemId = baseItems[0]?.id ?? "";
  const defaultItem = baseItems[0];
  const [itemId, setItemId] = useState(defaultItemId);
  const [searchTerm, setSearchTerm] = useState(defaultItem?.name ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sockets, setSockets] = useState<number>(defaultItem?.validSockets[0] ?? 0);
  const [ethereal, setEthereal] = useState(false);
  const [superior, setSuperior] = useState(false);
  const [defenseOrEd, setDefenseOrEd] = useState<number | undefined>(undefined);
  const [superiorEnhancedDamage, setSuperiorEnhancedDamage] = useState<number | undefined>(undefined);
  const [superiorEnhancedDefense, setSuperiorEnhancedDefense] = useState<number | undefined>(undefined);
  const [durabilityBonus, setDurabilityBonus] = useState<number | undefined>(undefined);
  const [allRes, setAllRes] = useState<number | undefined>(undefined);

  const selectedItem = useMemo(() => baseItems.find((item) => item.id === itemId), [itemId]);
  const filteredItems = useMemo(
    () => baseItems.filter((item) => matchesBaseSearch(searchTerm, item)).slice(0, 10),
    [searchTerm]
  );

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setSearchTerm(selectedItem.name);
    setSockets(selectedItem.validSockets[0] ?? 0);
    setEthereal(false);
    setSuperior(false);
    setDefenseOrEd(undefined);
    setSuperiorEnhancedDamage(undefined);
    setSuperiorEnhancedDefense(undefined);
    setDurabilityBonus(undefined);
    setAllRes(undefined);
  }, [itemId, selectedItem]);

  const result = useMemo(
    () =>
      evaluateBase({
        mode,
        itemId,
        sockets,
        ethereal,
        superior,
        defenseOrEd,
        superiorEnhancedDamage,
        superiorEnhancedDefense,
        durabilityBonus,
        allRes
      }),
    [allRes, defenseOrEd, durabilityBonus, ethereal, itemId, mode, sockets, superior, superiorEnhancedDamage, superiorEnhancedDefense]
  );

  const isCircletFamily = selectedItem?.tags.includes("circlet") ?? false;
  const isWeaponBase = selectedItem?.category === "Weapon" || selectedItem?.category === "Polearm";
  const isArmorLikeBase = selectedItem?.category === "Armor" || selectedItem?.category === "Shield" || selectedItem?.category === "Helm";
  const showAllResInput = selectedItem?.tags.includes("paladin") ?? false;
  const showDefenseInput = selectedItem?.category === "Armor" || isCircletFamily;
  const showSuperiorEnhancedDamageInput = superior && isWeaponBase;
  const showSuperiorEnhancedDefenseInput = superior && isArmorLikeBase;
  const showDurabilityInput = superior && (isWeaponBase || isArmorLikeBase);
  const showSuperiorToggle = (selectedItem?.socketSensitive ?? false) || isCircletFamily;
  const showEtherealToggle = selectedItem?.etherealAllowed ?? false;

  const handleReset = () => {
    setItemId(defaultItemId);
    setSearchTerm(defaultItem?.name ?? "");
    setPickerOpen(false);
    setSockets(defaultItem?.validSockets[0] ?? 0);
    setEthereal(false);
    setSuperior(false);
    setDefenseOrEd(undefined);
    setSuperiorEnhancedDamage(undefined);
    setSuperiorEnhancedDefense(undefined);
    setDurabilityBonus(undefined);
    setAllRes(undefined);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Base Checker</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Trade-relevant base checks</h2>
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
          <div className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
            <label htmlFor="base-search">Base item</label>
            <div className="relative">
              <input
                id="base-search"
                className="w-full rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                type="text"
                value={searchTerm}
                placeholder="Search base, tag, or runeword"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPickerOpen(true);
                }}
                onFocus={() => setPickerOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setPickerOpen(false), 100);
                }}
                aria-label="Search base item"
              />

              {pickerOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-10 max-h-72 overflow-auto rounded-2xl border border-border bg-zinc-950/95 p-2 shadow-2xl">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full rounded-xl px-3 py-3 text-left transition ${
                          item.id === itemId
                            ? "bg-accent/15 text-white"
                            : "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`}
                        onMouseDown={() => {
                          setItemId(item.id);
                          setSearchTerm(item.name);
                          setPickerOpen(false);
                        }}
                        type="button"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.category}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-zinc-400">
                          {item.tags.slice(0, 3).join(" | ")}
                          {item.tags.length > 0 ? " | " : ""}
                          {item.runewordUseCases.slice(0, 2).join(", ")}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl px-3 py-3 text-sm text-zinc-400">No matching bases in the curated list.</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <label className="grid gap-2 text-sm text-zinc-300">
            Sockets
            <select
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={String(sockets)}
              onChange={(event) => setSockets(Number(event.target.value))}
              aria-label="Sockets"
            >
              {(selectedItem?.validSockets ?? [0]).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          {showDefenseInput ? (
            <label className="grid gap-2 text-sm text-zinc-300">
              Defense
              <input
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Blank"
                value={defenseOrEd ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setDefenseOrEd(value === "" ? undefined : Number(value));
                }}
                aria-label="Defense"
              />
            </label>
          ) : null}

          {showDurabilityInput ? (
            <>
              {showSuperiorEnhancedDamageInput ? (
                <label className="grid gap-2 text-sm text-zinc-300">
                  Superior ED %
                  <input
                    className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                    type="number"
                    min={0}
                    max={SUPERIOR_ROLL_CAP}
                    inputMode="numeric"
                    placeholder="Blank"
                    value={superiorEnhancedDamage ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSuperiorEnhancedDamage(value === "" ? undefined : Number(value));
                    }}
                    onBlur={(event) => setSuperiorEnhancedDamage(clampSuperiorRoll(event.target.value))}
                    aria-label="Superior enhanced damage percentage"
                  />
                </label>
              ) : null}

              {showSuperiorEnhancedDefenseInput ? (
                <label className="grid gap-2 text-sm text-zinc-300">
                  Superior EDef %
                  <input
                    className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                    type="number"
                    min={0}
                    max={SUPERIOR_ROLL_CAP}
                    inputMode="numeric"
                    placeholder="Blank"
                    value={superiorEnhancedDefense ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSuperiorEnhancedDefense(value === "" ? undefined : Number(value));
                    }}
                    onBlur={(event) => setSuperiorEnhancedDefense(clampSuperiorRoll(event.target.value))}
                    aria-label="Superior enhanced defense percentage"
                  />
                </label>
              ) : null}

            <label className="grid gap-2 text-sm text-zinc-300">
              Superior durability %
              <input
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Blank"
                value={durabilityBonus ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setDurabilityBonus(value === "" ? undefined : Number(value));
                }}
                onBlur={(event) => setDurabilityBonus(clampSuperiorRoll(event.target.value))}
                aria-label="Superior durability percentage"
              />
            </label>
            </>
          ) : null}

          {showAllResInput ? (
            <label className="grid gap-2 text-sm text-zinc-300">
              Paladin all resist
              <input
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                type="number"
                min={0}
                max={45}
                inputMode="numeric"
                placeholder="Blank"
                value={allRes ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setAllRes(value === "" ? undefined : Number(value));
                }}
                aria-label="Paladin all resist"
              />
            </label>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {showEtherealToggle ? (
            <label className="flex items-center gap-2 rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-zinc-200">
              <input checked={ethereal} type="checkbox" onChange={(event) => setEthereal(event.target.checked)} />
              Ethereal
            </label>
          ) : null}
          {showSuperiorToggle ? (
            <label className="flex items-center gap-2 rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-zinc-200">
              <input checked={superior} type="checkbox" onChange={(event) => setSuperior(event.target.checked)} />
              Superior
            </label>
          ) : null}
        </div>

        {selectedItem && !pickerOpen ? (
          <div className="mt-6 rounded-2xl border border-border bg-black/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{selectedItem.category}</Pill>
              <Pill>{selectedItem.levelBand}</Pill>
              <Pill>{selectedItem.ethPriority} eth</Pill>
              {selectedItem.tags.slice(0, 2).map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{selectedItem.notes}</p>
            <p className="mt-3 text-xs text-zinc-400">
              Valid sockets: {selectedItem.validSockets.join(", ")} | Desired sockets: {selectedItem.desiredSockets.join(", ")} | Use cases:{" "}
              {selectedItem.runewordUseCases.join(", ")}
            </p>
            {superior ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-amber-100">
                {typeof superiorEnhancedDamage === "number" && superiorEnhancedDamage > 0 ? <Pill>{superiorEnhancedDamage} ED superior roll</Pill> : null}
                {typeof superiorEnhancedDefense === "number" && superiorEnhancedDefense > 0 ? <Pill>{superiorEnhancedDefense} EDef superior roll</Pill> : null}
                {typeof durabilityBonus === "number" && durabilityBonus > 0 ? <Pill>{durabilityBonus} durability superior roll</Pill> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>

      <ResultPanel
        result={result}
        hasInput={!pickerOpen}
        itemType="base"
        emptyMessage="Choose a base from the search results to refresh the trade-value check."
      />
    </div>
  );
}
