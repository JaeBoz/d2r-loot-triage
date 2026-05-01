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
  {
    category: "Rings",
    hint: "FCR drives caster value",
    targets: ["10 FCR + res/stats", "10 FCR + dual res"]
  },
  {
    category: "Amulets",
    hint: "+skills need support",
    targets: ["+2 skills + FCR", "+2 skills + life/res"]
  },
  {
    category: "Gloves",
    hint: "IAS is the anchor",
    targets: ["+3 Jav / 20 IAS", "+2 Jav / 20 IAS"]
  },
  {
    category: "Boots",
    hint: "FRW is key",
    targets: ["FRW + dual/triple res", "FRW + FHR + res"]
  },
  {
    category: "Charms",
    hint: "Small charms and skillers",
    targets: ["7 MF (SC)", "451 poison (SC)", "Skiller (+life best)"]
  },
  {
    category: "Jewels",
    hint: "IAS or ED shells",
    targets: ["15 IAS", "IAS + ED", "ED + -15 req"]
  },
  {
    category: "Circlets",
    hint: "Skills plus support",
    targets: ["2/20 + support", "2os + skills/support"]
  },
  {
    category: "Bases",
    hint: "Sockets and eth matter",
    targets: ["4os/5os elite bases", "eth merc bases"]
  }
];

export function AppShell() {
  const [ruleset, setRuleset] = useState<Ruleset>("lod");
  const [mode, setMode] = useState<GameMode>("SCNL");
  const [category, setCategory] = useState<ItemCategory>("Bases");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [quickIdOpen, setQuickIdOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-2.5 px-3 py-3 sm:px-5 lg:px-8">
      <header>
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Pill active>D2R Loot Triage</Pill>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                className="rounded-xl border border-border bg-black/20 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
                href="https://forms.gle/TPfgMKG5xeRPPZqw6"
                target="_blank"
                rel="noreferrer noopener"
              >
                Report Evaluation Issue
              </a>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
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

          <div className="mt-1.5 flex flex-wrap gap-1.5">
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

      <Card className="py-2.5 opacity-95">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>How this works</Pill>
            <span className="text-xs font-semibold text-zinc-500">Fast loot triage basics</span>
          </div>
          <button
            aria-expanded={howItWorksOpen}
            className="rounded-xl border border-border bg-black/20 px-3 py-1.5 text-xs font-bold text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
            onClick={() => setHowItWorksOpen((open) => !open)}
            type="button"
          >
            {howItWorksOpen ? "Hide" : "Show"}
          </button>
        </div>

        {howItWorksOpen ? (
          <div className="mt-2 grid gap-1.5 text-sm leading-5 text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
            <div>Pick the item type</div>
            <div>Enter what you see on the item</div>
            <div>If a stat isn't listed, it usually doesn't add value</div>
            <div>Decision tells you what to do; Trade Value shows strength</div>
          </div>
        ) : null}
      </Card>

      <Card className="py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill active>Quick ID Targets</Pill>
            <span className="text-xs font-semibold text-zinc-400">Jackpot patterns at a glance</span>
          </div>
          <button
            aria-expanded={quickIdOpen}
            className="rounded-xl border border-border bg-black/20 px-3 py-1.5 text-xs font-bold text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
            onClick={() => setQuickIdOpen((open) => !open)}
            type="button"
          >
            {quickIdOpen ? "Hide" : "Show"}
          </button>
        </div>

        {quickIdOpen ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickIdTargets.map((group) => (
              <div
                key={group.category}
                className="flex min-h-[72px] flex-col justify-center rounded-xl border border-border bg-black/20 px-3 py-2 text-center text-xs text-zinc-200"
              >
                <div className="font-bold text-amber-100">{group.category}</div>
                <div className="mt-0.5 font-semibold text-zinc-400">{group.hint}</div>
                <div className="mt-1 font-semibold leading-4 text-zinc-200">{group.targets.join(" | ")}</div>
              </div>
            ))}
          </div>
        ) : null}
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
