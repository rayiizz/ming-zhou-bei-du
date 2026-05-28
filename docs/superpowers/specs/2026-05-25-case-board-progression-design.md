# Case Board Progression Design

## Goal

Make the current沉船案 feel more like a playable investigation loop without adding证词矛盾玩法.

## Scope

This slice adds three pieces:

- Case phases: 初访、追问、案卷研判、结案.
- 案卷研判: players choose two archived clues and ask the智能案牍 to connect them.
- Summary carryover: unlocked研判 appears in the generated journey summary.

## Interaction

The player still advances through free问询、suggested choices、出示证据, and归档. Once clues are unlocked, the player can open案卷研判 inside the dialogue panel, select exactly two clues, and click关联案卷.

If the pair matches a designed insight, the game unlocks a研判 and appends a system message from智能案牍. If the pair does not match, the game gives a soft miss message and keeps progress unchanged.

## Non-Goals

- No证词矛盾 or cross-examination sentence-by-sentence challenge.
- No drag-and-drop evidence wall in this slice.
- No online model call for generated summaries yet; the current智能案牍 is deterministic and presentation-ready.

## Design Notes

The first playable insights are:

- 运粮文书 + 船板异常 -> 急令与劣板
- 迷药残渣 + 漕兵证词 -> 药渣与漕兵口供
- 运粮文书 + 运河路线图残片 -> 急令与残图

This keeps the feature game-like while avoiding excessive hints: the interface lets players try associations, but does not show the answer chain up front.
