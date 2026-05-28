# Expanded Character Dialogue Design

## Goal

Enrich the沉船案 without adding证词矛盾玩法. The game should feel deeper through second-round questions, character motives, and new replies unlocked by clues or case-board insights.

## Approach

Add deterministic follow-up dialogue that appears only after the player has archived relevant clues or formed a研判. This keeps the UI familiar: players still use suggested choices, free问询, 出示证据, and案卷研判.

## Content Direction

- 王淮远: official pressure, fear of missed grain transport, reluctance to blame the bureau.
- 郑潮生: crew hardship, food and medicine suspicion, resentment toward the transport system.
- 林文绮: family stakes, route map, northbound political pressure after the capital move.
- 苏岫云: wharf gossip, theatre back door, medicine source.
- 赵秉丰: repair costs, merchant ships, ledger evasions.

## Feature Rules

- Follow-up choices are tied to the active NPC.
- A follow-up can require one or more clues.
- A follow-up can require one or more insights.
- The same follow-up should not duplicate an existing base choice.
- Follow-ups use the existing `submitSuggestedChoice` path so they can unlock knowledge and clues.

## Non-Goals

- No sentence-by-sentence证词矛盾.
- No new screens.
- No online model requirement.
