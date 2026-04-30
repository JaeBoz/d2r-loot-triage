# D2R Loot Triage App - Manual Smoke Tests

Use this checklist before pushing or deploying. The goal is to catch obvious gameplay-facing regressions, not verify exact scores.

## Rulesets

- Load the app fresh; expected: `LOD` is the default active ruleset.
- Open Unique Triage in `LOD`; expected: Standard LOD uniques such as `Stone of Jordan` appear and Warlock-only uniques do not.
- Switch to `Reign of the Warlock`; expected: Warlock-only uniques appear in the Unique Checker.
- Switch back to `LOD`; expected: Warlock-only uniques are hidden again and LOD uniques are available.
- Toggle `SCNL` and `SCL` while in both rulesets; expected: mode switching still works and does not break selected checker navigation.
- Test `Stone of Jordan` in `LOD`; expected: no-roll staple behavior remains unchanged.
- Test one newly added LOD unique such as `Chance Guards` or `Magefist`; expected: minimal roll/no-roll fields appear as appropriate.
- In Warlock mode, confirm corrected names appear: `Ars Al'Diabolos`, `Ars Tor'Baalos`, `Ars Dul'Mephistos`, `Measured Wrath`, `Dreadfang`, `Bloodpact Shard`, `Wraithstep`, `Sling`, `Opalvein`, `Entropy Locket`, `Gheed's Wager`, and `Hellwarden's Will`.
- In `LOD`, confirm those Warlock names are hidden.
- Confirm old inaccurate Warlock names no longer appear: `Diablo's Deception`, `Baal's Betrayal`, and `Mephisto's Manipulation`.
- Select one Grimoire such as `Ars Al'Diabolos` and one non-Grimoire such as `Dreadfang`; expected: both are Warlock-only Unique Checker entries.
- Test `Dreadfang`; expected: `Enhanced Damage` and `Mana Stolen Per Hit` roll inputs are available.
- Test `Bloodpact Shard`; expected: `Bind Demon`, `Blood Boil`, `Blood Oath`, `Increased Maximum Life`, and `Magic Find` roll inputs are available.
- Test `Entropy Locket` or `Gheed's Wager`; expected: their listed Warlock roll inputs are available and no unlisted rolls appear.
- Test `Ars Al'Diabolos` with min, mid, and max rolls; expected: min rolls are low-value but not automatic trash, while max rolls still stand out as premium.
- Test `Measured Wrath` with min, mid, and max rolls; expected: weaker copies stay conservative, but strong copies still improve clearly.
- Test max `Entropy Locket`; expected: caps at High Trade Value, not Premium, because it is more niche/self-use.
- Test a strong non-Grimoire Warlock unique such as max `Gheed's Wager`; expected: strong supported roll packages no longer evaluate as trash.
- Test a weak non-Grimoire Warlock unique such as min `Wraithstep` or min `Opalvein`; expected: weak rolls stay low/conditional, not a fake winner.
- Test isolated `-Enemy Magic Resistance` on `Sling`, `Gheed's Wager`, or `Hellwarden's Will`; expected: it does not reach high value by itself.

## Rare / Crafted Boots

- Open Rare / Crafted Boots triage and confirm `All Resist` is not available as a core or optional affix.
- Enter single resists such as `Fire Resist`, `Lightning Resist`, and `Cold Resist`; confirm they can be represented and affect the result.
- Test `30 FRW` only; expected: low/filler value because FRW needs support.
- Test no-FRW weak stats; expected: Drop/Trash or clearly self-use only.
- Test high dual res without FRW; expected: conditional/moderate at most because there is no movement roll.
- Test `30 FRW + dual res`; expected: moderate/check-worthy, not automatically premium without support.
- Test `30 FRW + triple res + support`; expected: clearly strong and can reach premium.
- Test `30 FRW + FHR + dual res`; expected: strong/high because the support lines fit together.
- Test `30 FRW + MF` only; expected: low/moderate unless support is present.
- Test `30 FRW + MF + res`; expected: worth checking when rolls are strong.
- Test mana or mana regeneration only; expected: does not carry value by itself.
- Test weak mixed boots with scattered low rolls; expected: does not inflate into strong trade value.

## Magic / Rare / Crafted Gloves

- Test magic `+3 Javelin and Spear / 20 IAS`; expected: Premium glove hit.
- Test magic `+2 Javelin and Spear / 20 IAS`; expected: High, clearly worth checking but below +3/20.
- Test magic `+3 Javelin and Spear` with no IAS; expected: conditional/low, not a clean trade hit.
- Test magic `Bow and Crossbow / 20 IAS`; expected: Moderate unless supported by strong stats.
- Test magic `Martial Arts / 20 IAS`; expected: Moderate unless supported by strong stats.
- Test magic `Bow and Crossbow / 20 IAS + strong support`; expected: High.
- Test rare or crafted `20 IAS` only; expected: low value, not overhyped.
- Test crafted `Crushing Blow` only; expected: low at most.
- Test crafted `Crushing Blow + 20 IAS + support`; expected: check-worthy/high.
- Test weak no-IAS gloves with filler stats; expected: Charsi/drop.
- Test `20 IAS + MF/support`; expected: worth checking only when support is strong enough.

## Circlets

- Test a rare circlet socket selector; expected: `0`, `1`, and `2` sockets are selectable.
- Test a rare circlet with only `+2 class skills`; expected: reads as a partial hit, not a clear jackpot.
- Test a rare circlet with `+2 class skills + 20 FCR`; expected: strong caster result with trade-aware explanation.
- Add a socket to a rare circlet with useful support; expected: socket utility is mentioned and improves the result.
- Test a magic circlet with multiple sockets and FRW or other support; expected: sockets are treated as an important value driver.
- Test magic circlet-family socket options by family; expected: Circlet/Coronet allow up to 2 sockets, Tiara/Diadem allow up to 3 sockets, and no impossible socket states appear.
- Test a socketless weak magic circlet; expected: sockets being available does not inflate weak/no-support magic circlets.
- Re-check rare `+2 skills only` and rare `2/20` style circlets after magic socket testing; expected: rare circlet behavior remains unchanged.

## Bases

- Confirm recently added bases such as `Colossus Voulge`, `Great Poleaxe`, `Balrog Skin`, `Long Sword`, and `Flail` appear in Base Checker search.
- Select each new base and confirm socket options are possible for that base only.
- Test ethereal mercenary bases such as eth polearms; expected: eth status improves relevant merc/runeword value.
- Test eth `0os Thresher`; expected: wording says it is a good base with socket potential, but not a finished clean trade piece yet.
- Test weak or wrong-socket bases; expected: output explains why trade value is limited.

## Jewels

- Open Jewel Triage and confirm `Life Leech` is not available as a core or optional affix.
- Open Jewel Triage and confirm `Strength Req` is not available as a core or optional affix.
- Add `-15 Requirements`; expected: it behaves as the fixed verified `-15` jewel affix, not as an arbitrary lower numeric range.

## Rare / Crafted Jewelry

- Test a weak rare-style FCR ring; expected: one useful FCR line alone does not inflate into a strong trade item.
- Test a strong rare-style FCR ring with stats and resists; expected: reads as a real caster ring worth checking.
- Test a blood-style ring with high life leech but weak support; expected: high leech is represented but does not carry the ring by itself.
- Test a blood-style ring with high life leech, attack rating, and melee support; expected: reads as a stronger melee/blood craft candidate.
- Test a weak `+skills / 10 FCR` amulet; expected: partial hit, not an automatic premium.
- Test a strong `+skills / 10 FCR` rare-style amulet; expected: strong caster result when support stats are present.
- Test crafted-style `15 FCR` and `20 FCR` caster amulets; expected: higher FCR is represented and explained, but still needs support to become a true winner.

## Uniques

- Test roll-sensitive uniques with low, mid, and top rolls, such as `War Travelers`, `Nagelring`, `Raven Frost`, `Griffon's Eye`, and `Death's Fathom`.
- Expected: weak rolls sound common or limited, mid rolls are not overstated, and top rolls stand out clearly.
- Test newer curated uniques such as `Kira's Guardian`, `Vampire Gaze`, `Verdungo's Hearty Cord`, and `Thunderstroke`; expected: only meaningful roll fields appear and low/top rolls separate clearly.
- Test `Ormus' Robes` with a wrong/low-demand skill versus a desirable skill and high elemental damage; expected: wrong skill stays low, while a good skill plus strong damage is worth checking.
- Test `Crown of Ages` with `1 socket` and low defensive rolls; expected: not Trash, but still a weak/conditional CoA.
- Test `Crown of Ages` with `2 sockets` and high DR/res; expected: sockets drive the value and the 2os high-roll copy still stands out as Premium.
- Test `Andariel's Visage` non-eth with weak rolls versus eth with high strength/leech; expected: eth merc copies get the better signal.
- Test `Rainbow Facet` with low rolls versus perfect `5/5`; expected: low facets are not overhyped, perfect rolls stand out clearly.
- Test `Highlord's Wrath`; expected: no roll input is needed and it reads as a staple keep/check item rather than a roll chase.
- For eth-sensitive uniques, confirm ethereal state only helps when it makes sense for that item.
- Test no-roll staple uniques such as `Stone of Jordan` and `Arachnid Mesh`; expected: decision label reads `Keep`, not `Check Before Tossing`.
- Test a mid roll-sensitive unique; expected: decision label can still read `Check Before Tossing` when roll quality deserves review but is not an automatic keep.

## Charms

- Test a top poison small charm such as `451 poison damage`; expected: high-end standalone trade relevance is clear.
- Test lower poison values; expected: does not inflate into premium trade value.
- Test common valuable patterns such as `7 MF small charm`, `life + resist small charm`, and plain skill grand charm; expected: tradability is clearly communicated.
- Test charm FRW-related inputs if present; expected: they remain representable and do not overpower stronger charm patterns.

## Final Pass

- Toggle between `SCNL` and `SCL` on a few scenarios; expected: wording and liquidity feel mode-aware without changing the workflow.
- Use Reset/Clear on active checkers; expected: inputs and results clear while the selected game mode remains intact.
- Check the app on a narrow/mobile viewport; expected: forms remain compact and usable.
- Test an unsocketed socket-potential base and a moderate partial rare item; expected: socket potential remains `Conditional`, while partial rares remain `Check Before Tossing` or `Conditional` based on existing mapping.
