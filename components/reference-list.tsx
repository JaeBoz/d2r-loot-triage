"use client";

import { useMemo, useState } from "react";
import {
  magicItemsWorthChecking,
  marketTrendsByMode,
  quickIdTargets,
  referenceGuide,
  ReferenceTier,
  runeTradeGuide
} from "@/data/reference-guide";
import { Card, Pill } from "@/components/ui";
import { MODE_OPTIONS } from "@/lib/constants";
import { baseReferenceByMode } from "@/lib/data";
import { GameMode, ItemCategory } from "@/lib/types";

const sectionOrder: ReferenceTier[] = [
  "Always Check",
  "High Value / High Liquidity",
  "Conditional Value (depends on rolls)",
  "Usually Ignore"
];

const categoryOrder: Array<Extract<ItemCategory, "Bases" | "Charms" | "Jewels" | "Uniques">> = [
  "Bases",
  "Charms",
  "Jewels",
  "Uniques"
];

const tierStyles: Record<ReferenceTier, string> = {
  "Always Check": "border-sky-500/30 bg-sky-500/5",
  "High Value / High Liquidity": "border-emerald-500/30 bg-emerald-500/5",
  "Conditional Value (depends on rolls)": "border-amber-500/30 bg-amber-500/5",
  "Usually Ignore": "border-zinc-700 bg-zinc-900/40"
};

export function ReferenceList() {
  const [mode, setMode] = useState<GameMode>("SCNL");
  const modeSnapshot = useMemo(() => baseReferenceByMode[mode], [mode]);
  const marketTrends = useMemo(() => marketTrendsByMode[mode], [mode]);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex flex-wrap gap-2">
            <Pill active>Reference Guide</Pill>
            <Pill>Curated Cheat Sheet</Pill>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">What should I care about?</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  mode === option.value
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-black/20 text-zinc-300 hover:border-zinc-500 hover:text-white"
                }`}
                onClick={() => setMode(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{mode} Snapshot</p>
          <h2 className="mt-2 text-xl font-bold text-white">Mode context</h2>
          <div className="mt-4 grid gap-3">
            {modeSnapshot.focus.map((entry) => (
              <div key={entry} className="rounded-xl border border-border bg-black/20 p-3 text-sm leading-6 text-zinc-200">
                {entry}
              </div>
            ))}
          </div>
        </Card>
      </header>

      {sectionOrder.map((tier) => (
        <Card key={tier} className={tierStyles[tier]}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Pickup Tier</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{tier}</h2>
            </div>
            <Pill active={tier === "Always Check" || tier === "High Value / High Liquidity"}>{mode}</Pill>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {categoryOrder.map((category) => {
              const entries = referenceGuide[tier].filter((entry) => entry.category === category);

              if (entries.length === 0) {
                return null;
              }

              return (
                <section key={category} className="rounded-2xl border border-border bg-black/20 p-4">
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                  <div className="mt-4 grid gap-3">
                    {entries.map((entry) => (
                      <article key={`${category}-${entry.title}`} className="rounded-xl border border-border bg-black/20 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h4 className="text-sm font-semibold text-white">{entry.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <Pill key={tag}>{tag}</Pill>
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-zinc-300">{entry.note}</p>
                        {entry.modeHint?.[mode] ? (
                          <p className="mt-3 text-xs leading-5 text-zinc-400">{entry.modeHint[mode]}</p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </Card>
      ))}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Mode Guide</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{mode} Market Trends to look out for</h2>
          </div>
          <Pill active>{mode}</Pill>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {marketTrends.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-border bg-black/20 p-4">
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{entry.note}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rune Guide</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Rune Trade Guide</h2>
          </div>
          <Pill>Static Guide</Pill>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {runeTradeGuide.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-border bg-black/20 p-4">
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{entry.note}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Static Guide</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Magic Item Keep Checks</h2>
          </div>
          <Pill>Keep Check</Pill>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {magicItemsWorthChecking.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-border bg-black/20 p-4">
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{entry.note}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Static Guide</p>
            <h2 className="mt-2 text-xl font-bold text-white">Quick ID Targets</h2>
          </div>
          <Pill>Hit or Junk</Pill>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
          Narrow jackpot ID targets only. These are items where the winning outcomes are obvious and most misses are instant junk.
        </p>
        <div className="mt-4 grid gap-2">
          {quickIdTargets.map((entry) => (
            <details key={entry.itemType} className="group rounded-xl border border-border bg-black/20 px-4 py-3">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{entry.itemType}</p>
                  <p className="mt-1 text-xs text-zinc-400">{entry.whyIdIt}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>{entry.demand} Demand</Pill>
                </div>
              </summary>
              <div className="mt-3 grid gap-3 border-t border-white/5 pt-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">What Wins</p>
                  <div className="mt-2 grid gap-2">
                    {entry.whatWins.map((pattern) => (
                      <div key={pattern} className="rounded-xl border border-border bg-black/20 px-3 py-2 text-sm leading-6 text-zinc-200">
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>
                {entry.usuallyJunkUnless ? (
                  <div className="rounded-xl border border-border bg-black/20 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Usually Junk Unless</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{entry.usuallyJunkUnless}</p>
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </Card>
    </main>
  );
}
