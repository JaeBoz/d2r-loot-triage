import { UniqueItemDefinition } from "@/lib/types";

const validationIndex = {
  label: "diablo2.io uniques index",
  url: "https://diablo2.io/uniques"
} as const;

const warlockOverviewSource = {
  label: "Blizzard News - Reign of the Warlock",
  url: "https://news.blizzard.com/en-us/article/24243863/rain-annihilation-in-reign-of-the-warlock"
} as const;

const warlockPatchNotesSource = {
  label: "Blizzard Forums - Reign of the Warlock patch notes",
  url: "https://us.forums.blizzard.com/en/d2r/t/unofficial-30-patch-notes-reign-of-the-warlock/171280"
} as const;

export const uniqueItems: UniqueItemDefinition[] = [
  {
    id: "war-travelers",
    name: "War Travelers",
    category: "Boots",
    hasVariableRolls: true,
    keyRollFields: ["magicFind", "damage"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple MF boots. The MF roll is what matters; damage is just a tiebreaker.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "magicFind",
        label: "Magic Find",
        min: 30,
        max: 50,
        higherIsBetter: true,
        thresholds: { low: 35, mid: 45, high: 50 }
      },
      {
        key: "damage",
        label: "Added Damage",
        min: 15,
        max: 25,
        higherIsBetter: true,
        thresholds: { low: 18, mid: 22, high: 25 },
        note: "Useful secondary roll, but still behind Magic Find for trade value."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Exceptional Unique Boots",
        url: "https://classic.battle.net/diablo2exp/items/exceptional/uboots.shtml"
      },
      validationSource: {
        label: "diablo2.io - War Traveler",
        url: "https://diablo2.io/post1129.html"
      },
      notes: "Exact variable ranges come from Arreat Summit. Threshold bands remain local triage heuristics layered on top of those ranges."
    }
  },
  {
    id: "raven-frost",
    name: "Raven Frost",
    category: "Ring",
    hasVariableRolls: true,
    keyRollFields: ["dexterity", "attackRating"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple Cannot Be Frozen ring. Dex and AR matter, but the item itself carries most of the value.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "dexterity",
        label: "Dexterity",
        min: 15,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 17, mid: 19, high: 20 }
      },
      {
        key: "attackRating",
        label: "Attack Rating",
        min: 150,
        max: 250,
        higherIsBetter: true,
        thresholds: { low: 180, mid: 220, high: 250 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Rings",
        url: "https://classic.battle.net/diablo2exp/items/normal/urings.shtml"
      },
      validationSource: validationIndex,
      notes: "Raven Frost's variable value comes from dexterity and attack rating; cold absorb and Cannot Be Frozen are fixed."
    }
  },
  {
    id: "nagelring",
    name: "Nagelring",
    category: "Ring",
    hasVariableRolls: true,
    keyRollFields: ["magicFind"],
    scnlPriority: "low",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Mostly an MF roll check. Low Nagels are common and nothing special.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "magicFind",
        label: "Magic Find",
        min: 15,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 20, mid: 26, high: 30 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Rings",
        url: "https://classic.battle.net/diablo2exp/items/normal/urings.shtml"
      },
      validationSource: validationIndex,
      notes: "Attack Rating is also variable on Nagelring, but Magic Find is the main value-check field for this MVP."
    }
  },
  {
    id: "vipermagi",
    name: "Skin of the Vipermagi",
    category: "Armor",
    hasVariableRolls: true,
    keyRollFields: ["allResist"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Caster staple. All resist is the roll people care about.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allResist",
        label: "All Resist",
        min: 20,
        max: 35,
        higherIsBetter: true,
        thresholds: { low: 24, mid: 30, high: 35 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Exceptional Unique Armor",
        url: "https://classic.battle.net/diablo2exp/items/exceptional/uarmor.shtml"
      },
      validationSource: {
        label: "diablo2.io - Skin of the Vipermagi",
        url: "https://diablo2.io/post4205013.html"
      },
      notes: "Magic damage reduction also varies, but all resist is the main fast triage field for trade quality."
    }
  },
  {
    id: "titans-revenge",
    name: "Titan's Revenge",
    category: "Javelin",
    hasVariableRolls: true,
    keyRollFields: ["enhancedDamage", "lifeLeech"],
    etherealRelevant: true,
    ethPriority: "high",
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Javazon staple. ED matters most, leech is secondary, and eth copies are the spicy version.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "enhancedDamage",
        label: "Enhanced Damage",
        min: 150,
        max: 200,
        higherIsBetter: true,
        thresholds: { low: 165, mid: 185, high: 200 }
      },
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 5,
        max: 9,
        higherIsBetter: true,
        thresholds: { low: 6, mid: 8, high: 9 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Class-specific Items",
        url: "https://classic.battle.net/diablo2exp/items/normal/uclass.shtml"
      },
      validationSource: {
        label: "diablo2.io - Titan's Revenge",
        url: "https://diablo2.io/uniques/titan-s-revenge-t995.html"
      },
      notes: "This corrects the old MVP shortcut that treated strength as a value roll even though Titan's strength bonus is fixed. Ethereal is also relevant because replenishes quantity keeps those versions usable."
    }
  },
  {
    id: "andariels-visage",
    name: "Andariel's Visage",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["strength", "lifeLeech"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Common merc helm. Strength and leech matter, but the item is useful even without perfect rolls.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "strength",
        label: "Strength",
        min: 25,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 27, mid: 29, high: 30 }
      },
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 8,
        max: 10,
        higherIsBetter: true,
        thresholds: { low: 8, mid: 9, high: 10 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Helms",
        url: "https://classic.battle.net/diablo2exp/items/elite/uhelms.shtml"
      },
      validationSource: {
        label: "diablo2.io - Andariel's Visage",
        url: "https://diablo2.io/post3965559.html"
      },
      notes: "Fire Resist -30% and poison stats are fixed; the fast value check is mainly strength plus life leech."
    }
  },
  {
    id: "griffons-eye",
    name: "Griffon's Eye",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["minusEnemyLightningResist", "lightningSkillDamage"],
    scnlPriority: "premium",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Top-end lightning unique. Both lightning rolls matter a lot; strong combined rolls are the chase.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "minusEnemyLightningResist",
        label: "-Enemy Lightning Resist",
        min: 15,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 16, mid: 18, high: 20 }
      },
      {
        key: "lightningSkillDamage",
        label: "Lightning Skill Damage",
        min: 10,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 11, mid: 13, high: 15 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Circlets",
        url: "https://classic.battle.net/diablo2exp/items/elite/ucirclets.shtml"
      },
      validationSource: validationIndex,
      notes: "Griffon's Eye is highly roll-sensitive, so both variable lightning lines are modeled explicitly."
    }
  },
  {
    id: "deaths-fathom",
    name: "Death's Fathom",
    category: "Weapon",
    hasVariableRolls: true,
    keyRollFields: ["coldSkillDamage"],
    scnlPriority: "premium",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Premium cold sorc weapon. Cold skill damage is the roll.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "coldSkillDamage",
        label: "Cold Skill Damage",
        min: 15,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 20, mid: 25, high: 30 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Sorceress Orbs",
        url: "https://classic.battle.net/diablo2exp/items/elite/usorceress.shtml"
      },
      validationSource: validationIndex,
      notes: "Fire and lightning resist also vary, but cold skill damage is the most important quick trade-quality field."
    }
  },
  {
    id: "nightwings-veil",
    name: "Nightwing's Veil",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["coldSkillDamage", "dexterity"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Cold-damage staple. Cold skill damage is the main roll; dex is a tiebreaker.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "coldSkillDamage",
        label: "Cold Skill Damage",
        min: 8,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 10, mid: 13, high: 15 }
      },
      {
        key: "dexterity",
        label: "Dexterity",
        min: 10,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 13, mid: 17, high: 20 },
        note: "Secondary quality roll behind cold skill damage."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Helms",
        url: "https://classic.battle.net/diablo2exp/items/elite/uhelms.shtml"
      },
      validationSource: {
        label: "diablo2.io - Nightwing's Veil",
        url: "https://diablo2.io/uniques/nightwing-s-veil-t885.html"
      },
      notes: "Cold skill damage is the key fast triage roll; dexterity matters as a secondary quality check."
    }
  },
  {
    id: "deaths-web",
    name: "Death's Web",
    category: "Weapon",
    hasVariableRolls: true,
    keyRollFields: ["minusEnemyPoisonResist", "poisonAndBoneSkills"],
    scnlPriority: "premium",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Premium poison necro wand. -Enemy poison resist is the money roll; +Poison and Bone helps.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "minusEnemyPoisonResist",
        label: "-Enemy Poison Resist",
        min: 40,
        max: 50,
        higherIsBetter: true,
        thresholds: { low: 43, mid: 47, high: 50 }
      },
      {
        key: "poisonAndBoneSkills",
        label: "Poison and Bone Skills",
        min: 1,
        max: 2,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 2 },
        note: "+2 is a real value separator on top of the poison resist roll."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Wands",
        url: "https://classic.battle.net/diablo2exp/items/elite/uwands.shtml"
      },
      validationSource: {
        label: "diablo2.io - Death's Web",
        url: "https://diablo2.io/uniques/death-s-web-t735.html"
      },
      notes: "Lower resist charges and mana/life after kill also vary, but poison resist and Poison and Bone Skills are the high-signal trade rolls."
    }
  },
  {
    id: "eschutas-temper",
    name: "Eschuta's Temper",
    category: "Weapon",
    hasVariableRolls: true,
    keyRollFields: ["allSkills", "lightningSkillDamage", "fireSkillDamage"],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Roll-sensitive sorc orb. Skills matter first; elemental rolls need to be strong.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allSkills",
        label: "Sorceress Skills",
        min: 1,
        max: 3,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 3 }
      },
      {
        key: "lightningSkillDamage",
        label: "Lightning Skill Damage",
        min: 10,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 13, mid: 17, high: 20 }
      },
      {
        key: "fireSkillDamage",
        label: "Fire Skill Damage",
        min: 10,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 13, mid: 17, high: 20 },
        note: "Useful for fire variants, but still secondary to the skill roll and preferred elemental line."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Sorceress Orbs",
        url: "https://classic.battle.net/diablo2exp/items/elite/usorceress.shtml"
      },
      validationSource: {
        label: "diablo2.io - Eschuta's Temper",
        url: "https://diablo2.io/uniques/eschuta-s-temper-t757.html"
      },
      notes: "Energy also varies, but the meaningful trade call is driven by sorceress skills plus the elemental damage lines."
    }
  },
  {
    id: "the-reapers-toll",
    name: "The Reaper's Toll",
    category: "Weapon",
    hasVariableRolls: true,
    keyRollFields: ["enhancedDamage", "lifeLeech"],
    etherealRelevant: true,
    ethPriority: "high",
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple merc polearm. ED matters, and eth is the version people want.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "enhancedDamage",
        label: "Enhanced Damage",
        min: 190,
        max: 240,
        higherIsBetter: true,
        thresholds: { low: 205, mid: 225, high: 240 }
      },
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 11,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 12, mid: 14, high: 15 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Polearms",
        url: "https://classic.battle.net/diablo2exp/items/elite/upolearms.shtml"
      },
      validationSource: {
        label: "diablo2.io - The Reaper's Toll",
        url: "https://diablo2.io/uniques/the-reaper-s-toll-t939.html"
      },
      notes: "Decrepify is fixed; the fast trade-quality check is enhanced damage, life leech, and whether the item is ethereal."
    }
  },
  {
    id: "crown-of-ages",
    name: "Crown of Ages",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["allResist", "damageReduction", "sockets"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "High-end defensive helm. Two sockets are huge; DR and res decide how good it is.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allResist",
        label: "All Resist",
        min: 20,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 23, mid: 27, high: 30 }
      },
      {
        key: "damageReduction",
        label: "Damage Reduction",
        min: 10,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 11, mid: 13, high: 15 }
      },
      {
        key: "sockets",
        label: "Sockets",
        min: 1,
        max: 2,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 2 },
        note: "Two sockets are a major value jump."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Helms",
        url: "https://classic.battle.net/diablo2exp/items/elite/uhelms.shtml"
      },
      validationSource: {
        label: "diablo2.io - Crown of Ages",
        url: "https://diablo2.io/uniques/crown-of-ages-t724.html"
      },
      notes: "Defense also varies, but sockets plus defensive rolls are the practical triage fields."
    }
  },
  {
    id: "arachnid-mesh",
    name: "Arachnid Mesh",
    category: "Belt",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "high",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Staple caster belt. Common, but always worth keeping because casters use it everywhere.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Belts",
        url: "https://classic.battle.net/diablo2exp/items/elite/ubelts.shtml"
      },
      validationSource: validationIndex,
      notes: "Enhanced defense varies, but it is usually not the reason to keep or skip an Arachnid Mesh."
    }
  },
  {
    id: "herald-of-zakarum",
    name: "Herald of Zakarum",
    category: "Shield",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Classic paladin shield. The drop itself is the value; defense is not the quick call.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Class-specific Items",
        url: "https://classic.battle.net/diablo2exp/items/normal/uclass.shtml"
      },
      validationSource: {
        label: "diablo2.io - Herald of Zakarum",
        url: "https://diablo2.io/uniques/herald-of-zakarum-t815.html"
      },
      notes: "Enhanced defense varies, but the current MVP avoids adding an enhanced-defense field solely for this one item."
    }
  },
  {
    id: "gore-rider",
    name: "Gore Rider",
    category: "Boots",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Solid melee staple. Usually worth keeping even without a roll check here.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Exceptional Unique Boots",
        url: "https://classic.battle.net/diablo2exp/items/exceptional/uboots.shtml"
      },
      validationSource: validationIndex,
      notes: "Its varying enhanced defense is not normally the deciding trade factor in quick triage."
    }
  },
  {
    id: "harlequin-crest",
    name: "Harlequin Crest",
    category: "Helm",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Shako. Staple all-around helm for casters, MF, and PvM; defense is not the point.",
    source: "diablo2.io / Arreat Summit",
    sources: {
      baselineSource: {
        label: "diablo2.io - Harlequin Crest",
        url: "https://diablo2.io/uniques/harlequin-crest-t37.html"
      },
      validationSource: validationIndex,
      notes: "Defense varies, but the current triage model treats Shako as a staple-demand unique rather than a roll-sensitive item."
    }
  },
  {
    id: "the-oculus",
    name: "The Oculus",
    category: "Weapon",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple sorc orb. The item identity is the value, not a roll check.",
    source: "Arreat Summit / Diablo Wiki",
    sources: {
      baselineSource: {
        label: "Diablo Wiki - The Oculus",
        url: "https://diablo.fandom.com/wiki/The_Oculus_(Diablo_II)"
      },
      validationSource: validationIndex,
      notes: "The Oculus has fixed high-signal caster stats for this triage scope, so no roll fields are exposed."
    }
  },
  {
    id: "gheeds-fortune",
    name: "Gheed's Fortune",
    category: "Charm",
    hasVariableRolls: true,
    keyRollFields: ["magicFind"],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple MF grand charm. Low rolls are common; high MF is what makes it worth listing.",
    source: "Gamer Guides / Diablo Wiki",
    rollDefinitions: [
      {
        key: "magicFind",
        label: "Magic Find",
        min: 20,
        max: 40,
        higherIsBetter: true,
        thresholds: { low: 25, mid: 35, high: 40 },
        note: "Gold find and vendor reduction also vary, but MF is the most important quick triage roll."
      }
    ],
    sources: {
      baselineSource: {
        label: "Gamer Guides - Gheed's Fortune",
        url: "https://www.gamerguides.com/diablo-ii-resurrected/guide/equipment/charms/gheeds-fortune"
      },
      validationSource: validationIndex,
      notes: "Only Magic Find is exposed for the MVP because it drives the most common farming decision."
    }
  },
  {
    id: "draculs-grasp",
    name: "Dracul's Grasp",
    category: "Gloves",
    hasVariableRolls: true,
    keyRollFields: ["lifeLeech", "strength"],
    scnlPriority: "low",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Melee/Uber gloves. Life Tap is fixed; leech and strength decide whether the copy is decent.",
    source: "Diablo Wiki / diablo2.io",
    rollDefinitions: [
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 7,
        max: 10,
        higherIsBetter: true,
        thresholds: { low: 7, mid: 9, high: 10 }
      },
      {
        key: "strength",
        label: "Strength",
        min: 10,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 11, mid: 14, high: 15 },
        note: "Strength is a secondary quality roll behind life leech."
      }
    ],
    sources: {
      baselineSource: {
        label: "Diablo Wiki - Dracul's Grasp",
        url: "https://diablo.fandom.com/wiki/Dracul%27s_Grasp"
      },
      validationSource: validationIndex,
      notes: "Life after each kill also varies, but it is intentionally omitted from fast triage."
    }
  },
  {
    id: "steelrend",
    name: "Steelrend",
    category: "Gloves",
    hasVariableRolls: true,
    keyRollFields: ["enhancedDamage", "strength"],
    scnlPriority: "low",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Niche melee gloves. ED and strength carry the roll; weak copies are mostly self-use.",
    source: "Diablo Wiki / diablo2.io",
    rollDefinitions: [
      {
        key: "enhancedDamage",
        label: "Enhanced Damage",
        min: 30,
        max: 60,
        higherIsBetter: true,
        thresholds: { low: 40, mid: 50, high: 60 }
      },
      {
        key: "strength",
        label: "Strength",
        min: 15,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 16, mid: 19, high: 20 }
      }
    ],
    sources: {
      baselineSource: {
        label: "Diablo Wiki - Steelrend",
        url: "https://diablo.fandom.com/wiki/Steelrend"
      },
      validationSource: validationIndex,
      notes: "Defense also varies, but ED and strength are the meaningful trade-quality checks."
    }
  },
  {
    id: "wisp-projector",
    name: "Wisp Projector",
    category: "Ring",
    hasVariableRolls: true,
    keyRollFields: ["lightningAbsorb", "magicFind"],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Niche absorb ring. Lightning absorb is the main roll; MF is secondary.",
    source: "diablo2.io / Diablo Wiki",
    rollDefinitions: [
      {
        key: "lightningAbsorb",
        label: "Lightning Absorb",
        min: 10,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 13, mid: 17, high: 20 }
      },
      {
        key: "magicFind",
        label: "Magic Find",
        min: 10,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 13, mid: 17, high: 20 },
        note: "Useful secondary roll, but lightning absorb is the primary value driver."
      }
    ],
    sources: {
      baselineSource: {
        label: "diablo2.io - Wisp Projector",
        url: "https://diablo2.io/uniques/wisp-projector-t1023.html"
      },
      validationSource: {
        label: "Diablo Wiki - Wisp Projector",
        url: "https://diablo.fandom.com/wiki/Wisp_Projector"
      },
      notes: "Summon charges are intentionally omitted because lightning absorb and MF are the fast triage rolls."
    }
  },
  {
    id: "highlords-wrath",
    name: "Highlord's Wrath",
    category: "Amulet",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "High",
    notes: "Staple melee amulet. The drop itself is the value; IAS, Deadly Strike, and +skill make it worth keeping.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Amulets",
        url: "https://classic.battle.net/diablo2exp/items/normal/uamulets.shtml"
      },
      validationSource: validationIndex,
      notes: "Lightning damage varies, but it is not a meaningful trade-quality roll for fast triage."
    }
  },
  {
    id: "kiras-guardian",
    name: "Kira's Guardian",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["allResist"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Resist/CBF helm. High all res is the reason people pause on it; low rolls are mostly self-use.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allResist",
        label: "All Resist",
        min: 50,
        max: 70,
        higherIsBetter: true,
        thresholds: { low: 55, mid: 65, high: 70 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Helms",
        url: "https://classic.battle.net/diablo2exp/items/elite/uhelms.shtml"
      },
      validationSource: validationIndex,
      notes: "Defense also varies, but all resist is the clean farming-triage field."
    }
  },
  {
    id: "vampire-gaze",
    name: "Vampire Gaze",
    category: "Helm",
    hasVariableRolls: true,
    keyRollFields: ["lifeLeech", "damageReduction"],
    etherealRelevant: true,
    ethPriority: "medium",
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Merc and melee helm. Leech plus damage reduction are the rolls; eth copies are better for merc use.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 6,
        max: 8,
        higherIsBetter: true,
        thresholds: { low: 6, mid: 7, high: 8 }
      },
      {
        key: "damageReduction",
        label: "Damage Reduction",
        min: 15,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 16, mid: 18, high: 20 },
        note: "The DR roll is the bigger value separator for most copies."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Exceptional Unique Helms",
        url: "https://classic.battle.net/diablo2exp/items/exceptional/uhelms.shtml"
      },
      validationSource: validationIndex,
      notes: "Magic damage reduction also varies, but leech and physical damage reduction are the fastest useful triage fields."
    }
  },
  {
    id: "verdungos-hearty-cord",
    name: "Verdungo's Hearty Cord",
    category: "Belt",
    hasVariableRolls: true,
    keyRollFields: ["damageReduction", "vitality"],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "PvP-style defensive belt. Damage reduction and vitality decide whether it is just usable or actually worth checking.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "damageReduction",
        label: "Damage Reduction",
        min: 10,
        max: 15,
        higherIsBetter: true,
        thresholds: { low: 11, mid: 13, high: 15 }
      },
      {
        key: "vitality",
        label: "Vitality",
        min: 30,
        max: 40,
        higherIsBetter: true,
        thresholds: { low: 32, mid: 37, high: 40 },
        note: "Vitality is the secondary roll that makes strong DR copies stand out."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Belts",
        url: "https://classic.battle.net/diablo2exp/items/elite/ubelts.shtml"
      },
      validationSource: validationIndex,
      notes: "Replenish life also varies, but DR and vitality are the high-signal fast triage rolls."
    }
  },
  {
    id: "thunderstroke",
    name: "Thunderstroke",
    category: "Javelin",
    hasVariableRolls: true,
    keyRollFields: ["allSkills", "enhancedDamage"],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Lightning javazon option. +Javelin skills matter first; ED is a secondary quality roll.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allSkills",
        label: "Javelin and Spear Skills",
        min: 2,
        max: 4,
        higherIsBetter: true,
        thresholds: { low: 2, mid: 3, high: 4 }
      },
      {
        key: "enhancedDamage",
        label: "Enhanced Damage",
        min: 150,
        max: 200,
        higherIsBetter: true,
        thresholds: { low: 165, mid: 185, high: 200 },
        note: "ED helps, but the skill roll is the main reason to check the item."
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Class-specific Items",
        url: "https://classic.battle.net/diablo2exp/items/normal/uclass.shtml"
      },
      validationSource: validationIndex,
      notes: "Lightning damage is fixed; the MVP models +Javelin skills and ED as the meaningful roll checks."
    }
  },
  {
    id: "chance-guards",
    name: "Chance Guards",
    category: "Gloves",
    ruleset: "lod",
    hasVariableRolls: true,
    keyRollFields: ["magicFind"],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "High",
    notes: "MF gloves. High MF is the reason to care; low rolls are common filler.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "magicFind",
        label: "Magic Find",
        min: 25,
        max: 40,
        higherIsBetter: true,
        thresholds: { low: 30, mid: 35, high: 40 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Normal Unique Gloves",
        url: "https://classic.battle.net/diablo2exp/items/normal/ugloves.shtml"
      },
      validationSource: validationIndex,
      notes: "Gold find also varies, but Magic Find is the quick triage roll."
    }
  },
  {
    id: "magefist",
    name: "Magefist",
    category: "Gloves",
    ruleset: "lod",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "High",
    notes: "Caster glove staple. The drop itself is the value; ED is not the fast call.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Normal Unique Gloves",
        url: "https://classic.battle.net/diablo2exp/items/normal/ugloves.shtml"
      },
      validationSource: validationIndex,
      notes: "Enhanced defense varies, but caster utility is the reason to keep it."
    }
  },
  {
    id: "wizardspike",
    name: "Wizardspike",
    category: "Dagger",
    ruleset: "lod",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "medium",
    sclPriority: "high",
    liquidity: "High",
    notes: "Caster/resist staple. No roll chase here; it is useful because of the fixed package.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Daggers",
        url: "https://classic.battle.net/diablo2exp/items/elite/udaggers.shtml"
      },
      validationSource: validationIndex,
      notes: "Wizardspike is treated as a no-roll staple because its high-signal caster stats are fixed."
    }
  },
  {
    id: "stormshield",
    name: "Stormshield",
    category: "Shield",
    ruleset: "lod",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Defensive shield staple. Useful, but demand is more specific than caster staples.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Elite Unique Shields",
        url: "https://classic.battle.net/diablo2exp/items/elite/ushields.shtml"
      },
      validationSource: validationIndex,
      notes: "Defense varies, but damage reduction and block utility are the practical reason to keep it."
    }
  },
  {
    id: "diablos-deception",
    name: "Diablo's Deception",
    category: "Book",
    ruleset: "warlock",
    hasVariableRolls: true,
    keyRollFields: ["allSkills", "fireSkillDamage", "minusEnemyFireResist"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Warlock-only item. Fire book rolls matter; skills, fire damage, and -enemy fire res are the check.",
    source: "Blizzard News / community patch notes",
    rollDefinitions: [
      {
        key: "allSkills",
        label: "Fire Skills",
        min: 1,
        max: 3,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 3 }
      },
      {
        key: "fireSkillDamage",
        label: "Fire Skill Damage",
        min: 10,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 15, mid: 25, high: 30 }
      },
      {
        key: "minusEnemyFireResist",
        label: "-Enemy Fire Resist",
        min: 5,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 8, mid: 15, high: 20 }
      }
    ],
    sources: {
      baselineSource: warlockOverviewSource,
      validationSource: warlockPatchNotesSource,
      notes: "Warlock-only unique book. Roll ranges are seeded from the community patch-note compilation and should stay mode-gated."
    }
  },
  {
    id: "baals-betrayal",
    name: "Baal's Betrayal",
    category: "Book",
    ruleset: "warlock",
    hasVariableRolls: true,
    keyRollFields: ["allSkills", "coldSkillDamage", "minusEnemyColdResist"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Warlock-only item. Cold book rolls matter; skills, cold damage, and -enemy cold res are the check.",
    source: "Blizzard News / community patch notes",
    rollDefinitions: [
      {
        key: "allSkills",
        label: "Cold Skills",
        min: 1,
        max: 3,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 3 }
      },
      {
        key: "coldSkillDamage",
        label: "Cold Skill Damage",
        min: 10,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 15, mid: 25, high: 30 }
      },
      {
        key: "minusEnemyColdResist",
        label: "-Enemy Cold Resist",
        min: 5,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 8, mid: 15, high: 20 }
      }
    ],
    sources: {
      baselineSource: warlockOverviewSource,
      validationSource: warlockPatchNotesSource,
      notes: "Warlock-only unique book. Roll ranges are seeded from the community patch-note compilation and should stay mode-gated."
    }
  },
  {
    id: "mephistos-manipulation",
    name: "Mephisto's Manipulation",
    category: "Book",
    ruleset: "warlock",
    hasVariableRolls: true,
    keyRollFields: ["allSkills", "lightningSkillDamage", "minusEnemyLightningResist"],
    scnlPriority: "high",
    sclPriority: "high",
    liquidity: "Medium",
    notes: "Warlock-only item. Lightning book rolls matter; skills, lightning damage, and -enemy lightning res are the check.",
    source: "Blizzard News / community patch notes",
    rollDefinitions: [
      {
        key: "allSkills",
        label: "Lightning Skills",
        min: 1,
        max: 3,
        higherIsBetter: true,
        thresholds: { low: 1, mid: 2, high: 3 }
      },
      {
        key: "lightningSkillDamage",
        label: "Lightning Skill Damage",
        min: 10,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 15, mid: 25, high: 30 }
      },
      {
        key: "minusEnemyLightningResist",
        label: "-Enemy Lightning Resist",
        min: 5,
        max: 20,
        higherIsBetter: true,
        thresholds: { low: 8, mid: 15, high: 20 }
      }
    ],
    sources: {
      baselineSource: warlockOverviewSource,
      validationSource: warlockPatchNotesSource,
      notes: "Warlock-only unique book. Roll ranges are seeded from the community patch-note compilation and should stay mode-gated."
    }
  },
  {
    id: "string-of-ears",
    name: "String of Ears",
    category: "Belt",
    hasVariableRolls: true,
    keyRollFields: ["lifeLeech"],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Usable belt. Needs stronger defensive rolls; leech is only a quick check here.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 6,
        max: 8,
        higherIsBetter: true,
        thresholds: { low: 6, mid: 7, high: 8 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Exceptional Unique Belts",
        url: "https://classic.battle.net/diablo2exp/items/exceptional/ubelts.shtml"
      },
      validationSource: validationIndex,
      notes: "Damage reduction and magic damage reduction also vary, but life leech is the current MVP quick-check field."
    }
  },
  {
    id: "maras-kaleidoscope",
    name: "Mara's Kaleidoscope",
    category: "Amulet",
    hasVariableRolls: true,
    keyRollFields: ["allResist"],
    scnlPriority: "premium",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Premium all-around amulet. All resist is the roll.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "allResist",
        label: "All Resist",
        min: 20,
        max: 30,
        higherIsBetter: true,
        thresholds: { low: 23, mid: 27, high: 30 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Amulets",
        url: "https://classic.battle.net/diablo2exp/items/normal/uamulets.shtml"
      },
      validationSource: {
        label: "diablo2.io - Mara's Kaleidoscope trade page",
        url: "https://diablo2.io/post4257999.html"
      },
      notes: "All attributes are fixed; all resist is the real fast value-check roll."
    }
  },
  {
    id: "stone-of-jordan",
    name: "Stone of Jordan",
    category: "Ring",
    hasVariableRolls: false,
    keyRollFields: [],
    scnlPriority: "premium",
    sclPriority: "premium",
    liquidity: "High",
    notes: "Staple chase ring. No roll chase here; the drop itself is the value.",
    source: "Arreat Summit / diablo2.io",
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Rings",
        url: "https://classic.battle.net/diablo2exp/items/normal/urings.shtml"
      },
      validationSource: {
        label: "diablo2.io - The Stone of Jordan",
        url: "https://diablo2.io/uniques/the-stone-of-jordan-t938-20.html"
      },
      notes: "The lightning damage line varies, but it is not a meaningful triage field for trade quality."
    }
  },
  {
    id: "bul-kathos-wedding-band",
    name: "Bul-Kathos' Wedding Band",
    category: "Ring",
    hasVariableRolls: true,
    keyRollFields: ["lifeLeech"],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Still tradable, but less liquid than SoJ. Life leech is the quick roll check.",
    source: "Arreat Summit / diablo2.io",
    rollDefinitions: [
      {
        key: "lifeLeech",
        label: "Life Leech",
        min: 3,
        max: 5,
        higherIsBetter: true,
        thresholds: { low: 3, mid: 4, high: 5 }
      }
    ],
    sources: {
      baselineSource: {
        label: "The Arreat Summit - Unique Rings",
        url: "https://classic.battle.net/diablo2exp/items/normal/urings.shtml"
      },
      validationSource: {
        label: "diablo2.io - Bul-Kathos' Wedding Band trade page",
        url: "https://diablo2.io/post4216701.html"
      },
      notes: "The life bonus scales with character level; life leech is the cleaner fast triage input for this MVP."
    }
  }
];
