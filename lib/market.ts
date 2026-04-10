import { GameMode, ItemCategory, Verdict } from "@/lib/types";

export interface MarketLookupRequest {
  mode: GameMode;
  category: ItemCategory;
  itemKey: string;
  verdict: Verdict;
}

export interface MarketSnapshot {
  liquidity: "low" | "medium" | "high";
  confidence: number;
  notes: string[];
}

export interface MarketLookupAdapter {
  id: string;
  label: string;
  lookup(request: MarketLookupRequest): Promise<MarketSnapshot | null>;
}
