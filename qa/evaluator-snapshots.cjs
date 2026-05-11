const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const baselinePath = path.join(__dirname, "evaluator-snapshots.baseline.json");
const updateBaseline = process.argv.includes("--update");

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(this, path.join(repoRoot, request.slice(2)), parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019
    },
    fileName: filename
  });

  module._compile(output.outputText, filename);
};

const { evaluateAmulet } = require("../lib/amulet-checker");
const { evaluateBase } = require("../lib/base-checker");
const { evaluateBoots } = require("../lib/boots-checker");
const { evaluateCharm } = require("../lib/charm-checker");
const { evaluateCirclet } = require("../lib/circlet-checker");
const { evaluateGloves } = require("../lib/glove-checker");
const { evaluateJewel } = require("../lib/jewel-checker");
const { evaluateRing } = require("../lib/ring-checker");
const { evaluateUnique } = require("../lib/unique-checker");

const mode = "SCNL";

const fixtures = [
  {
    id: "base-eth-0os-thresher",
    category: "Bases",
    name: "Eth 0os Thresher",
    evaluate: () => evaluateBase({ mode, itemId: "thresher", sockets: 0, ethereal: true, superior: false }),
    reasoningIncludes: ["socket potential"]
  },
  {
    id: "base-eth-4os-thresher",
    category: "Bases",
    name: "Eth 4os Thresher",
    evaluate: () => evaluateBase({ mode, itemId: "thresher", sockets: 4, ethereal: true, superior: false }),
    reasoningIncludes: ["4os eth merc base"]
  },
  {
    id: "base-eth-15ed-4os-thresher",
    category: "Bases",
    name: "Eth 15 ED 4os Thresher",
    evaluate: () =>
      evaluateBase({
        mode,
        itemId: "thresher",
        sockets: 4,
        ethereal: true,
        superior: true,
        superiorEnhancedDamage: 15
      }),
    reasoningIncludes: ["15 ed", "superior roll"]
  },
  {
    id: "base-wrong-socket-elite",
    category: "Bases",
    name: "Wrong-socket eth elite base",
    evaluate: () => evaluateBase({ mode, itemId: "thresher", sockets: 5, ethereal: true, superior: false }),
    reasoningIncludes: ["5os obedience"]
  },
  {
    id: "unique-low-griffons",
    category: "Uniques",
    name: "Low Griffon's Eye",
    evaluate: () =>
      evaluateUnique({
        mode,
        itemId: "griffons-eye",
        minusEnemyLightningResist: 15,
        lightningSkillDamage: 10
      }),
    reasoningIncludes: ["roll quality"]
  },
  {
    id: "unique-high-griffons",
    category: "Uniques",
    name: "High Griffon's Eye",
    evaluate: () =>
      evaluateUnique({
        mode,
        itemId: "griffons-eye",
        minusEnemyLightningResist: 20,
        lightningSkillDamage: 15
      }),
    reasoningIncludes: ["enemy lightning"]
  },
  {
    id: "unique-staple-arachnid",
    category: "Uniques",
    name: "Staple unique",
    evaluate: () => evaluateUnique({ mode, itemId: "arachnid-mesh", enhancedDefense: 110 }),
    reasoningIncludes: ["drop itself"]
  },
  {
    id: "charm-plain-skiller",
    category: "Charms",
    name: "Plain grand charm skiller",
    evaluate: () => evaluateCharm({ mode, size: "Grand Charm", skill: "Sorceress Lightning Spells" }),
    reasoningIncludes: ["skill tree"]
  },
  {
    id: "charm-life-skiller",
    category: "Charms",
    name: "Life skiller",
    evaluate: () => evaluateCharm({ mode, size: "Grand Charm", skill: "Sorceress Lightning Spells", life: 40 }),
    reasoningIncludes: ["life"]
  },
  {
    id: "charm-451-poison-sc",
    category: "Charms",
    name: "451 poison small charm",
    evaluate: () => evaluateCharm({ mode, size: "Small Charm", poisonDamage: 451 }),
    reasoningIncludes: ["poison damage"]
  },
  {
    id: "charm-filler",
    category: "Charms",
    name: "Filler charm",
    evaluate: () => evaluateCharm({ mode, size: "Large Charm", mana: 8 }),
    reasoningIncludes: ["charm pattern"]
  },
  {
    id: "jewel-ias-only",
    category: "Jewels",
    name: "IAS only jewel",
    evaluate: () => evaluateJewel({ mode, increasedAttackSpeed: 15 }),
    reasoningIncludes: ["ias"]
  },
  {
    id: "jewel-ias-weak-res",
    category: "Jewels",
    name: "IAS plus weak resist jewel",
    evaluate: () => evaluateJewel({ mode, increasedAttackSpeed: 15, fireResist: 15 }),
    reasoningIncludes: ["ias", "res"]
  },
  {
    id: "jewel-ias-ed",
    category: "Jewels",
    name: "IAS plus ED jewel",
    evaluate: () => evaluateJewel({ mode, increasedAttackSpeed: 15, enhancedDamage: 35 }),
    reasoningIncludes: ["socket"]
  },
  {
    id: "circlet-weak-2-20",
    category: "Circlets",
    name: "Weak rare 2/20",
    evaluate: () =>
      evaluateCirclet({
        mode,
        family: "Circlet",
        quality: "Rare",
        skillMode: "class",
        classSkillType: "Sorceress Skills",
        classSkillValue: 2,
        fasterCastRate: 20
      }),
    reasoningIncludes: ["+2 sorceress skills", "20 fcr"]
  },
  {
    id: "circlet-strong-2-20",
    category: "Circlets",
    name: "Strong rare 2/20",
    evaluate: () =>
      evaluateCirclet({
        mode,
        family: "Diadem",
        quality: "Rare",
        skillMode: "class",
        classSkillType: "Sorceress Skills",
        classSkillValue: 2,
        fasterCastRate: 20,
        strength: 20,
        life: 45,
        allResist: 18,
        sockets: 2
      }),
    reasoningIncludes: ["+2 sorceress skills", "20 fcr"]
  },
  {
    id: "circlet-3-20-magic",
    category: "Circlets",
    name: "3/20 magic circlet",
    evaluate: () =>
      evaluateCirclet({
        mode,
        family: "Diadem",
        quality: "Magic",
        skillMode: "tree",
        skillTreeType: "Sorceress Lightning Spells",
        skillTreeValue: 3,
        fasterCastRate: 20
      }),
    reasoningIncludes: ["+3 sorceress lightning spells", "20 fcr"]
  },
  {
    id: "amulet-weak-2-20",
    category: "Amulets",
    name: "Weak +2/20 amulet",
    evaluate: () =>
      evaluateAmulet({
        mode,
        classSkills: 2,
        classSkillType: "Sorceress Skills",
        fasterCastRate: 20
      }),
    reasoningIncludes: ["20 fcr", "secondaries decide"]
  },
  {
    id: "amulet-strong-caster",
    category: "Amulets",
    name: "Strong caster amulet",
    evaluate: () =>
      evaluateAmulet({
        mode,
        classSkills: 2,
        classSkillType: "Sorceress Skills",
        fasterCastRate: 20,
        strength: 25,
        life: 55,
        allResist: 18,
        mana: 70
      }),
    reasoningIncludes: ["20 fcr"]
  },
  {
    id: "amulet-plus-2-only",
    category: "Amulets",
    name: "+2 skills only amulet",
    evaluate: () => evaluateAmulet({ mode, classSkills: 2, classSkillType: "Sorceress Skills" }),
    reasoningIncludes: ["skills alone"]
  },
  {
    id: "ring-weak-fcr",
    category: "Rings",
    name: "Weak FCR ring",
    evaluate: () => evaluateRing({ mode, fasterCastRate: 10 }),
    reasoningIncludes: ["fcr", "weak secondaries"]
  },
  {
    id: "ring-strong-caster",
    category: "Rings",
    name: "Strong caster ring",
    evaluate: () =>
      evaluateRing({
        mode,
        fasterCastRate: 10,
        strength: 20,
        life: 35,
        mana: 80,
        allResist: 10,
        lightningResist: 25
      }),
    reasoningIncludes: ["fcr", "strength/all res"]
  },
  {
    id: "ring-dual-leech",
    category: "Rings",
    name: "Dual leech ring",
    evaluate: () => evaluateRing({ mode, lifeLeech: 6, manaLeech: 6, attackRating: 100 }),
    reasoningIncludes: ["leech"]
  },
  {
    id: "gloves-jav-2-20",
    category: "Gloves",
    name: "Jav 2/20 gloves",
    evaluate: () =>
      evaluateGloves({
        mode,
        quality: "Rare",
        skillType: "Javelin and Spear",
        skillLevel: 2,
        increasedAttackSpeed: 20
      }),
    reasoningIncludes: ["skills", "ias"]
  },
  {
    id: "gloves-jav-3-20",
    category: "Gloves",
    name: "Jav 3/20 gloves",
    evaluate: () =>
      evaluateGloves({
        mode,
        quality: "Magic",
        skillType: "Javelin and Spear",
        skillLevel: 3,
        increasedAttackSpeed: 20
      }),
    reasoningIncludes: ["+3 jav", "20 ias"]
  },
  {
    id: "gloves-ias-only",
    category: "Gloves",
    name: "IAS-only gloves",
    evaluate: () =>
      evaluateGloves({
        mode,
        quality: "Rare",
        skillType: "None",
        skillLevel: 0,
        increasedAttackSpeed: 20
      }),
    reasoningIncludes: ["ias"]
  },
  {
    id: "boots-no-frw-res",
    category: "Boots",
    name: "No-FRW resist boots",
    evaluate: () => evaluateBoots({ mode, fireResist: 35, lightningResist: 35, coldResist: 25 }),
    reasoningIncludes: ["No FRW"]
  },
  {
    id: "boots-frw-dual-res",
    category: "Boots",
    name: "FRW dual-res boots",
    evaluate: () => evaluateBoots({ mode, fasterRunWalk: 30, fireResist: 35, lightningResist: 30 }),
    reasoningIncludes: ["FRW", "dual res"]
  },
  {
    id: "boots-strong-tri-res-frw",
    category: "Boots",
    name: "Strong tri-res FRW boots",
    evaluate: () =>
      evaluateBoots({
        mode,
        fasterRunWalk: 30,
        fasterHitRecovery: 10,
        fireResist: 40,
        lightningResist: 40,
        coldResist: 35,
        magicFind: 20
      }),
    reasoningIncludes: ["FRW", "tri-res"]
  }
];

function normalizeText(value) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function comparableResult(result) {
  return {
    priority: result.priority,
    contextualHighlight: result.contextualHighlight ?? null,
    recommendedAction: result.recommendedAction,
    explanation: result.explanation,
    qualityScore: typeof result.qualityScore === "number" ? result.qualityScore : null,
    archetypeTags: result.archetypeTags ?? []
  };
}

function runFixtures() {
  return fixtures.map((fixture) => ({
    id: fixture.id,
    category: fixture.category,
    name: fixture.name,
    ...comparableResult(fixture.evaluate())
  }));
}

function loadBaseline() {
  if (!fs.existsSync(baselinePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(baselinePath, "utf8"));
}

function diffSnapshot(current, expected) {
  const failures = [];
  const strictFields = ["priority", "contextualHighlight", "recommendedAction", "qualityScore"];

  for (const field of strictFields) {
    if (current[field] !== expected[field]) {
      failures.push(`${field}: expected ${JSON.stringify(expected[field])}, received ${JSON.stringify(current[field])}`);
    }
  }

  if (JSON.stringify(current.archetypeTags) !== JSON.stringify(expected.archetypeTags)) {
    failures.push(`archetypeTags: expected ${JSON.stringify(expected.archetypeTags)}, received ${JSON.stringify(current.archetypeTags)}`);
  }

  return failures;
}

function validateReasoning(current) {
  const fixture = fixtures.find((entry) => entry.id === current.id);
  const explanation = normalizeText(current.explanation);

  return fixture.reasoningIncludes
    .filter((anchor) => !explanation.includes(normalizeText(anchor)))
    .map((anchor) => `explanation missing anchor ${JSON.stringify(anchor)}`);
}

const currentSnapshots = runFixtures();

if (updateBaseline || !fs.existsSync(baselinePath)) {
  fs.writeFileSync(baselinePath, `${JSON.stringify(currentSnapshots, null, 2)}\n`);
  console.log(`Wrote ${currentSnapshots.length} evaluator snapshots to ${path.relative(repoRoot, baselinePath)}.`);
  process.exit(0);
}

const baseline = loadBaseline();
const baselineById = new Map(baseline.map((snapshot) => [snapshot.id, snapshot]));
const failures = [];

for (const current of currentSnapshots) {
  const expected = baselineById.get(current.id);

  if (!expected) {
    failures.push(`${current.id}: missing from baseline`);
    continue;
  }

  const diffs = [...diffSnapshot(current, expected), ...validateReasoning(current)];
  if (diffs.length > 0) {
    failures.push(`${current.id} (${current.name})\n  ${diffs.join("\n  ")}`);
  }
}

for (const expected of baseline) {
  if (!currentSnapshots.some((snapshot) => snapshot.id === expected.id)) {
    failures.push(`${expected.id}: baseline fixture no longer runs`);
  }
}

if (failures.length > 0) {
  console.error(`Evaluator snapshot regression failures: ${failures.length}`);
  console.error(failures.join("\n\n"));
  console.error("\nIf the change is intentional, review the diffs and run `npm run qa:evaluators:update`.");
  process.exit(1);
}

const categoryCounts = currentSnapshots.reduce((counts, snapshot) => {
  counts[snapshot.category] = (counts[snapshot.category] ?? 0) + 1;
  return counts;
}, {});

console.log(`Evaluator snapshots passed: ${currentSnapshots.length} fixtures.`);
console.log(
  Object.entries(categoryCounts)
    .map(([category, count]) => `${category}: ${count}`)
    .join(" | ")
);
