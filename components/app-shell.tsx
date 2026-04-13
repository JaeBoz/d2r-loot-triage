"use client";

import Link from "next/link";
import { useState } from "react";
import { AmuletChecker } from "@/components/amulet-checker";
import { BaseChecker } from "@/components/base-checker";
import { BootsChecker } from "@/components/boots-checker";
import { CharmChecker } from "@/components/charm-checker";
import { CircletChecker } from "@/components/circlet-checker";
import { JewelChecker } from "@/components/jewel-checker";
import { PlaceholderCategoryPanel } from "@/components/placeholder-category-panel";
import { RingChecker } from "@/components/ring-checker";
import { RuneGuide } from "@/components/rune-guide";
import { UniqueChecker } from "@/components/unique-checker";
import { Card, Pill } from "@/components/ui";
import { CATEGORY_TABS, MODE_OPTIONS } from "@/lib/constants";
import { GameMode, ItemCategory } from "@/lib/types";

export function AppShell() {
  const [mode, setMode] = useState<GameMode>("SCNL");
  const [category, setCategory] = useState<ItemCategory>("Bases");

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill active>D2R Loot Triage</Pill>
              <Pill>{mode}</Pill>
              <Pill>Resurrected</Pill>
            </div>
            <Link
              className="rounded-xl border border-border bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              href="/reference"
            >
              Open Guides
            </Link>
          </div>

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
      </header>

      <Card>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                category === tab
                  ? "bg-zinc-100 text-zinc-950"
                  : "border border-border bg-black/20 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
              onClick={() => setCategory(tab)}
              type="button"
            >
              {tab}
            </button>
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
      {category === "Uniques" ? <UniqueChecker mode={mode} /> : null}
      {category !== "Bases" &&
      category !== "Circlets" &&
      category !== "Runes" &&
      category !== "Charms" &&
      category !== "Jewels" &&
      category !== "Rings" &&
      category !== "Amulets" &&
      category !== "Boots" &&
      category !== "Uniques" ? (
        <PlaceholderCategoryPanel category={category} />
      ) : null}
    </main>
  );
}
