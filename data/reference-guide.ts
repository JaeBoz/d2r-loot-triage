import { GameMode, ItemCategory } from "@/lib/types";

export type ReferenceTier =
  | "Always Check"
  | "High Value / High Liquidity"
  | "Conditional Value (depends on rolls)"
  | "Usually Ignore";

export interface ReferenceEntry {
  title: string;
  category: Extract<ItemCategory, "Bases" | "Charms" | "Jewels" | "Uniques">;
  note: string;
  tags: string[];
  modeHint?: Partial<Record<GameMode, string>>;
}

export interface GuideEntry {
  title: string;
  note: string;
  tags: string[];
}

export interface QuickIdTargetEntry {
  itemType: string;
  whyIdIt: string;
  whatWins: string[];
  demand: "Broad" | "Niche";
  usuallyJunkUnless?: string;
}

export const referenceGuide: Record<ReferenceTier, ReferenceEntry[]> = {
  "Always Check": [
    {
      category: "Bases",
      title: "Eth Thresher / Giant Thresher",
      note: "Top mercenary polearm bases. Ethereal versions with the right socket path are some of the cleanest pickup checks.",
      tags: ["ETH REQUIRED", "4OS TARGET", "HIGH LIQUIDITY"],
      modeHint: {
        SCNL: "Be selective, but these still move because endgame merc setups stay relevant.",
        SCL: "Very strong pickup early and mid ladder because Insight and Infinity demand stays broad."
      }
    },
    {
      category: "Bases",
      title: "Monarch",
      note: "Classic Spirit base. Unsocketed and 4os versions are both worth a quick check.",
      tags: ["SPIRIT", "HIGH LIQUIDITY"],
      modeHint: {
        SCNL: "Still liquid, but supply is higher, so clean rolls matter more.",
        SCL: "Starter demand is broad enough that even plain ones can move."
      }
    },
    {
      category: "Charms",
      title: "Skill Grand Charms",
      note: "Plain skillers are often tradable. Secondary rolls like life or FHR can jump them much higher.",
      tags: ["CHECK MARKET", "HIGH LIQUIDITY"],
      modeHint: {
        SCNL: "Demand is more selective by skill tree, so check whether it is a popular build line.",
        SCL: "Broader ladder demand means many useful skillers are worth listing."
      }
    },
    {
      category: "Jewels",
      title: "IAS + Resist Jewels",
      note: "Broadly useful in many sockets. Strong single resist or all-res with IAS is one of the cleanest trade patterns.",
      tags: ["CHECK MARKET", "HIGH LIQUIDITY"]
    }
  ],
  "High Value / High Liquidity": [
    {
      category: "Bases",
      title: "Paladin Shields with High All Resist",
      note: "Sacred Targe and similar bases become much more interesting when the automod resist is high.",
      tags: ["CHECK RES", "HIGH LIQUIDITY"],
      modeHint: {
        SCNL: "Still valuable, but only the better automods usually cut through supply.",
        SCL: "Useful throughout ladder because Spirit and other shield demand stays active."
      }
    },
    {
      category: "Charms",
      title: "7 MF Small Charms",
      note: "One of the cleanest small charm trade patterns. Easy to recognize and usually worth market checking.",
      tags: ["HIGH LIQUIDITY", "CHECK MARKET"]
    },
    {
      category: "Charms",
      title: "Life + Resist Small Charms",
      note: "Broadly useful PvM utility. Strong life plus a real resist roll is a classic keep-or-list charm.",
      tags: ["HIGH LIQUIDITY", "CHECK ROLL"]
    },
    {
      category: "Jewels",
      title: "IAS + ED Jewels",
      note: "Real melee and PvP appeal. Strong enough combinations are commonly tradable and worth listing.",
      tags: ["HIGH LIQUIDITY", "MELEE"]
    }
  ],
  "Conditional Value (depends on rolls)": [
    {
      category: "Bases",
      title: "Monarch / Armor Bases with the Right Sockets",
      note: "These matter mostly when the final socket outcome lines up with a popular runeword target.",
      tags: ["ROLL DEPENDENT", "CHECK SOCKETS"]
    },
    {
      category: "Charms",
      title: "3/20/20 Style Damage Small Charms",
      note: "Melee small charms can be premium, but only when the exact damage, AR, and life combination is strong.",
      tags: ["PREMIUM IF PERFECT", "NICHE"]
    },
    {
      category: "Jewels",
      title: "ED + -Requirements",
      note: "Niche but real value for awkward strength sockets and specific gear setups. Better than generic filler, but not universally liquid.",
      tags: ["NICHE", "CHECK MARKET"]
    },
    {
      category: "Jewels",
      title: "IAS + Strength / Dexterity",
      note: "Useful and sometimes tradable, especially with strong stat rolls. Better than random mixes, but not as liquid as IAS + resist.",
      tags: ["ROLL DEPENDENT", "MEDIUM LIQUIDITY"]
    },
    {
      category: "Uniques",
      title: "Popular Endgame Uniques",
      note: "Worth checking if they are staples, but value still depends heavily on exact item and roll quality.",
      tags: ["CHECK ROLLS", "VARIES"]
    }
  ],
  "Usually Ignore": [
    {
      category: "Bases",
      title: "Non-eth Clunky Elite Armors",
      note: "If they are heavy, awkward, and not part of a favored runeword path, they usually do not justify stash space.",
      tags: ["LOW LIQUIDITY"]
    },
    {
      category: "Charms",
      title: "Random Mixed Utility Charms",
      note: "A few scattered stats without a known pattern usually are not worth the inventory slot.",
      tags: ["NO CLEAR PATTERN"]
    },
    {
      category: "Jewels",
      title: "Weak Mixed Stat Jewels",
      note: "Small piles of unrelated stats are usually junk unless they form a real IAS, ED, or resist pattern.",
      tags: ["NO CLEAR PATTERN"]
    },
    {
      category: "Uniques",
      title: "Low-demand Uniques with Mediocre Rolls",
      note: "Most low-tier uniques are not worth repeated checking unless you know they are part of a niche build.",
      tags: ["LOW LIQUIDITY"]
    }
  ]
};

export const marketTrendsByMode: Record<GameMode, GuideEntry[]> = {
  SCNL: [
    {
      title: "Mid-tier currency still matters",
      note: "Pul, Um, Mal, Ist, and common crafting runes still move because they bridge real trading without requiring perfect items.",
      tags: ["CURRENCY", "MID-TIER"]
    },
    {
      title: "Liquid item types stay liquid",
      note: "Skillers, MF charms, IAS jewels, and clean useful bases are still the easiest repeat trades during long farming sessions.",
      tags: ["LIQUID", "REPEATABLE"]
    },
    {
      title: "SCNL is saturated",
      note: "There is a lot of long-term supply, so average rolls get filtered out quickly and niche-perfect items matter more.",
      tags: ["SATURATED", "HIGHER STANDARDS"]
    }
  ],
  SCL: [
    {
      title: "Progression demand is broader",
      note: "Mid-tier currency, useful bases, and practical charms move faster because more characters still need core upgrades.",
      tags: ["PROGRESSION", "BROAD DEMAND"]
    },
    {
      title: "Useful over perfect",
      note: "Solid rolls can be worth listing sooner because ladder demand is less filtered than mature non-ladder supply.",
      tags: ["EARLY VALUE", "LISTABLE"]
    },
    {
      title: "Socketed and unsocketed bases both matter",
      note: "Popular runeword paths keep base demand wide enough that practical items often move before perfect ones appear.",
      tags: ["RUNES", "BASES"]
    }
  ]
};

export const runeTradeGuide: GuideEntry[] = [
  {
    title: "Ral and other crafting runes",
    note: "Common utility runes stay relevant because players burn them on crafting, rerolls, and recipe chains even when they are not glamorous.",
    tags: ["CRAFTING", "STEADY USE"]
  },
  {
    title: "Pul / Um / Mal",
    note: "These are practical bridge currency runes. They show up often enough to matter and are commonly used to settle medium trades.",
    tags: ["BRIDGE CURRENCY", "LIQUID"]
  },
  {
    title: "Ist",
    note: "Ist remains one of the cleanest mid-high trade anchors because it is useful both as currency and as a direct socketable rune.",
    tags: ["CURRENCY", "HIGH LIQUIDITY"]
  },
  {
    title: "High Runes",
    note: "Jah, Ber, Lo, Sur, and similar runes still define the upper end of item crafting and high-value trade, even if exact pricing moves over time.",
    tags: ["ENDGAME", "CHASE"]
  }
];

export const magicItemsWorthChecking: GuideEntry[] = [
  {
    title: "Amazon gloves with +skills and IAS",
    note: "Blue gloves with Amazon or Jav skills plus IAS can be very real items even when the rest of the mod line is simple.",
    tags: ["AMAZON", "IAS"]
  },
  {
    title: "JMOD-style shields",
    note: "Blue monarch-type shields with premium socket and deflection combinations are rare enough that they are always worth checking.",
    tags: ["CHECK MARKET", "SHIELDS"]
  },
  {
    title: "Paladin shields with strong automods",
    note: "White or blue paladin shields with strong all-res automods deserve a look because the automod alone can create value.",
    tags: ["PALADIN", "AUTOMOD"]
  },
  {
    title: "Barbarian helms for prebuff",
    note: "Blue barbarian helms can matter when the visible warcry or prebuff skills line up, even if the rest of the item looks plain.",
    tags: ["PREBUFF", "STAFFMODS"]
  },
  {
    title: "Circlets and class-specific blue items",
    note: "Magic circlets, druid pelts, assassin claws, and other class-specific blue items are often about the visible skill combination, not the rarity color.",
    tags: ["CIRCLET", "CLASS-SPECIFIC"]
  }
];

export const quickIdTargets: QuickIdTargetEntry[] = [
  {
    itemType: "Magic Gloves",
    whyIdIt: "A very small number of glove outcomes have real trade value, so they are fast hit-or-junk IDs.",
    whatWins: ["+2 Amazon or Javelin skills with 20 IAS", "+2 Martial Arts with 20 IAS for niche assassin demand"],
    demand: "Broad",
    usuallyJunkUnless: "The visible skill line pairs with 20 IAS."
  },
  {
    itemType: "Rare Barbarian Helms",
    whyIdIt: "Some rare barb helms can hit prebuff or PvP-style skill combinations that stand out immediately.",
    whatWins: ["+2 Barbarian skills with strong Warcries or Battle Orders support", "+2 Barbarian skills with useful combat or prebuff staffmods"],
    demand: "Niche",
    usuallyJunkUnless: "The helm shows a recognizable +skills and staffmod combination."
  },
  {
    itemType: "Magic Javelins",
    whyIdIt: "Winning blue javelins are narrow and obvious, which makes them good quick-ID targets during farming.",
    whatWins: ["+6 Javelin and Spear Skills with 40 IAS", "+5 or +6 Javelin skills with strong IAS support"],
    demand: "Broad",
    usuallyJunkUnless: "It has both a top-end Javelin skill roll and IAS."
  }
];
