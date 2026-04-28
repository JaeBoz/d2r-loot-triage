"use client";

import { useState } from "react";
import { AmuletChecker } from "@/components/amulet-checker";
import { BaseChecker } from "@/components/base-checker";
import { BootsChecker } from "@/components/boots-checker";
import { CharmChecker } from "@/components/charm-checker";
import { CircletChecker } from "@/components/circlet-checker";
import { GloveChecker } from "@/components/glove-checker";
import { JewelChecker } from "@/components/jewel-checker";
import { PlaceholderCategoryPanel } from "@/components/placeholder-category-panel";
import { RingChecker } from "@/components/ring-checker";
import { RuneGuide } from "@/components/rune-guide";
import { UniqueChecker } from "@/components/unique-checker";
import { Card, Pill } from "@/components/ui";
import { CATEGORY_TABS, MODE_OPTIONS, RULESET_OPTIONS } from "@/lib/constants";
import { GameMode, ItemCategory, Ruleset } from "@/lib/types";

const quickIdTargets = [
  "Rare Amulets: +2 skills + FCR -> always check",
  "Circlets: 2/20 -> jackpot potential",
  "Jewels: IAS + ED -> check",
  "Charms: Skiller + life -> high value",
  "Bases: Eth elite polearms -> pick up",
  "Gloves: 2/20 -> always check"
];

export function AppShell() {
  const [ruleset, setRuleset] = useState<Ruleset>("lod");
  const [mode, setMode] = useState<GameMode>("SCNL");
  const [category, setCategory] = useState<ItemCategory>("Bases");
  const activeRulesetLabel = RULESET_OPTIONS.find((option) => option.value === ruleset)?.label ?? "LOD";

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-3 px-3 py-4 sm:px-5 lg:px-8">
      <header>
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill active>D2R Loot Triage</Pill>
              <Pill>{activeRulesetLabel}</Pill>
              <Pill>{mode}</Pill>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                className="rounded-xl border border-border bg-black/20 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
                href="https://forms.gle/TPfgMKG5xeRPPZqw6"
                target="_blank"
                rel="noreferrer noopener"
              >
                Report Evaluation Issue
              </a>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {RULESET_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                  ruleset === option.value
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-black/20 text-zinc-300 hover:border-amber-500/60 hover:text-white"
                }`}
                onClick={() => setRuleset(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                  mode === option.value
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-black/20 text-zinc-300 hover:border-amber-500/60 hover:text-white"
                }`}
                onClick={() => setMode(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>
      </header>

      <Card>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                category === tab
                  ? "bg-amber-100 text-zinc-950 shadow-[0_0_18px_rgba(245,158,11,0.18)]"
                  : "border border-border bg-black/20 text-zinc-300 hover:border-amber-500/60 hover:text-white"
              }`}
              onClick={() => setCategory(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </Card>

      <Card className="py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill active>Quick ID Targets</Pill>
          {quickIdTargets.map((target) => (
            <span key={target} className="rounded-xl border border-border bg-black/20 px-3 py-1.5 text-xs font-semibold text-zinc-200">
              {target}
            </span>
          ))}
        </div>
      </Card>

      {category === "Bases" ? <BaseChecker mode={mode} /> : null}
      {category === "Circlets" ? <CircletChecker mode={mode} /> : null}
      {category === "Runes" ? <RuneGuide mode={mode} /> : null}
      {category === "Charms" ? <CharmChecker mode={mode} /> : null}
      {category === "Jewels" ? <JewelChecker mode={mode} /> : null}
      {category === "Rings" ? <RingChecker mode={mode} /> : null}
      {category === "Amulets" ? <AmuletChecker mode={mode} /> : null}
      {category === "Boots" ? <BootsChecker mode={mode} /> : null}
      {category === "Gloves" ? <GloveChecker mode={mode} /> : null}
      {category === "Uniques" ? <UniqueChecker mode={mode} ruleset={ruleset} /> : null}
      {category !== "Bases" &&
      category !== "Circlets" &&
      category !== "Runes" &&
      category !== "Charms" &&
      category !== "Jewels" &&
      category !== "Rings" &&
      category !== "Amulets" &&
      category !== "Boots" &&
      category !== "Gloves" &&
      category !== "Uniques" ? (
        <PlaceholderCategoryPanel category={category} />
      ) : null}
    </main>
  );
}
