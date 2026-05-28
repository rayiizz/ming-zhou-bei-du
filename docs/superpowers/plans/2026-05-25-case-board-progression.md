# Case Board Progression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a non-contradiction investigation loop where players connect archived clues into case insights.

**Architecture:** Keep deterministic game logic in `src/game/caseProgression.ts` and `src/game/insightBoard.ts`. Store unlocked insight ids on `InvestigationState`, render the board inside `DialogueScene`, and surface completed insights in `JourneySummary`.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Case Phase Logic

**Files:**
- Create: `src/game/caseProgression.ts`
- Test: `src/game/caseProgression.test.ts`
- Modify: `src/game/types.ts`
- Modify: `src/game/investigation.ts`

- [x] Write failing tests for phase one and phase three.
- [x] Add `InsightId` and `unlockedInsights`.
- [x] Implement `getCasePhase`.
- [x] Run targeted tests.

### Task 2: Insight Board Logic

**Files:**
- Create: `src/game/insightBoard.ts`
- Test: `src/game/insightBoard.test.ts`

- [x] Write failing tests for matching and non-matching clue pairs.
- [x] Implement deterministic insight catalog.
- [x] Implement `connectClues`.
- [x] Run targeted tests.

### Task 3: Dialogue UI

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`
- Modify: `src/styles.css`

- [x] Write failing tests for phase display and case-board interaction.
- [x] Render case phase in the investigation status.
- [x] Add案卷研判 panel with two-clue selection.
- [x] Style the panel as an in-world案牍 surface.
- [x] Run component tests.

### Task 4: Summary Output

**Files:**
- Modify: `src/components/JourneySummary.tsx`
- Test: `src/components/JourneySummary.test.tsx`

- [x] Write failing test for summary insight display.
- [x] Render unlocked insights in journey summary.
- [x] Run summary test.

### Task 5: Verification

- [x] Run `corepack pnpm test`.
- [x] Run `corepack pnpm build`.
