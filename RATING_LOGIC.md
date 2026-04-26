# D2R Loot Triage App - Trade Value Rating Logic

This app uses deterministic Trade Value tiers to help players decide what to do during farming. These tiers are not prices. They describe how strongly an item is worth keeping, checking, or listing based on current item state, known demand, and curated triage rules.

## Core Principle

Trade Value should describe the item as it exists now.

Future potential can be mentioned in the explanation or recommended action, but it should not automatically inflate the visible Trade Value tier.

Examples:
- A `0os Phase Blade` has socket potential, but limited current trade value.
- A plain high-demand staple unique can be easy to trade without being Premium.
- A rare item with one good line is not automatically valuable unless the full package works.

## Tier Semantics

### Trash

Meaning:
- No meaningful trade value.
- Does not match a known useful pattern.
- May be self-use only if the player personally needs it.

Expected action:
- Ignore.
- Keep only for immediate personal use.

### Low Trade Value

Meaning:
- Some relevant property exists, but demand is weak, niche, incomplete, or socket/roll dependent.
- The item may have future potential but is not a clean trade item as-is.

Expected action:
- Usually ignore.
- Keep only if you plan to socket, craft, test a niche use case, or need a self-use placeholder.

### Moderate Trade Value

Meaning:
- The item has real usefulness or partial trade relevance.
- It may be worth checking, but demand is selective or the item is missing a key roll/socket/mod.
- This tier should not be used just because an item has a theoretical use case.

Expected action:
- Keep if stash space allows.
- Check more carefully before tossing.
- Do not assume it is easy to sell.

### High Trade Value

Meaning:
- Clearly worth keeping or checking.
- Matches a known tradable pattern, staple demand case, correct socket state, or strong coherent roll package.
- Not necessarily a top-end or perfect item.

Expected action:
- Keep.
- Check market activity.
- List if the item state or roll package is competitive.

### Premium Trade Value

Meaning:
- True chase, jackpot, or top-roll outcome.
- Should stand out immediately.
- Reserved for high-end patterns, premium roll packages, or rare combinations that are clearly above normal tradable items.

Expected action:
- Always keep/check.
- Compare against strong examples before listing.
- Do not treat Premium as merely "useful."

## Concepts To Keep Separate

### Current Trade Value

Current Trade Value is the visible tier. It should reflect the item as entered right now.

Correct sockets, high rolls, coherent affix packages, and known premium patterns should raise current Trade Value.

### Future / Socket / Crafting Potential

Future potential belongs in explanation and recommended action.

It should not automatically lift an item to Moderate or High Trade Value unless the current item state itself is desirable.

### Self-Use Value

Self-use is not the same as trade value.

Progression items, usable placeholders, and cheap build enablers can be useful without being easy to trade.

### Niche Demand

Niche demand means a specific buyer or build may care, but the item is not broadly liquid.

Niche items should usually sit at Low or Moderate unless the roll package is unusually strong.

### Staple Demand

Staple demand means the item is commonly sought after by many builds.

Staples can reach High Trade Value even without being Premium, especially when they are easy to recognize and consistently kept.

### Top-Roll / Chase Outcomes

Top-roll or chase outcomes are the main home for Premium Trade Value.

This includes excellent roll-sensitive uniques, true jackpot circlets, premium charm patterns, and rare items with coherent high-end packages.

## Checker-Specific Guidance

### Bases

- Be strict about current-state value.
- Correct sockets should carry most of the trade signal for socket-dependent common bases.
- Unsocketed common weapons and shields should usually read as potential, not clean trade value.
- Unsocketed eth mercenary bases may retain value when socket control is genuinely meaningful.
- Explanations should distinguish "socket potential" from "trade value as-is."

### Uniques

- Separate staple demand from premium roll value.
- High-demand staples can be High Trade Value without being Premium.
- Premium should usually require a chase item, strong roll package, or top-end roll-sensitive outcome.
- Weak rolls on roll-sensitive uniques should not be saved by item name alone.

### Charms

- Strongly recognize true high-end patterns.
- Premium belongs to patterns like top poison small charms, strong skiller secondaries, and other known jackpot charm outcomes.
- Plain useful charms can be High if commonly tradable, but should not become Premium without a premium modifier or pattern.

### Rare Rings, Amulets, And Boots

- Reward coherent packages, not isolated good lines.
- One strong stat should usually be a partial hit unless paired with meaningful support.
- Caster, melee, MF, and utility patterns should be judged by synergy.
- Weak mixed rolls should not accumulate into fake trade value.

### Circlets

- Reward jackpot combinations.
- +skills alone is usually a partial hit.
- Skills plus FCR, sockets, FRW, stats, life, or resists should separate stronger outcomes.
- Magic and rare circlets should keep different value paths where appropriate.

## Anti-Patterns

- Do not rate something Moderate just because it has a theoretical use case.
- Do not inflate weak items because the explanation contains useful education.
- Do not confuse easy self-use with trade value.
- Do not make Premium mean merely "useful."
- Do not let future socket/crafting potential overpower current item state.
- Do not hide niche demand behind overly confident recommended actions.
- Do not collapse staple demand and premium roll value into the same tier.

## Tuning Checklist

Before changing a checker score or threshold, ask:
- What is the item's current trade value as entered?
- Is the value broad demand, niche demand, self-use, or future potential?
- Does the visible tier match the recommended action?
- Would a player reasonably keep/check this during farming?
- Is Premium reserved for something that truly stands out?
