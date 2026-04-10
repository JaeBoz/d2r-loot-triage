import baseItemsJson from "@/data/base-items.json";
import baseReferenceJson from "@/data/base-reference.json";
import { BaseItem, BaseReferenceData, GameMode } from "@/lib/types";

export const baseItems = baseItemsJson as BaseItem[];

export const baseItemMap = new Map(baseItems.map((item) => [item.id, item]));

export const baseReferenceByMode = baseReferenceJson as Record<GameMode, BaseReferenceData>;
