# Evidence Presentation Investigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible answer-like deduction chain with a freer investigation loop based on questioning NPCs and presenting evidence.

**Architecture:** Keep `InvestigationState` and unlocked clue cards as the source of truth. Add a data module for NPC evidence reactions, keep the top status lightweight, and render evidence presentation inside `DialogueScene`.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Simplify Investigation Status

**Files:**
- Modify: `src/game/investigationProgress.ts`
- Modify: `src/game/investigationProgress.test.ts`

- [ ] Replace the ordered deduction chain with a minimal `getInvestigationStatus(state)` helper.
- [ ] It should return `headline: "永乐号为何沉没"` and `archiveText: "案卷资料 X"`.
- [ ] Tests should assert no ordered chain is exposed.

### Task 2: Evidence Presentation Data

**Files:**
- Create: `src/game/evidencePresentation.ts`
- Create: `src/game/evidencePresentation.test.ts`

- [ ] Add NPC-to-evidence reactions.
- [ ] Presenting relevant evidence appends player and NPC messages.
- [ ] Presenting irrelevant evidence appends a refusal message.
- [ ] Relevant evidence can unlock a small follow-up clue or knowledge card only where useful.

### Task 3: Dialogue UI

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`
- Modify: `src/styles.css`

- [ ] Remove the visible five-step deduction board from the main screen.
- [ ] Add a compact `当前调查` status.
- [ ] Add a `出示证据` button next to free questioning controls.
- [ ] Evidence selector lists unlocked clues, or an empty state if none are unlocked.
- [ ] Clicking a clue presents it to the active NPC.

### Task 4: Verification

Run:

```bash
corepack pnpm test src/game/investigationProgress.test.ts src/game/evidencePresentation.test.ts src/components/DialogueScene.test.tsx
corepack pnpm build
```

Commit:

```bash
git add docs/superpowers/plans/2026-05-24-evidence-presentation-investigation.md src/game/investigationProgress.ts src/game/investigationProgress.test.ts src/game/evidencePresentation.ts src/game/evidencePresentation.test.ts src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx src/styles.css
git commit -m "feat: add evidence presentation investigation"
```

