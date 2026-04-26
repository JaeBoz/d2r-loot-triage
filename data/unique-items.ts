import { UniqueItemDefinition } from "@/lib/types";

const validationIndex = {
  label: "diablo2.io uniques index",
  url: "https://diablo2.io/uniques"
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
    notes: "Staple MF boots. Magic Find drives value heavily, while added damage is a lighter secondary tiebreaker.",
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
    notes: "Staple Cannot Be Frozen ring. Dexterity and attack rating both matter, but rolls affect value moderately rather than radically.",
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
    notes: "Mostly about the Magic Find roll. Rolls matter heavily because low Nagels are common and much less desirable.",
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
    notes: "Caster staple. All resist is the meaningful variable and stronger rolls matter noticeably for trade quality.",
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
    notes: "Still worth checking for javazon demand, especially in SCL. Enhanced damage matters most, life leech is a lighter secondary roll, and ethereal versions carry extra but more selective trade appeal.",
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
    notes: "Widely used mercenary helm. Strength and life leech both matter, though rolls usually fine-tune value rather than define it outright.",
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
    notes: "Top-end lightning unique. Both lightning rolls matter heavily, and strong combined rolls drive premium value.",
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
    notes: "Premium cold sorceress weapon. Cold skill damage is the meaningful value driver and rolls matter heavily.",
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
    notes: "Cold-damage staple with selective but real demand. Cold skill damage is the main trade driver, while dexterity is a useful secondary tiebreaker.",
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
    notes: "Premium poison necromancer wand with high-end but build-specific demand. -Enemy poison resist drives value heavily, with Poison and Bone Skills as a meaningful secondary roll.",
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
    notes: "Caster orb with selective, roll-sensitive demand. Sorceress skills matter first, and only strong elemental skill damage rolls usually separate it from more common caster options.",
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
    notes: "Staple mercenary polearm with steady demand. Enhanced damage matters most, and ethereal versions are a major trade-value upgrade for mercenary use.",
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
    notes: "High-end defensive helm with selective PvP/endgame demand. Two sockets are a major separator, with damage reduction and all resist deciding how strong the piece really is.",
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
    notes: "Staple caster belt with very consistent liquidity. Market saturation can keep ordinary copies below premium trade value, but caster demand makes it worth checking or listing.",
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
    notes: "Classic paladin shield. This MVP treats it as a staple check because the important trade call is usually the item itself, not its defense roll.",
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
    notes: "Solid melee staple. Usually worth keeping or checking market activity, even without roll input in this MVP.",
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
    notes: "Commonly called Shako. Staple all-around helm with broad caster, MF, and general PvM demand; defense is not the main quick-triage value driver.",
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
    notes: "Staple sorceress orb with easy-to-recognize caster and MF demand. Its value is mostly the item identity, not a variable roll check.",
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
    notes: "Staple magic-find grand charm. Magic Find is the fastest value check; low rolls are common, while high MF rolls are much easier to justify keeping or listing.",
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
    notes: "Useful melee and Uber-focused gloves. Life Tap is fixed, while life leech and strength separate weak utility copies from stronger tradable ones.",
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
    notes: "Niche melee gloves where enhanced damage and strength carry most of the trade signal. Weak rolls should read as selective or self-use.",
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
    notes: "Rare absorb ring with niche but real demand. Lightning absorb drives value first, with Magic Find as a secondary quality roll.",
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
    id: "string-of-ears",
    name: "String of Ears",
    category: "Belt",
    hasVariableRolls: true,
    keyRollFields: ["lifeLeech"],
    scnlPriority: "medium",
    sclPriority: "medium",
    liquidity: "Medium",
    notes: "Usable belt, but trade value depends on stronger defensive rolls. Life leech matters lightly here as a quick single-field check.",
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
    notes: "Premium all-around amulet. All resist is the main value driver, and higher rolls matter heavily.",
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
    notes: "Staple chase ring with steady trade demand. The main decision is whether it dropped at all, not how it rolled.",
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
    notes: "Still tradable, but usually less liquid than Stone of Jordan. Life leech is the meaningful quick roll check and matters moderately.",
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
