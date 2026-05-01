# D2R Loot Triage App - Internal Changelog

[2026-05-01]

Change:
- Normalized final result wording across checkers for the 1.0 tone pass.

Type:
- UX

Why:
- Result copy needed to sound more like fast Diablo 2 item triage and less like system-generated analysis.

Impact:
- Decision lines, recommendations, and Why It Matters text are shorter, more player-native, and easier to scan during farming.

Notes:
- Copy-only pass. No evaluation logic, Trade Value tiers, decision mapping behavior, data, pricing, or new features changed.

[2026-05-01]

Change:
- Added final 1.0 trust and scan-speed polish for secondary stat stacks, onboarding, Unique output copy, and amulet phrasing.

Type:
- Evaluation / UX

Why:
- Final QA found secondary-only stats could still read too strong, onboarding guidance was missing, and some result text was too slow to scan.

Impact:
- Secondary-only ring/amulet stacks are capped below clean trade wins, new users get a compact How this works panel, and Unique/Amulet explanations are shorter and less repetitive.

Notes:
- No Trade Value tier names, decision mapping, pricing, new systems, or dataset expansion were added.

[2026-05-01]

Change:
- Extended numeric affix guardrails to Magic Find, leech, attack rating, and min/max damage fields.

Type:
- Data / Evaluation

Why:
- Hostile secondary-stat inputs could still exceed realistic ranges and create fake Premium outcomes.

Impact:
- Rings, amulets, boots, and jewels now clamp the remaining high-impact secondary fields so MF, leech, AR, and damage cannot inflate weak items by themselves.

Notes:
- Reuses the existing guardrail system with conservative caps. No Trade Value tier names, decision mapping, feature changes, or affix simulation were added.

[2026-05-01]

Change:
- Added lightweight numeric guardrails for shared affix inputs, circlet support stats, Jewel caps, and Unique Checker roll ranges.

Type:
- Data / Evaluation

Why:
- Hostile oversized numeric inputs could represent impossible item states and inflate farming decisions.

Impact:
- Rings, amulets, boots, jewels, circlets, and uniques now clamp key numeric inputs so unrealistic values stay grounded while normal strong items still evaluate correctly.

Notes:
- Conservative caps are used where exact ranges are not modeled. No Trade Value tier names, decision mapping, pricing, or broad affix simulation were added.

[2026-04-30]

Change:
- Cleaned up the main header and made Quick ID Targets collapsible with a compact responsive grid.

Type:
- UX

Why:
- The 1.0 interface needed less duplicate state noise, tighter top spacing, and a more stable Quick ID layout.

Impact:
- The checker flow is more prominent, selected ruleset/mode state is shown only by toggles, and Quick ID can be opened only when needed.

Notes:
- No evaluation logic, data, Trade Value tiers, decision mapping, pricing, or checker architecture changes were added.

[2026-04-30]

Change:
- Reworked Quick ID Targets into compact category sections and added Rings and Boots patterns.

Type:
- Guide

Why:
- QA found the flat Quick ID list was fast but did not clearly show category coverage and was missing Rings and Boots.

Impact:
- The panel now gives faster category-based recognition for common jackpot patterns without adding scoring, long guide text, or checker logic.

Notes:
- No evaluation logic, Trade Value tiers, item data, pricing, or checker architecture changes were added.

[2026-04-30]

Change:
- Expanded roll-dependent LOD Unique Triage coverage and roll fields for Death's Fathom, Eschuta's Temper, Nightwing's Veil, The Reaper's Toll, and Windforce.

Type:
- Data

Why:
- These high-signal uniques are common farming hesitation drops where verified variable rolls affect whether the item is worth checking.

Impact:
- Players can now enter the meaningful verified rolls for these uniques, with low rolls staying conservative and strong rolls standing out more clearly.

Notes:
- No global evaluation logic, Trade Value tier, decision mapping, pricing, Warlock data, or checker architecture changes were added. Prompt-suggested fields that are not LOD variable rolls were omitted.

[2026-04-30]

Change:
- Tightened result wording and input clarity for circlets, jewels, amulets, and base search.

Type:
- UX

Why:
- UX QA found several results and controls were slower to scan than needed during farming, with some amulet copy sounding too confident.

Impact:
- Circlet explanations are shorter, Jewel -requirements is a fixed toggle, weak +2/10 FCR amulets are less listing-oriented, mismatched FCR amulets lead with the mismatch, and base search no longer shows stale selected-base details while results are open.

Notes:
- Includes a minimal evaluation adjustment for unsupported +2/10 FCR amulets. No Trade Value tier, decision mapping, data range, pricing, or architecture changes were added.

[2026-04-30]

Change:
- Updated Unique Checker ruleset gating so Reign of the Warlock includes LOD uniques plus Warlock-only additions.

Type:
- UX / Data

Why:
- Warlock gameplay still includes many LOD uniques, so the ruleset toggle should add Warlock data instead of replacing the unique pool.

Impact:
- Warlock mode can now check LOD staples like Stone of Jordan and Arachnid Mesh while still exposing Warlock-only uniques.

Notes:
- Warlock-only uniques remain hidden in LOD. No evaluation, roll range, Trade Value tier, decision mapping, or item coverage changes were added.

[2026-04-30]

Change:
- Added size-aware Charm Checker input guardrails.

Type:
- Data

Why:
- Full-app QA found impossible charm size/stat combinations, such as 45 life on a Small Charm, could be entered.

Impact:
- Charm life, magic find, FRW, and FHR inputs now clamp to size-specific LOD caps where verified, while valid skiller and poison small charm checks remain available.

Notes:
- No Trade Value tier, decision mapping, pricing, poison scoring, or unrelated checker changes were added.

[2026-04-30]

Change:
- Adjusted Crown of Ages and Entropy Locket unique evaluation outliers.

Type:
- Evaluation

Why:
- Full-app QA found weak 1os Crown of Ages rolls were too harsh as Trash, while max Entropy Locket was too high for its niche/self-use position.

Impact:
- Weak Crown of Ages copies now get a low-value second-look floor, while max Entropy Locket caps at High Trade Value instead of Premium.

Notes:
- No data, roll range, Trade Value tier, decision mapping, pricing, or unrelated unique changes were added.

[2026-04-30]

Change:
- Corrected verified circlet and jewel mechanics in the triage inputs.

Type:
- Data

Why:
- The mechanics audit found rare circlets should support 2 sockets, while jewels incorrectly exposed life leech, strength requirement, and sub-15 requirements reduction states.

Impact:
- Rare circlet socket checks and jewel affix entry now better match Standard D2R LOD mechanics during farming triage.

Notes:
- No scoring model, Trade Value tier, decision mapping, pricing, or unrelated checker changes were added.

[2026-04-30]

Change:
- Reframed Boots triage as Rare / Crafted Boots and retuned evaluation around FRW plus support patterns.

Type:
- Evaluation / UX

Why:
- Boots are primarily valued by movement plus resists, FHR, MF, stats, or mana support, and crafted boots are checked in the same practical workflow as rares.

Impact:
- FRW-only and no-FRW boots now read more conservatively, while strong FRW/res/support packages stand out more clearly during farming checks.

Notes:
- No crafting system, pricing, Trade Value tier changes, decision mapping changes, or unrelated checker changes were added.

[2026-04-27]

Change:
- Refined Magic glove tiering and wording.

Type:
- Evaluation

Why:
- QA showed +2 Jav / 20 IAS was too close to +3 Jav / 20 IAS, while Bow and Martial Arts / 20 IAS were overvalued without support.

Impact:
- +3 Jav / 20 IAS remains the premium magic glove hit, +2 Jav / 20 IAS now reads as high-value but lower, and non-Jav skill gloves need support before reaching high value.

Notes:
- Rare/Crafted glove logic, Trade Value tiers, and decision mapping were unchanged.

[2026-04-27]

Change:
- Added Magic / Rare / Crafted Glove Triage.

Type:
- Checker

Why:
- Gloves are a common farming and crafting hesitation point, especially Jav/IAS and Blood craft patterns.

Impact:
- Players can quickly check glove quality, skill/IAS patterns, Crushing Blow, leech, MF, stats, and resist support without a crafting system or pricing tool.

Notes:
- Deterministic pattern-based triage only; no crafting recipes, pricing, broad affix database, or unrelated checker changes.

[2026-04-27]

Change:
- Expanded roll-dependent LOD Unique Triage coverage with Ormus' Robes and Rainbow Facet support, plus richer Andariel's Visage eth handling.

Type:
- Data

Why:
- These common hesitation drops need fast roll-based triage without becoming a price checker.

Impact:
- Players can now compare Ormus skill quality, Rainbow Facet 3-5 rolls, Andariel's eth merc value, and existing Crown of Ages socket/DR/res behavior in the Unique Checker.

Notes:
- Reuses existing unique evaluation patterns; no Trade Value tier, decision mapping, Warlock logic, pricing, or checker architecture changes.

[2026-04-27]

Change:
- Added Warlock-only unique evaluation support for corrected non-Grimoire roll fields.

Type:
- Evaluation

Why:
- Accurate Warlock roll fields were visible, but min/max rolls still evaluated like unsupported trash.

Impact:
- Warlock uniques now scale by their verified item-specific rolls, weak copies receive a conservative low-value floor, and strong supported packages can reach check-worthy or high-end outcomes.

Notes:
- No item names, roll ranges, LOD unique behavior, Trade Value tier names, or decision mapping were changed.

[2026-04-27]

Change:
- Added verified variable roll fields for the non-Grimoire Warlock uniques already in Unique Triage.

Type:
- Data

Why:
- The non-Grimoire Warlock uniques were still name-only after the initial data correction.

Impact:
- Dreadfang, Bloodpact Shard, Wraithstep, Sling, Opalvein, Entropy Locket, Gheed's Wager, and Hellwarden's Will now expose their pasted numeric roll ranges in Warlock mode.

Notes:
- Uses only the authoritative dataset from the task; no scoring logic, Trade Value tiers, decision mapping, LOD data, or item coverage changed.

[2026-04-27]

Change:
- Replaced generated Warlock unique data with prompt-sourced Warlock unique names and Grimoire roll ranges.

Type:
- Data Correction

Why:
- The initial Warlock unique entries used unreliable generated names and ranges, which was trust-breaking for item triage.

Impact:
- Warlock Unique Triage now shows the corrected item names and removes the inaccurate Diablo's Deception, Baal's Betrayal, and Mephisto's Manipulation entries.

Notes:
- Grimoire roll fields use only the ranges pasted in the task; non-Grimoire Warlock uniques were added conservatively without roll fields because no ranges were provided. No Trade Value tiers, decision mapping, or LOD data were changed.

[2026-04-27]

Change:
- Tuned Warlock unique evaluation so isolated `-enemy res` no longer carries a book by itself.

Type:
- Evaluation

Why:
- QA showed `-Enemy Fire/Cold/Lightning Res` could produce Keep / High Trade Value without skill or elemental damage support.

Impact:
- Warlock books now treat `-enemy res` as an amplifier stat that scales with aligned support instead of a standalone hit.

Notes:
- Strong supported roll packages can still reach high-end outcomes; Trade Value tiers, decision mapping, and datasets were unchanged.

[2026-04-27]

Change:
- Added a compact LOD / Reign of the Warlock ruleset toggle.

Type:
- Data / UX

Why:
- Warlock itemization needs to stay separated from Standard LOD triage.

Impact:
- Players can switch rulesets without mixing Warlock-only items into LOD checks.

Notes:
- SCNL / SCL remains available inside both rulesets.

[2026-04-27]

Change:
- Added a minimal mode-gated Warlock unique batch to Unique Triage.

Type:
- Data / Checker

Why:
- Warlock named uniques need early support without adding a new grimoire or item system.

Impact:
- Diablo's Deception, Baal's Betrayal, and Mephisto's Manipulation can be checked only in Reign of the Warlock mode.

Notes:
- Deterministic named-unique roll checks only; no pricing, broad Warlock coverage, or new checker was added.

[2026-04-27]

Change:
- Expanded LOD Unique Triage with Chance Guards, Magefist, Wizardspike, and Stormshield.

Type:
- Data / Checker

Why:
- These Standard D2R uniques commonly create quick farming hesitation but were missing from the curated list.

Impact:
- More staple and roll-sensitive unique drops can be checked without turning the app into a full unique database.

Notes:
- Only meaningful roll fields were exposed.

[2026-04-27]

Change:
- Clarified eth 0os merc base wording in Base Triage.

Type:
- UX

Why:
- Unsocketed eth elite merc bases could sound like finished trade pieces even though socket state still matters.

Impact:
- Output now frames them as good bases with socket potential, not clean finished socket hits.

Notes:
- Wording-only correction; scoring and Trade Value tiers were unchanged.

[2026-04-27]

Change:
- Cleaned up Rare / Crafted Amulet wording for high-FCR amulets with mismatched class skills.

Type:
- UX

Why:
- QA found noisy crafted-style amulet output could imply a mismatched skill was a selling point while also saying the skill did not fit.

Impact:
- Mismatched high-FCR amulets now read as useful FCR shells with niche skill support instead of clean caster hits.

Notes:
- Wording-only correction; scoring, Trade Value tiers, decision mapping, affix ranges, and checker architecture were unchanged.

[2026-04-27]

Change:
- Reframed Ring and Amulet checkers as Rare / Crafted Jewelry triage and added practical crafted-range support for blood ring leech and caster amulet FCR.

Type:
- Data / Checker / UX

Why:
- Rare and crafted jewelry are evaluated in the same farming and crafting workflow, but crafted-only ranges were not clearly represented.

Impact:
- Players can enter high blood-ring life leech and 15-20 FCR caster amulets without a separate crafting system.

Notes:
- No pricing, new checker, broad affix expansion, Trade Value tier change, or decision-output mapping change was added.

[2026-04-27]

Change:
- Expanded Unique Checker coverage with a small curated Standard D2R batch: Highlord's Wrath, Kira's Guardian, Vampire Gaze, Verdungo's Hearty Cord, and Thunderstroke.

Type:
- Checker / Data

Why:
- These uniques commonly create farming hesitation because they are staples, roll-sensitive, or easy to misread as either junk or guaranteed value.

Impact:
- More real unique drops can be triaged quickly with minimal roll inputs and clearer low/mid/top roll separation.

Notes:
- Standard D2R only; no prices, Warlock items, market scraping, decision-output changes, or broad unique database expansion were added.

[2026-04-27]

Change:
- Replaced the main guide entry point with a compact Quick ID Targets strip on the farming screen.

Type:
- UX / Guide

Why:
- The full guide section was not useful during active farming and added an extra decision path.

Impact:
- Players now see a short list of high-signal ID patterns without leaving the checker workflow.

Notes:
- Static guide-layer change only; checker logic, scoring, Trade Value tiers, and decision mapping were unchanged.

[2026-04-27]

Change:
- Cleaned up generated result phrase composition for strong rare rings, amulets, boots, and jewels.

Type:
- UX

Why:
- QA found repeated support wording such as "with X with Y" in strong item results after the D2-native tone pass.

Impact:
- Results now read shorter and more naturally during farming without changing the underlying item decision.

Notes:
- Copy-only composition fix; scoring, item data, Trade Value tiers, and decision mapping were unchanged.

[2026-04-27]

Change:
- Rewrote result explanations, recommended actions, decision caveats, and unique item summaries with shorter D2-native loot/trade wording.

Type:
- UX

Why:
- QA feedback showed some result language felt too generic and analytical for fast D2 farming decisions.

Impact:
- Results now read more like practical price-check/loot-triage notes, with clearer phrases around good rolls, low rolls, staples, socket hits, niche items, and Charsi-level junk.

Notes:
- Wording-only pass; scoring, Trade Value tiers, decision mapping, item data coverage, and checker architecture were unchanged.

[2026-04-26]

Change:
- Calibrated Base and Charm explanation wording to avoid demand contradictions and mid-roll poison overstatement.

Type:
- UX

Why:
- Farming-session QA found minor wording inconsistencies, such as 4os Monarch sounding both low-demand and commonly sought-after, and mid poison charms sounding higher-value than their Trade Value tier.

Impact:
- Explanations now better separate widely used but saturated bases from scarce demand, and describe mid poison small charms as niche/conditional rather than standout hits.

Notes:
- Wording-only change; scoring, Trade Value tiers, decision mapping, and item data coverage were unchanged.

[2026-04-26]

Change:
- Exposed valid socket states for magic circlet-family items in the Circlet Checker, including family-aware socket limits.

Type:
- Checker

Why:
- Farming-session QA found magic circlet socket/support outcomes could not be represented cleanly even though the evaluator already handled socket-aware magic circlet patterns.

Impact:
- Players can now enter magic Circlet/Coronet/Tiara/Diadem socket outcomes for jackpot-pattern triage without impossible socket options.

Notes:
- Evaluation remains deterministic; no pricing, broad affix expansion, rare circlet retuning, or architecture refactor was added.

[2026-04-26]

Change:
- Corrected no-roll staple unique recommended-action wording so obvious keep items no longer mention roll quality.

Type:
- UX

Why:
- Farming-session QA showed Stone of Jordan and Arachnid Mesh displayed the right `Keep` decision but still used roll-sensitive action wording.

Impact:
- No-roll staple uniques now give a cleaner immediate keep/check signal without implying hidden roll evaluation.

Notes:
- Scoring, Trade Value tiers, item data, and decision mapping were unchanged.

[2026-04-26]

Change:
- Tightened result-card hierarchy, compressed checker spacing, and added restrained Diablo-inspired warm accents to the main farming UI.

Type:
- UX

Why:
- The decision-first UI was useful but felt too much like a generic dashboard, with extra spacing and weaker visual emphasis on the final action.

Impact:
- Result cards are faster to scan during repeated farming checks, with the primary decision more prominent and supporting Trade Value details kept secondary.

Notes:
- Evaluation logic, decision mapping, Trade Value tiers, and item data were unchanged.

[2026-04-26]

Change:
- Mapped no-roll staple/chase uniques with strong Trade Value to `Keep` in the decision-first result layer instead of `Check Before Tossing`.

Type:
- UX

Why:
- Items like Stone of Jordan are obvious keep outcomes; asking players to "check before tossing" created unnecessary hesitation during farming.

Impact:
- Staple no-roll uniques now give a clearer immediate action while roll-sensitive uniques, socket-potential bases, and partial rare items keep their existing decision behavior.

Notes:
- Scoring, Trade Value tiers, item data, and evaluator logic were unchanged.

[2026-04-26]

Change:
- Renamed the decision-layer "Check Market" label to "Check Before Tossing" and updated its action line to better match fast farming triage.

Type:
- UX

Why:
- "Check Market" sounded too trade/listing-oriented, while the intended action is to review the item before throwing it away.

Impact:
- Decision-first result cards now feel less like pricing prompts and more like immediate farming guidance.

Notes:
- This was a wording-only change; decision mapping behavior, scoring, data, and Trade Value tiers were unchanged.

[2026-04-26]

Change:
- Added a shared decision-output layer that maps existing results into primary actions like Keep, Check Market, Conditional, or Drop.

Type:
- UX

Why:
- Trade Value tiers were useful but still required players to interpret the final action during fast farming.

Impact:
- Result cards now lead with an immediate decision while preserving Trade Value, recommended action, demand context, score, and explanation as supporting detail.

Notes:
- This is a deterministic presentation layer only; scoring, evaluator logic, item data, and Trade Value tier names were unchanged.

[2026-04-26]

Change:
- Expanded Unique Checker coverage with additional curated staples and roll-sensitive uniques including Harlequin Crest, The Oculus, Gheed's Fortune, Dracul's Grasp, Steelrend, and Wisp Projector.

Type:
- Data

Why:
- Players commonly hesitate on these uniques because some are steady-demand staples while others depend heavily on a small set of meaningful rolls.

Impact:
- More common unique farming drops can now be triaged without turning the checker into a full unique database.

Notes:
- Roll inputs remain minimal and price-free; staple demand floors remain separate from premium top-roll outcomes.

[2026-04-26]

Change:
- Consolidated checker result presentation so Trade Value, recommended action, demand context, score, archetypes, and explanation are easier to scan consistently.

Type:
- UX

Why:
- Farming checks need faster at-a-glance decisions, and the previous result cards separated the final action from the visible verdict.

Impact:
- Users now see the recommended action directly inside the result card, with supporting context and reasoning visually secondary.

Notes:
- This was a UI presentation pass only; evaluation logic, scoring, and Trade Value tier names were unchanged.

[2026-04-24]

Change:
- Calibrated Unique Checker Trade Value floors so high-demand staple uniques can show High Trade Value without being promoted to Premium by default.

Type:
- Checker

Why:
- Testing showed staple uniques like Arachnid Mesh had helpful demand wording but could still display a visible Trade Value tier that felt too weak.

Impact:
- Staple uniques now provide a clearer keep/check signal while roll-sensitive uniques still depend on their actual roll quality.

Notes:
- This does not add prices, new datasets, or a visible liquidity system; Premium remains reserved for chase/top-roll outcomes.

[2026-04-24]

Change:
- Improved demand-aware wording in Base and Unique Checker explanations and recommended actions without adding prices or changing Trade Value tiers.

Type:
- UX

Why:
- Testing showed Trade Value alone was too broad for items that are useful but niche, socket-dependent, or consistently demanded without being premium.

Impact:
- Outputs now better explain whether an item is easy to trade, niche, mostly self-use, socket-dependent, or commonly sought after.

Notes:
- This is wording and action guidance only; no datasets, pricing logic, or checker architecture were changed.

[2026-04-24]

Change:
- Expanded Base Checker coverage with a curated set of additional mercenary polearm/spear bases, armor bases, and paladin shield bases while preserving stricter socket-dependent valuation.

Type:
- Data

Why:
- Live farming feedback showed more real base drops needed representation, but common socket-dependent items still needed to avoid inflated trade-value signals.

Impact:
- Players can now triage more practical runeword and mercenary base drops without turning the Base Checker into a full item database.

Notes:
- The expansion avoids unsupported staffmod-heavy bases and relies only on currently modeled value drivers like sockets, ethereal state, defense/superior state, and paladin all-res automods.

[2026-04-24]

Change:
- Tightened Base Checker trade-value scoring and wording for common socket-dependent bases so unsocketed items read as socket potential rather than clean trade wins.

Type:
- Checker

Why:
- Live testing showed 0-socket common bases like Phase Blade could land too high because future socket potential was being treated like current trade value.

Impact:
- Common unsocketed weapon and shield bases now separate more clearly from correct-socket trade bases, with recommended actions pointing users to socket or re-check before listing.

Notes:
- Ethereal mercenary bases, strong armor bases, paladin automod shields, and circlet-family bases can still retain unsocketed value where socket control is genuinely meaningful.

[2026-04-24]

Change:
- Added a lightweight mechanics-affix validation scaffold for boots, amulets, circlets, and charms so invalid affix keys are filtered or ignored before evaluation.

Type:
- Data

Why:
- Tester feedback showed hand-curated checker inputs can drift into invalid or incomplete affix states without a small mechanics source of truth.

Impact:
- Future checker updates have a safer guardrail against issues like invalid boot all-resist support while preserving the curated triage workflow.

Notes:
- This is a minimal validation layer only; it does not add a full affix database, new UI, or pricing logic.

[2026-04-24]

Change:
- Calibrated Unique Checker messaging and curated notes to separate steady liquidity from raw roll-based trade value, with Arachnid Mesh treated as a high-liquidity caster staple without forcing premium value.

Type:
- Checker

Why:
- Live calibration showed some staple uniques needed clearer demand context so saturated but liquid items did not read the same as premium roll-sensitive outcomes.

Impact:
- Unique results now explain when an item is easy to move because of build demand versus when its actual trade value depends on top-end rolls.

Notes:
- This remains deterministic trade-value triage only; no exact prices or live market data were added.

[2026-04-24]

Change:
- Added secondary mana and mana-regeneration support to Rare Boots triage and adjusted top poison small charm recognition to include 450+ poison damage.

Type:
- Checker

Why:
- Manual smoke testing showed caster utility boots could not represent valid mana-related affixes, and near-top poison small charms were still being undervalued.

Impact:
- Boots can now capture Nova/caster-style mana utility without reintroducing invalid all-resist boots, and high poison small charms read as stronger standalone trade outcomes.

Notes:
- Mana utility remains intentionally secondary and should not inflate weak boots without a real supporting boot pattern.

[2026-04-24]

Change:
- Removed invalid all-resist representation from Rare Boots triage and tuned Circlet triage so socket utility is valued more clearly while rare +2-skills-alone outcomes are treated as partial hits.

Type:
- Checker

Why:
- Live tester feedback showed rare boots could represent an impossible direct all-resist affix, and circlet outputs were too generous for unsupported +2 rare circlets while not clearly rewarding socket utility.

Impact:
- Rare boots now stay closer to valid in-game affixes, and circlet results better separate socket-supported trade pieces from weaker skill-only rolls during fast farming checks.

Notes:
- This was a focused correction pass only and did not expand affix coverage or change checker architecture.

[2026-04-21]

Change:
- Tuned Base Checker explanations and unsocketed eth merc-base handling so newly added runeword and mercenary bases read more believably.

Type:
- Checker

Why:
- Validation showed the new high-signal bases were present, but mercenary polearms and similar bases still needed clearer trade context and slightly better handling for unsocketed eth drops.

Impact:
- Newly added bases like Colossus Voulge, Great Poleaxe, Flail, and Balrog Skin now produce more specific runeword-focused explanations, and unsocketed eth merc bases stand out more clearly.

Notes:
- This was a focused tuning pass only and did not expand the curated base dataset further.

[2026-04-21]

Change:
- Expanded the curated Base Checker dataset with additional high-signal polearms, armor, and utility weapon bases like Colossus Voulge, Great Poleaxe, Balrog Skin, Long Sword, and Flail.

Type:
- Data

Why:
- Recent farming validation showed several common mercenary and runeword bases were still missing from the quick triage list.

Impact:
- Players can now represent more of the practical bases that come up during real farming without turning the Base Checker into a full item catalog.

Notes:
- This stays intentionally curated and focused on trade-relevant bases rather than exhaustive base coverage.

[2026-04-13]

Change:
- Added a global feedback link in the app shell so public testers can quickly report evaluation issues.

Type:
- UX

Why:
- Live public testing needs an easy way for players to report mis-evaluations or representation gaps without interrupting the checker flow.

Impact:
- Testers can now open the structured Google feedback form in a new tab from anywhere in the app.

Notes:
- This stays intentionally lightweight and does not add any in-app feedback system or backend handling.

[2026-04-13]

Change:
- Tuned Rare Boots triage so coherent FRW/resist and utility boot patterns separate more clearly from partial or noisy mixed pairs.

Type:
- Checker

Why:
- Rare boots validation showed some scattered utility rolls were reading a little too close to truly tradable boot combinations.

Impact:
- Strong boot shells now stand out more cleanly, while mixed or filler-heavy boots fall into more believable trade-value tiers with sharper explanations.

Notes:
- This was a focused scoring and explanation pass only and did not change the boot input model or affix-entry flow.

[2026-04-13]

Change:
- Tuned Rare Ring triage so coherent premium combinations separate more clearly from partial hits and noisy mixed rings.

Type:
- Checker

Why:
- Rare ring validation showed some mixed or only partially anchored rings were reading a little too close to true trade winners.

Impact:
- Premium ring shells now stand out more cleanly, while middling mixed rings and weak filler rolls fall into more believable trade-value tiers with clearer explanations.

Notes:
- This was a focused scoring and explanation pass only and did not change the ring input model or affix-entry flow.

[2026-04-13]

Change:
- Tuned Unique Checker roll hierarchy and explanation wording so strong multi-roll uniques stand out more clearly from middling and weak versions.

Type:
- Checker

Why:
- Early validation showed some recent unique additions still read a little too generically, especially when rolls were mixed or when eth-sensitive items needed more item-specific treatment.

Impact:
- Premium and clearly strong unique rolls now separate more cleanly from weak or mixed packages, and eth-sensitive uniques like Titan's Revenge and Reaper's Toll explain their trade context more believably.

Notes:
- This was a focused tuning pass only and did not expand the curated unique list or alter the checker UI flow.

[2026-04-13]

Change:
- Tuned Circlet Checker weighting so partial rare circlet hits no longer sit too close to true jackpot patterns, and improved circlet explanation clarity.

Type:
- Checker

Why:
- Early validation showed standalone rare circlet lines like 20 FCR or +2 skills were reading a bit too close to finished high-end circlets.

Impact:
- Premium 2/20-style circlets still stand out clearly, while weaker partial hits now land in more believable trade-value tiers with clearer explanations.

Notes:
- This was a focused tuning pass only and did not broaden the circlet input set or change the overall checker architecture.

[2026-04-13]

Change:
- Added a dedicated Circlet Checker for magic and rare circlet-family items with deterministic jackpot-pattern triage.

Type:
- Checker

Why:
- Circlets do not fit cleanly inside normal base logic because their value is driven more by affix combinations than by base-state checks.

Impact:
- Circlet, Coronet, Tiara, and Diadem drops can now be screened more cleanly for high-signal trade patterns like magic skill/FCR hits and rare 2/20-style circlets.

Notes:
- This stays curated and compact, and does not replace the temporary circlet-family support still present in the Base Checker.

[2026-04-13]

Change:
- Expanded Unique Triage with more high-signal roll-sensitive uniques and added eth support where it meaningfully affects trade value.

Type:
- Checker

Why:
- The Unique Checker was too slim for real farming use, leaving several important variable-roll uniques and eth-sensitive cases unrepresented.

Impact:
- More commonly checked uniques like Nightwing's Veil, Death's Web, Eschuta's Temper, Crown of Ages, and The Reaper's Toll can now be triaged with clearer roll-based trade guidance.

Notes:
- This stays curated and focused on meaningful roll variance rather than turning the app into a full unique database.

[2026-04-10]

Change:
- Improved Rare Amulet skill-affix coverage with valid +1/+2 class-skill states and curated tree-skill support.

Type:
- Checker

Why:
- Real rare amulet skill outcomes were not fully representable, which caused inaccurate input and weak trade-value reads.

Impact:
- Rare amulets can now be entered more faithfully for class and tree skill rolls, including examples like +1 Druid Skills and Paladin Offensive Auras.

Notes:
- This stays scoped to valid rare-amulet skill affixes and does not expand into broader circlet or exhaustive affix modeling.

[2026-04-10]

Change:
- Added circlet-family support to the Base Checker, including Circlet and Tiara plus superior circlet base-state handling.

Type:
- Checker

Why:
- Circlet-family bases were missing from the Base Checker, so valid farming finds like 2-socket superior circlets could not be represented at all.

Impact:
- The Base Checker can now capture trade-relevant circlet base states like sockets, superior defense, and superior durability in the existing compact flow.

Notes:
- This stays focused on base-state triage only and does not expand into full magic or rare circlet identification.

[2026-04-10]

Change:
- Corrected Base Checker ethereal availability flags so curated bases expose ethereal whenever that is a valid natural item state.

Type:
- Data

Why:
- Several curated bases were hiding a valid ethereal state, which made the checker feel inconsistent with real in-game drops.

Impact:
- The Base Checker now shows ethereal more consistently while still leaving value judgment about eth desirability to the evaluator.

Notes:
- Phase Blade remains non-eth in the base selector because it does not naturally spawn ethereal as a native white base.

[2026-04-10]

Change:
- Corrected top-end poison small charm evaluation so 451 poison rolls are treated as premium standalone hits.

Type:
- Checker

Why:
- Top poison small charms were being undervalued and were reading too close to minor utility outcomes during farming.

Impact:
- Premium poison small charms now surface as high-end trade results with clearer explanation and action guidance.

Notes:
- Lower poison tiers remain niche and do not inherit the top-end premium treatment.

[2026-04-10]

Change:
- Added missing high-impact Charm Checker affixes for poison damage and FRW utility support.

Type:
- Checker

Why:
- Missing charm affixes were causing obvious misreads on frequently checked farming drops and breaking trust in charm triage.

Impact:
- Charm evaluations now better recognize poison small charms and FRW utility charms without changing the existing rule-based structure.

Notes:
- Kept the charm dataset curated and limited to clearly trade-relevant additions.

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
