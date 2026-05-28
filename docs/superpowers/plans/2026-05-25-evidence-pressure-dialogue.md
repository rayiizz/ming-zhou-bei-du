# Evidence Pressure Dialogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make evidence presentation feel like a light deduction mechanic by adding NPC attitude shifts and multi-line evidence reactions.

**Architecture:** Keep the feature inside the existing investigation flow. `evidencePresentation.ts` owns evidence-to-NPC reactions and attitude changes, `types.ts` stores the lightweight NPC pressure state, and `DialogueScene.tsx` renders the current attitude cue near the dialogue controls.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite.

---

### Task 1: Model NPC Attitude

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/game/evidencePresentation.test.ts`
- Modify: `src/game/evidencePresentation.ts`

- [ ] **Step 1: Write the failing test**

Add a test asserting that presenting a fitting clue records a warmer NPC attitude and adds more than one NPC reaction line:

```ts
it("records an attitude shift and staged reaction for fitting evidence", () => {
  const next = presentEvidenceToNpc(baseState, "grain-transport-order");

  expect(next.npcPressure?.["wang-huaiyuan"]).toMatchObject({
    mood: "softened",
    lastCue: expect.stringContaining("语气")
  });
  expect(next.messages.filter((message) => message.speaker === "王淮远").length).toBeGreaterThan(1);
});
```

- [ ] **Step 2: Run the focused test to verify RED**

Run: `corepack pnpm test -- --run src/game/evidencePresentation.test.ts`

Expected: FAIL because `npcPressure` does not exist and evidence reactions are still single-line.

- [ ] **Step 3: Implement minimal state and reactions**

Add:

```ts
export type NpcPressureMood = "neutral" | "softened" | "guarded";

export interface NpcPressureState {
  mood: NpcPressureMood;
  lastCue: string;
}
```

Then add `npcPressure?: Partial<Record<NpcId, NpcPressureState>>` to `InvestigationState`, update evidence reactions to support `replyLines`, and set `softened` for fitting clues or `guarded` for mismatched clues.

- [ ] **Step 4: Run the focused test to verify GREEN**

Run: `corepack pnpm test -- --run src/game/evidencePresentation.test.ts`

Expected: PASS.

### Task 2: Render the Attitude Cue

**Files:**
- Modify: `src/components/DialogueScene.test.tsx`
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing UI test**

Add a test that renders a state with `npcPressure` and expects the cue text to appear:

```tsx
it("shows the active NPC attitude cue during evidence pressure", () => {
  const state = {
    ...storyState(),
    npcPressure: {
      "wang-huaiyuan": { mood: "softened" as const, lastCue: "王淮远的语气松了一些。" }
    }
  };

  render(<DialogueScene state={state} setState={() => {}} onOpenArchive={() => {}} />);

  expect(screen.getByText("王淮远的语气松了一些。")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused UI test to verify RED**

Run: `corepack pnpm test -- --run src/components/DialogueScene.test.tsx`

Expected: FAIL because no attitude cue is rendered.

- [ ] **Step 3: Implement the cue UI**

Read `state.npcPressure?.[state.activeNpcId]` in `DialogueScene.tsx` and render a small atmospheric cue below the speaker name or above the controls. Style it as a period-appropriate, quiet text strip, not a modern meter.

- [ ] **Step 4: Run the focused UI test to verify GREEN**

Run: `corepack pnpm test -- --run src/components/DialogueScene.test.tsx`

Expected: PASS.

### Task 3: Verify Whole Game

**Files:**
- No additional production files unless tests reveal integration issues.

- [ ] **Step 1: Run full tests**

Run: `corepack pnpm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `corepack pnpm build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-05-25-evidence-pressure-dialogue.md src/game/types.ts src/game/evidencePresentation.ts src/game/evidencePresentation.test.ts src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx src/styles.css
git commit -m "feat: add evidence pressure dialogue"
```
