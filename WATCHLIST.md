# WATCHLIST

Known issues, tuning targets, and QA findings for the D2R Loot Triage App.

Use this file to preserve iteration quality between Codex batches.

---

## Active Issues

### Uniques

### Warlock
- [ ] [Evaluation] Ars Dul'Mephistos mid rolls may feel slightly harsh.
- [ ] [UX] Measured Wrath mid rolls: Keep/High plus niche wording may feel mixed.

### Charms
- [ ] [Data] Charm inputs need size-aware range validation.
- [ ] [UX] Plain / low-demand skillers may still over-signal because `Skiller` is a strong shorthand.

### Jewels
- [ ] [UX] -15 Requirements field is visually numeric but mechanically fixed.
- [ ] [UX] `IAS + res` highlight remains a mild hype-risk watch, especially on weak single-res jewels.

### Circlets
- [ ] [UX] Circlet explanations are too long for fast farming reads.
- [ ] [UX] Weak 2/20 circlets can still feel hypey because the shorthand is powerful.

### Base Checker
- [ ] [UX] Base search selector needs manual mobile/viewport validation for usability.
- [ ] [UX] Base search results can overlap with stale selected-base panel on narrow/mobile viewport.

### Jewelry
- [ ] [Evaluation] High life leech + medium support rings may be slightly inflated.
- [ ] [Evaluation] Ring Moderate breadth remains broad; compare FCR-only, weak leech, and MF/res outputs.

### Amulets

### Boots
- [ ] [Evaluation] Moderate remains broad for boots; no-FRW and FRW dual-res outcomes can share the same tier.
- [ ] [Evaluation] No-FRW boots landing Moderate should remain watched, especially single-res and tri-res cases.

### Guide
- [ ] [Guide] Quick ID Targets lacks explicit Rings and Boots entries
- [ ] [UX] Quick ID Targets should use simple category sections instead of a flat list

---

## In Progress

- [ ] [UX] Contextual highlights are live and mostly passing QA; continue watching hype-risk shorthand.
- [ ] [Evaluation] Premium now has a clearer meaning: standout, clean, high-end outcomes.
- [ ] [Evaluation] High now carries strong-but-incomplete outcomes more cleanly after the amulet/glove Premium narrowing pass.

---

## Resolved

Move completed issues here after implementation and QA confirmation.

Example:
- [x] [Data] Corrected Warlock unique names and roll fields from verified source.
- [x] [Evaluation / UX] Base Checker socket-state separation and base-specific actions completed.
- [x] [UX] GG base contextual highlight completed.
- [x] [UX] Charm, Jewel, and Circlet contextual highlights completed.
- [x] [UX] Duplicate contextual-highlight reasoning cleaned up.
- [x] [UX] Amulet, Ring, and Boot copy/action alignment completed.
- [x] [Evaluation] Weak +2/20 amulets now cap below Premium unless backed by stronger support.
- [x] [Evaluation] +2 Jav / 20 IAS gloves now cap below Premium; +3 Jav / 20 IAS remains Premium.
- [x] [Evaluation] +2 Jav / 20 IAS may be overvalued vs +3 Jav / 20 IAS. Tuning pass verified +2/20 now sits below +3/20.
- [x] [Evaluation] Bow / 20 IAS and Martial Arts / 20 IAS are overvalued without support. Tuning pass verified unsupported non-Jav skill gloves now land lower.
- [x] [UX] Magic skill glove wording ignores skill type. Tuning pass verified Bow and Martial Arts wording now reflects the selected skill type.
- [x] [Data] Rare circlets only allow 1 socket -> fixed (0-2 sockets enabled for rares).
- [x] [Data] Jewel affixes invalid fields -> fixed (removed life leech & strength req; -requirements normalized to -15).
- [x] [Evaluation] Crown of Ages 1os low roll may be too harsh as Drop / Trash -> fixed (1os low roll now lands Low/Conditional instead of Trash).
- [x] [Evaluation] Entropy Locket max rolls may be overvalued as Premium despite niche/self-use positioning -> fixed (max rolls now cap at High Trade Value).
