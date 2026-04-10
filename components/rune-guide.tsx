"use client";

import { Card, Pill } from "@/components/ui";
import { runeTradeGuide } from "@/data/reference-guide";
import { GameMode } from "@/lib/types";

export function RuneGuide({ mode }: { mode: GameMode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Rune Trade Guide</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Commonly traded runes and why they matter</h2>
          </div>
          <Pill active>{mode}</Pill>
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

      <Card className="h-fit">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Quick Read</p>
        <div className="mt-3 rounded-2xl border border-border bg-black/20 p-4">
          <p className="text-sm leading-6 text-zinc-300">
            This guide is intentionally static. It highlights which runes are commonly useful as crafting fuel, bridge
            currency, or high-end trade anchors without pretending to give live prices.
          </p>
        </div>
      </Card>
    </div>
  );
}
