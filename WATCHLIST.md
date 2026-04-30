# WATCHLIST

Known issues, tuning targets, and QA findings for the D2R Loot Triage App.

Use this file to preserve iteration quality between Codex batches.

---

## Active Issues

### Gloves
- [ ] [Evaluation] IAS + weak support may be inflated.

### Uniques

### Warlock
- [ ] [Evaluation] Ars Dul'Mephistos mid rolls may feel slightly harsh.
- [ ] [UX] Measured Wrath mid rolls: Keep/High plus niche wording may feel mixed.

### Charms
- [ ] [Data] Charm inputs need size-aware range validation.

### Jewels
- [ ] [UX] -15 Requirements field is visually numeric but mechanically fixed.

### Circlets
- [ ] [UX] Circlet explanations are too long for fast farming reads.

### Base Checker
- [ ] [UX] Base search selector needs manual mobile/viewport validation for usability.
- [ ] [UX] Base search results can overlap with stale selected-base panel on narrow/mobile viewport.

### Jewelry
- [ ] [Evaluation] High life leech + medium support rings may be slightly inflated.
- [ ] [Evaluation] 15 FCR crafted amulets vs fully supported caster amulets may need clearer separation.
- [ ] [Evaluation] +2 / 10 FCR with weak support may land slightly high.

### Amulets
- [ ] [UX] Weak +2 / 10 FCR amulet uses overly confident listing-oriented action copy.
- [ ] [UX] Mismatched +20 FCR amulet opener sounds too positive before explaining mismatch.

---

## In Progress

None.

---

## Resolved

Move completed issues here after implementation and QA confirmation.

Example:
- [x] [Data] Corrected Warlock unique names and roll fields from verified source.
- [x] [Evaluation] +2 Jav / 20 IAS may be overvalued vs +3 Jav / 20 IAS. Tuning pass verified +2/20 now sits below +3/20.
- [x] [Evaluation] Bow / 20 IAS and Martial Arts / 20 IAS are overvalued without support. Tuning pass verified unsupported non-Jav skill gloves now land lower.
- [x] [UX] Magic skill glove wording ignores skill type. Tuning pass verified Bow and Martial Arts wording now reflects the selected skill type.
- [x] [Data] Rare circlets only allow 1 socket -> fixed (0-2 sockets enabled for rares).
- [x] [Data] Jewel affixes invalid fields -> fixed (removed life leech & strength req; -requirements normalized to -15).
- [x] [Evaluation] Crown of Ages 1os low roll may be too harsh as Drop / Trash -> fixed (1os low roll now lands Low/Conditional instead of Trash).
- [x] [Evaluation] Entropy Locket max rolls may be overvalued as Premium despite niche/self-use positioning -> fixed (max rolls now cap at High Trade Value).
