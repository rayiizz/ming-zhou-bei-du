# Objective And Deduction Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a current objective strip and a compact evidence deduction board to make the shipwreck investigation feel like a complete playable case.

**Architecture:** Keep the existing `InvestigationState` and clue unlock flow. Add a small derived-data module for objectives and deduction chain status, then render it inside `DialogueScene` without changing reducers.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Derived Investigation Progress Data

**Files:**
- Create: `src/game/investigationProgress.ts`
- Create: `src/game/investigationProgress.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { getDeductionChain, getInvestigationObjective } from "./investigationProgress";

const baseState: InvestigationState = {
  view: "story",
  selectedEventId: "yongle-shipwreck",
  activeNpcId: "wang-huaiyuan",
  phase: "interviews",
  messages: [],
  unlockedKnowledge: [],
  unlockedClues: [],
  aiMode: "offline"
};

describe("investigationProgress", () => {
  it("summarizes the current objective from clue progress", () => {
    expect(getInvestigationObjective(baseState).headline).toBe("查明永乐号沉船原因");
    expect(getInvestigationObjective(baseState).progressText).toBe("关键线索 0/5");
    expect(getInvestigationObjective({ ...baseState, unlockedClues: ["grain-transport-order"] }).hint).toContain("船体");
  });

  it("marks deduction chain cards as unlocked from state", () => {
    const chain = getDeductionChain({ ...baseState, unlockedClues: ["grain-transport-order", "broken-hull-plank"] });
    expect(chain).toHaveLength(5);
    expect(chain[0]).toMatchObject({ id: "grain-transport-order", unlocked: true });
    expect(chain[1]).toMatchObject({ id: "broken-hull-plank", unlocked: true });
    expect(chain[2]).toMatchObject({ id: "drug-residue", unlocked: false });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm test src/game/investigationProgress.test.ts`

Expected: FAIL because `src/game/investigationProgress.ts` does not exist.

- [ ] **Step 3: Implement progress helpers**

Create `src/game/investigationProgress.ts` with exported `getInvestigationObjective` and `getDeductionChain`.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm test src/game/investigationProgress.test.ts`

Expected: PASS.

### Task 2: Render Objective Strip And Deduction Board

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing component test**

Add a test that renders `DialogueScene` and expects:
- `当前目标`
- `查明永乐号沉船原因`
- `推理链`
- at least one unlocked/locked deduction card label

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm test src/components/DialogueScene.test.tsx`

Expected: FAIL because the objective and deduction board are not rendered.

- [ ] **Step 3: Render derived progress data**

Import the progress helpers in `DialogueScene.tsx` and render a compact overlay above the dialogue panel.

- [ ] **Step 4: Add CSS**

Add restrained historical UI styling for `.objective-strip`, `.deduction-board`, and deduction card states. Keep it compact so it does not hide character art.

- [ ] **Step 5: Run component test**

Run: `corepack pnpm test src/components/DialogueScene.test.tsx`

Expected: PASS.

### Task 3: Verify Build And Commit

**Files:**
- All files changed above.

- [ ] **Step 1: Run focused and production verification**

Run:
```bash
corepack pnpm test src/game/investigationProgress.test.ts src/components/DialogueScene.test.tsx
corepack pnpm build
```

Expected: all tests and build pass.

- [ ] **Step 2: Commit**

```bash
git add src/game/investigationProgress.ts src/game/investigationProgress.test.ts src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx src/styles.css docs/superpowers/plans/2026-05-24-objective-and-deduction-board.md
git commit -m "feat: add investigation objective board"
```

