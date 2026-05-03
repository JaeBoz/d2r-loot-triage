"use client";

import { useMemo, useRef, useState } from "react";
import { clampAffixInputValue, getAffixValueCap } from "@/data/affix-guardrails";
import type { MechanicsAffixItemType } from "@/data/mechanics-affixes";
import { Pill } from "@/components/ui";
import { VarianceAffixDefinition, VarianceAffixKey } from "@/lib/types";

interface AffixEntryPanelProps<TAffixKey extends VarianceAffixKey> {
  coreAffixes: Array<VarianceAffixDefinition & { key: TAffixKey }>;
  optionalAffixes: Array<VarianceAffixDefinition & { key: TAffixKey }>;
  values: Record<TAffixKey, string>;
  activeOptionalKeys: TAffixKey[];
  guidance: string;
  capItemType?: MechanicsAffixItemType;
  onValueChange: (key: TAffixKey, value: string) => void;
  onAddAffix: (key: TAffixKey) => void;
  onRemoveAffix: (key: TAffixKey) => void;
}

function renderImpactTag(impactTier: VarianceAffixDefinition["impactTier"]) {
  if (impactTier === "core") return <Pill active>Core</Pill>;
  if (impactTier === "secondary") return <Pill>Secondary</Pill>;
  return <Pill>Low impact</Pill>;
}

export function AffixEntryPanel<TAffixKey extends VarianceAffixKey>({
  coreAffixes,
  optionalAffixes,
  values,
  activeOptionalKeys,
  guidance,
  capItemType,
  onValueChange,
  onAddAffix,
  onRemoveAffix
}: AffixEntryPanelProps<TAffixKey>) {
  const [query, setQuery] = useState("");
  const focusedAffixKeyRef = useRef<TAffixKey | null>(null);

  const handleAffixFocus = (key: TAffixKey) => {
    const previousKey = focusedAffixKeyRef.current;
    if (previousKey && previousKey !== key) {
      onValueChange(
        previousKey,
        clampAffixInputValue(previousKey, values[previousKey] ?? "", capItemType)
      );
    }

    focusedAffixKeyRef.current = key;
  };

  const handleAffixBlur = (key: TAffixKey, value: string) => {
    onValueChange(key, clampAffixInputValue(key, value, capItemType));
    if (focusedAffixKeyRef.current === key) {
      focusedAffixKeyRef.current = null;
    }
  };

  const handleAffixKeyDown = (key: TAffixKey, value: string, keyboardKey: string) => {
    if (keyboardKey === "Tab" || keyboardKey === "Enter") {
      onValueChange(key, clampAffixInputValue(key, value, capItemType));
    }
  };

  const activeOptionalAffixes = useMemo(
    () => activeOptionalKeys.map((key) => optionalAffixes.find((affix) => affix.key === key)).filter(Boolean) as Array<VarianceAffixDefinition & { key: TAffixKey }>,
    [activeOptionalKeys, optionalAffixes]
  );

  const searchableAffixes = useMemo(() => {
    const activeKeys = new Set(activeOptionalKeys);
    const normalizedQuery = query.trim().toLowerCase();

    return optionalAffixes.filter((affix) => {
      if (activeKeys.has(affix.key)) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      return affix.label.toLowerCase().includes(normalizedQuery);
    });
  }, [activeOptionalKeys, optionalAffixes, query]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {coreAffixes.map((affix) => (
          <label key={affix.key} className="grid gap-2 text-sm text-zinc-300">
            <span className="flex items-center justify-between gap-2">
              <span>{affix.label}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{affix.impactTier}</span>
            </span>
            <input
              className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
              type="number"
              min={0}
              max={getAffixValueCap(affix.key, capItemType)}
              inputMode="numeric"
              placeholder="Blank"
              value={values[affix.key] ?? ""}
              onChange={(event) => onValueChange(affix.key, event.target.value)}
              onMouseDown={() => handleAffixFocus(affix.key)}
              onFocus={() => handleAffixFocus(affix.key)}
              onKeyDown={(event) => handleAffixKeyDown(affix.key, event.currentTarget.value, event.key)}
              onBlur={(event) => handleAffixBlur(affix.key, event.target.value)}
              aria-label={affix.label}
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-black/15 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Optional Affixes</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">{guidance}</p>
          </div>
          <div className="w-full max-w-sm">
            <input
              className="w-full rounded-xl border border-border bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-accent"
              type="text"
              placeholder="+ Add affix"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search optional affixes"
            />
          </div>
        </div>

        {activeOptionalAffixes.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {activeOptionalAffixes.map((affix) => (
              <label key={affix.key} className="grid gap-2 text-sm text-zinc-300">
                <span className="flex items-center justify-between gap-2">
                  <span>{affix.label}</span>
                  <button
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-200"
                    onClick={() => onRemoveAffix(affix.key)}
                    type="button"
                  >
                    Remove
                  </button>
                </span>
                <input
                  className="rounded-xl border border-border bg-black/20 px-3 py-2 text-white outline-none transition focus:border-accent"
                  type="number"
                  min={0}
                  max={getAffixValueCap(affix.key, capItemType)}
                  inputMode="numeric"
                  placeholder="Blank"
                  value={values[affix.key] ?? ""}
                  onChange={(event) => onValueChange(affix.key, event.target.value)}
                  onMouseDown={() => handleAffixFocus(affix.key)}
                  onFocus={() => handleAffixFocus(affix.key)}
                  onKeyDown={(event) => handleAffixKeyDown(affix.key, event.currentTarget.value, event.key)}
                  onBlur={(event) => handleAffixBlur(affix.key, event.target.value)}
                  aria-label={affix.label}
                />
              </label>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {searchableAffixes.slice(0, 10).map((affix) => (
            <button
              key={affix.key}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              onClick={() => {
                onAddAffix(affix.key);
                setQuery("");
              }}
              type="button"
            >
              <span>{affix.label}</span>
              {renderImpactTag(affix.impactTier)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
