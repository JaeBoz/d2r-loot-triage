# D2R Loot Triage App - Data Strategy

This app is a deterministic loot triage tool. It should help players quickly decide whether an item is worth ignoring, checking, keeping, or listing without becoming a price checker, market scraper, or exhaustive item encyclopedia.

## Data Layers

### Mechanics Data

Mechanics data answers: "Can this exist in-game?"

Use it for validation and representation:
- valid affixes by item type
- valid socket counts and socket ranges
- item type rules and quality rules
- roll ranges and variable stat bounds
- ethereal eligibility
- class-specific or item-family restrictions

Mechanics data should come from reliable item/affix references, authoritative community references, or game-data-derived tools where possible. Mechanics data should not encode opinions about value.

### Curated Triage Data

Curated triage data answers: "Does this matter for fast farming decisions?"

Use it for the subset the app actually exposes and evaluates:
- high-signal affixes
- roll-sensitive uniques
- trade-relevant bases
- known charm/jewel/rare-item patterns
- deterministic thresholds and rule explanations

This layer should stay intentionally small. Do not add every valid item or affix just because it exists. Add data only when it improves practical item triage.

### Market Trend Notes

Market trend notes answer: "How liquid or demanded is this kind of item?"

Use them to tune output language, liquidity, and recommended actions:
- high liquidity
- moderate liquidity
- niche liquidity
- premium only on top rolls
- useful self-use but weak trade demand

Market trend notes may be informed by repeated sold records, common trade listings, and long-standing community demand patterns. They should never encode exact prices into the app.

## Source Guidance

- Mechanics validity should be verified before adding or exposing an input.
- Exact roll ranges should come from item references or game-data-derived sources where possible.
- Market-informed tuning should use broad trends, not one-off listings.
- Trade-value tiers should remain deterministic labels, not price estimates.
- Source notes should explain why a rule exists when the reasoning is not obvious.

## Inclusion Rules

Include an item, affix, or rule when it improves farming triage:
- It is high-signal during real drops.
- It is roll-sensitive enough that users need guidance.
- It has broad liquidity or stable build demand.
- It prevents common representation mistakes.
- It captures a known jackpot, niche, or junk-filtering pattern.

Avoid adding data when:
- The affix is valid but rarely affects trade value.
- The item is static, obvious, or low-signal.
- The rule would clutter the UI more than it helps.
- The change pushes the app toward an exhaustive database.
- The value depends on exact pricing rather than triage tiers.

## Game Mode Handling

Standard D2R is the baseline ruleset.

Reign of the Warlock should be treated as a separate mode or context, not as a replacement for Standard D2R:
- Warlock-specific items should be mode-gated.
- Warlock grimoires should be mode-gated.
- Warlock affixes should be mode-gated.
- Warlock bases and runewords should be mode-gated.
- Warlock market/liquidity notes should not overwrite Standard D2R notes.

Future mode-specific changes should be explicit in data and evaluation logic so players can trust which ruleset they are using.

## Future Data Workflow

1. Identify the gameplay friction or tester-reported gap.
2. Verify the mechanic is valid for the item type, quality, and game mode.
3. Check market or liquidity trends if the item has trade relevance.
4. Add the smallest curated deterministic rule or data entry that solves the issue.
5. Test against known real examples and obvious negative examples.
6. Update documentation or changelog when the change affects user-visible behavior.
7. Commit with a concise summary of the gameplay impact.

## Philosophy Check

Before adding data, ask:
- Does this help a player make a faster farming decision?
- Is this mechanically valid?
- Is this worth exposing in a compact UI?
- Can the output explain the decision without prices?
- Does this preserve Standard D2R behavior unless a mode-specific rule is selected?

If the answer is unclear, prefer a guide note or internal TODO over adding a new checker field.
