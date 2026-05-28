# Linqing Customs Full Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete playable second chapter, "临清钞关疑账", with matching visual novel UI, dialogue, evidence, pseudo-AI questioning, prologue animation, portraits, backgrounds, and an ending summary.

**Architecture:** Keep the current shipwreck chapter intact. Add a self-contained `LinqingChapter` flow that is entered from the existing event catalog and uses the same visual language as `DialogueScene`: two-character staging, background scene changes, evidence drawer, free inquiry, evidence pressure, and final dossier judgement. This avoids destabilizing the mature shipwreck investigation state while still making the second chapter feel complete.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, generated/static raster assets in `public/assets/`.

---

### Task 1: Make Linqing Playable From Home

**Files:**
- Modify: `src/game/events.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing test**

Add a test that clicks the "临清钞关与运河商贸" card and expects a Linqing prologue view.

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test -- --run src/App.test.tsx`

Expected: FAIL because the event is archive-only and no Linqing flow exists.

- [ ] **Step 3: Implement routing**

Set `linqing-customs` to playable, route it to a new prologue/chapter view, and keep `nanwang-water-divide` as expansion.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test -- --run src/App.test.tsx`

Expected: PASS.

### Task 2: Add Linqing Chapter Data and UI

**Files:**
- Create: `src/game/linqingChapter.ts`
- Create: `src/components/LinqingChapter.tsx`
- Create: `src/components/LinqingChapter.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing tests**

Verify the chapter renders:
- title `临清钞关疑账`
- four NPC buttons
- free inquiry input
- evidence button
- final dossier button after enough evidence

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test -- --run src/components/LinqingChapter.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement data and component**

Create four NPCs: `顾承槐`, `罗万舟`, `马三`, `许应年`. Add their identities, opening lines, suggested questions, evidence unlocks, and final judgement options. Reuse visual classes from shipwreck where possible and add `linqing-*` classes for background/portrait art.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test -- --run src/components/LinqingChapter.test.tsx`

Expected: PASS.

### Task 3: Add Linqing Prologue Animation

**Files:**
- Create: `src/components/LinqingPrologue.tsx`
- Create: `src/components/LinqingPrologue.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing tests**

Verify the prologue uses four images, holds the archive entry button until the narration completes, and includes one-line background narration.

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test -- --run src/components/LinqingPrologue.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement prologue**

Follow `StoryPrologue` behavior but use Linqing-specific narration and image paths.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test -- --run src/components/LinqingPrologue.test.tsx`

Expected: PASS.

### Task 4: Generate and Wire Visual Assets

**Files:**
- Create assets under `public/assets/linqing/`
- Modify: `src/game/linqingChapter.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Generate project-bound raster assets**

Use the image generation skill to produce:
- 4 prologue/background images: city gate, customs wharf, night cargo yard, tax office ledger room
- 4 NPC portrait cutouts: Gu Chenghuai, Luo Wanzhou, Ma San, Xu Yingnian

- [ ] **Step 2: Save assets to workspace**

Move final assets into `public/assets/linqing/` with stable names.

- [ ] **Step 3: Wire paths**

Reference the assets from Linqing prologue and chapter UI.

### Task 5: Full Verification and Commit

**Files:**
- All changed files from previous tasks.

- [ ] **Step 1: Run full tests**

Run: `corepack pnpm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `corepack pnpm build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Commit**

```bash
git add src public docs/superpowers/plans/2026-05-25-linqing-customs-full-chapter.md
git commit -m "feat: add linqing customs chapter"
```
