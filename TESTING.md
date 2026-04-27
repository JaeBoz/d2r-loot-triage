# D2R Loot Triage App - Manual Smoke Tests

Use this checklist before pushing or deploying. The goal is to catch obvious gameplay-facing regressions, not verify exact scores.

## Rare Boots

- Open Rare Boots triage and confirm `All Resist` is not available as a core or optional affix.
- Enter single resists such as `Fire Resist`, `Lightning Resist`, and `Cold Resist`; confirm they can be represented and affect the result.
- Test strong boots such as `30 FRW + 30+ lightning resist + 30+ fire/cold resist`; expected: clearly useful/tradable, not treated as junk.
- Test weak mixed boots with scattered low rolls; expected: does not inflate into strong trade value.

## Circlets

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
- Test weak or wrong-socket bases; expected: output explains why trade value is limited.

## Uniques

- Test roll-sensitive uniques with low, mid, and top rolls, such as `War Travelers`, `Nagelring`, `Raven Frost`, `Griffon's Eye`, and `Death's Fathom`.
- Expected: weak rolls sound common or limited, mid rolls are not overstated, and top rolls stand out clearly.
- Test newer curated uniques such as `Kira's Guardian`, `Vampire Gaze`, `Verdungo's Hearty Cord`, and `Thunderstroke`; expected: only meaningful roll fields appear and low/top rolls separate clearly.
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
