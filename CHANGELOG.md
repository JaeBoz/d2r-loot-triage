# D2R Loot Triage App — Internal Changelog

[2026-04-10]

Change:
- Replaced generic rare amulet class-skill handling with specific class-skill selection and class-aware evaluation support.

Type:
- Checker

Why:
- Generic +class skills handling was causing misleading rare amulet trade-value reads.

Impact:
- Rare amulets now produce more believable trade-value output for specific class-skill rolls during farming.

Notes:
- Keeps the current deterministic evaluator structure without adding a broader class-archetype system.

[2026-04-10]

Change:
- Simplified the main app shell into a compact control bar and reduced guide clutter on the home screen.

Type:
- UX

Why:
- The top area and guide promos were taking too much space away from the checker workflow.

Impact:
- The main screen now feels lighter and keeps the active checker more prominent during repeated item checks.

[2026-04-10]

Change:
- Added Quick ID Targets as a static guide section for narrow jackpot identification items like magic gloves, rare barbarian helms, and magic javelins.

Type:
- Guide

Why:
- Some ID targets are best handled as fast pattern-recognition reminders rather than full checkers.

Impact:
- Players can recognize hit-or-junk identification outcomes faster without opening a dedicated evaluator.

[2026-04-08]

Change:
- Expanded the Base Checker with a searchable base selector, base-aware socket options, 0-socket support, and broader curated base coverage.

Type:
- Checker

Why:
- The growing base list had become awkward to use, and some unsocketed but trade-relevant bases were not being surfaced well.

Impact:
- Base triage is faster, avoids impossible socket states, and gives clearer trade guidance for practical farming drops.

[2026-04-08]

Change:
- Shifted result framing from Priority to Trade Value across the app and upgraded the reference area with market-oriented static guides.

Type:
- UX

Why:
- Trade relevance is more intuitive for farming decisions than abstract priority language.

Impact:
- Results now read more like actionable market triage, with clearer SCNL/SCL context and static trade-reference support.

Notes:
- This pass also introduced the Rune Trade Guide and expanded static guide content like Magic Items Worth Checking.

[2026-04-08]

Change:
- Added Unique Triage with curated staple uniques and roll-sensitive evaluation for key variable items.

Type:
- Checker

Why:
- Players needed fast keep-or-list guidance for common staple uniques without checking every roll manually.

Impact:
- Curated uniques can now be triaged quickly based on both item importance and the rolls that actually matter.

[2026-04-08]

Change:
- Added Jewel Triage with deterministic handling for IAS, ED, resist, -requirements, and other trade-relevant jewel patterns.

Type:
- Checker

Why:
- Tradable jewels are easy to miss without quick pattern-based evaluation.

Impact:
- Useful and tradable jewels are easier to separate from weak mixed-stat filler during farming.

[2026-04-08]

Change:
- Added Charm Triage with pattern-based evaluation for small, large, and grand charms, including skillers and known small charm jackpots.

Type:
- Checker

Why:
- Charm value often depends on recognizable patterns rather than raw stat totals.

Impact:
- Players can quickly identify which charms are usable, tradable, or premium without overchecking junk.

[2026-04-08]

Change:
- Added Rare Amulet Triage and Rare Ring Triage for fast deterministic evaluation of common rare-item trade patterns.

Type:
- Checker

Why:
- Rare jewelry needed lightweight triage support for repeated farming use.

Impact:
- Rings and amulets can now be screened quickly for self-use, listing, or junk outcomes.

[2026-04-08]

Change:
- Added the controlled dynamic affix-entry system and Rare Boots Triage.

Type:
- Checker

Why:
- Rare and variance-based items needed broader affix coverage without turning into giant cluttered forms.

Impact:
- Optional affixes can be captured when relevant, while Rare Boots now supports fast trade-value checks for common utility patterns.

Notes:
- The affix-entry system was designed to stay reusable for future rare-item expansions.

[2026-04-08]

Change:
- Built the initial app scaffold and shipped the first Base Checker-centered MVP with local structured data and deterministic rules.

Type:
- Checker

Why:
- The project needed a lightweight foundation for fast D2R loot triage without OCR, accounts, or external APIs.

Impact:
- Established the app structure, local rules/data model, dark-mode UI, and the first completed triage workflow.
