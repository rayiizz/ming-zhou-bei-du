# Expanded Character Dialogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add second-round NPC dialogue that appears after the player unlocks clues or insights.

**Architecture:** Keep base NPC choices in `npcDialogue.ts`; add conditional follow-up choices in a new `followUpDialogue.ts`. `DialogueScene` combines base choices with current follow-ups and still uses the existing `submitSuggestedChoice` reducer.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

---

### Task 1: Follow-Up Dialogue Logic

**Files:**
- Create: `src/game/followUpDialogue.ts`
- Test: `src/game/followUpDialogue.test.ts`

- [ ] **Step 1: Write failing tests**

Test that王淮远 receives a follow-up after `rush-and-rotten-plank`, and that郑潮生 receives one after `drugged-crew`.

- [ ] **Step 2: Verify red**

Run: `corepack pnpm test src/game/followUpDialogue.test.ts`

Expected: FAIL because `followUpDialogue.ts` does not exist.

- [ ] **Step 3: Implement follow-up catalog**

Create a small catalog keyed by NPC and gated by clues or insights.

- [ ] **Step 4: Verify green**

Run: `corepack pnpm test src/game/followUpDialogue.test.ts`

Expected: PASS.

### Task 2: DialogueScene Integration

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Write failing UI test**

Render a state with `rush-and-rotten-plank`, expect the new王淮远 follow-up button.

- [ ] **Step 2: Wire follow-ups**

Import `getFollowUpChoices`, combine them with current suggestions, and render the combined list.

- [ ] **Step 3: Verify component test**

Run: `corepack pnpm test src/components/DialogueScene.test.tsx`

Expected: PASS.

### Task 3: Verification

- [ ] Run `corepack pnpm test`.
- [ ] Run `corepack pnpm build`.
