# Ace Attorney Style Investigation Design

## Purpose

Refine《明舟北渡》from a visually polished dialogue demo into a more complete investigation game. The current visible deduction chain is too explicit: it tells the player what evidence order matters before they discover it. The new design should make the player feel they are reasoning through the shipwreck case themselves.

The game should still follow the earlier project direction:

- A Grand Canal themed AI-derived narrative game.
- Dialogue with historical or fictional NPCs.
- Free-form player input plus generated/recommended options.
- A Grand Canal knowledge base and evidence archive.
- AI-adjacent flow: generated dialogue, generated prompts, knowledge retrieval, summary/achievement output.

## Design Direction

Use an investigation structure inspired by games like《逆转裁判》:

- Investigation is driven by conversation, not by an exposed answer path.
- Evidence is collected through dialogue choices and free questioning.
- The player can present evidence to NPCs.
- Correct evidence changes NPC reactions and unlocks new leads.
- Incorrect evidence produces a characterful refusal, doubt, or “not relevant” reply.
- The final judgement is replaced or preceded by a short cross-examination sequence where the player must answer key questions by presenting evidence.

## Remove Or Weaken Existing Deduction Chain

The large top deduction chain should be removed from the main play screen.

Replace it with a restrained investigation status panel:

- Label: `当前调查`
- Headline: `永乐号为何沉没`
- Small status: `案卷资料 X` or `已归档线索 X`

Do not show all five required clues in order. Do not tell the player which clue comes next. The UI may show progress count, but not the solution structure.

## Dialogue Loop

Each NPC conversation should support three modes.

### Free Questioning

The input box remains available. The player can type a question in natural language. The local/offline AI reply should still answer in the current NPC’s voice. If future API integration is added, this is where the “可交互智能体” is most visible.

### Recommended Topics

The existing suggested choices remain, but their labels should be framed as topics rather than solution hints.

Good labels:

- `谈谈夜航`
- `询问船板`
- `追问漕兵`
- `核对文书`

Avoid labels that reveal the deduction path:

- `下一步查船体`
- `证明人为下药`
- `确认最终原因`

### Present Evidence

Add a visible `出示证据` action in the dialogue panel. It opens a compact evidence selector using already unlocked clue cards.

When the player presents evidence to the active NPC:

- If the evidence is relevant to that NPC, append a special NPC reaction message.
- If the evidence is not relevant, append a short refusal or uncertainty message.
- Relevant evidence may unlock another clue, knowledge card, or new suggested topic.

## NPC Evidence Reactions

Initial mapping for the shipwreck case:

| NPC | Strong Evidence | Reaction Goal |
| --- | --- | --- |
| 王淮远 | `grain-transport-order` | Confirms pressure from transport deadline and official risk. |
| 郑潮生 | `drug-residue`, `soldier-testimony` | Reveals crew symptoms, resentment, and night movement. |
| 林文绮 | `canal-route-fragment` | Connects the case to route changes and post-capital-move transport politics. |
| 苏岫云 | `drug-residue`, `soldier-testimony` | Provides folk-route information and medicine source rumors. |
| 赵秉丰 | `broken-hull-plank`, `grain-transport-order` | Exposes repair cost pressure and merchant involvement. |

This mapping should be data-driven, not hard-coded inside `DialogueScene.tsx`.

## Cross-Examination / Case Hearing

Before final judgement, add a short “案卷质证” flow. This should feel like a compact courtroom/case-review phase rather than a simple multiple-choice ending.

The player must answer 3 prompts by presenting evidence:

1. `永乐号沉没的直接风险是什么？`
   - Expected evidence: `broken-hull-plank`

2. `为什么船队仍在徐州险段冒险赶路？`
   - Expected evidence: `grain-transport-order`

3. `是否存在人为干预的迹象？`
   - Expected evidence: `drug-residue` or `soldier-testimony`

If the player presents correct evidence:

- Advance to the next prompt.
- Show a short confirmation/reasoning message.

If the player presents incorrect evidence:

- Stay on the same prompt.
- Show a gentle contradiction message.
- Do not hard-fail the game.

After all prompts are answered, unlock the final judgement options or directly show a richer case summary.

## AI-Derived Game Loop

The AI component should be visible through function rather than slogans:

- `AI 生成追问`: suggested topics update based on active NPC and collected evidence.
- `AI NPC 回复`: free input produces character-specific replies.
- `大运河知识库`: knowledge and clue cards are unlocked and cited through dialogue.
- `AI 案卷总结`: after case hearing, produce a summary screen with findings, unlocked knowledge, and achievement-style records.

The demo can simulate AI locally for now, but labels and structure should make the AI-derived loop clear for presentation.

## UI Requirements

- The main dialogue scene should stay cinematic and uncluttered.
- Remove the large deduction board from the top center.
- Add a compact `出示证据` button near the free input controls.
- Evidence selector should feel like an in-game case file, not a generic modal.
- Cross-examination should use stronger dramatic UI: a focused question, evidence selector, and response text.
- Do not obscure the character portraits or generated backgrounds.
- Mobile layout can simplify by showing only current investigation status and moving evidence selection into a drawer.

## Implementation Boundaries

Keep existing systems where possible:

- Reuse `unlockedClues` and `unlockedKnowledge`.
- Reuse `clueCards` as evidence selector content.
- Keep `npcDialogueCatalog` for recommended topics.
- Add a new data module for evidence presentation reactions.
- Add a new component for evidence presentation/cross-examination if the UI grows beyond `DialogueScene`.

Avoid broad rewrites:

- Do not replace the entire state model.
- Do not remove free text input.
- Do not add real API calls in this step.
- Do not create multiple new story cases yet.

## Success Criteria

- The player is no longer shown a full ordered solution path.
- The player can freely ask questions and also choose suggested topics.
- The player can present evidence to NPCs.
- Presenting relevant evidence creates meaningful NPC reactions.
- The final case resolution requires at least a short evidence-based reasoning sequence.
- The UI still foregrounds Ming dynasty Grand Canal atmosphere and character art.

