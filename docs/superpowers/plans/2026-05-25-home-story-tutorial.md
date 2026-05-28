# Home Story Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Grand Canal story-background animation to the homepage and a tutorial screen reachable from the homepage.

**Architecture:** Extend the existing app view state with a tutorial view, add one focused tutorial component, and keep homepage navigation callbacks explicit. Styling remains in the existing global stylesheet and uses one generated image asset in `public/assets`.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS animations.

---

### Task 1: App-Level Tests

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add tests that assert the homepage contains "故事背景" and "玩法教程", that clicking "玩法教程" opens tutorial copy, and that "进入案卷馆" moves to the playable archive.

- [ ] **Step 2: Run tests to verify failure**

Run: `corepack pnpm test -- --run src/App.test.tsx`

Expected: failures because the tutorial entry and tutorial view are not implemented yet.

### Task 2: Tutorial View and Navigation

**Files:**
- Create: `src/components/GameTutorial.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/EventHome.tsx`

- [ ] **Step 1: Implement the tutorial component**

Create a component that renders the gameplay steps and buttons for returning home or entering the archive.

- [ ] **Step 2: Wire the app state**

Add a `tutorial` app view, pass `onOpenTutorial` into `EventHome`, and render `GameTutorial` when the view is active.

- [ ] **Step 3: Run the app tests**

Run: `corepack pnpm test -- --run src/App.test.tsx`

Expected: tests pass.

### Task 3: Story Background Asset and Styling

**Files:**
- Create: `public/assets/home-canal-story-bg.png`
- Modify: `src/components/EventHome.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Copy the generated image asset**

Copy the selected Grand Canal wharf image into `public/assets/home-canal-story-bg.png`.

- [ ] **Step 2: Add homepage story markup**

Add a cinematic story section with image, mist, water shimmer, a small boat marker, and story beats.

- [ ] **Step 3: Add CSS**

Style the homepage story section and tutorial screen with historical textures, readable contrast, responsive layout, and subtle animations.

- [ ] **Step 4: Run full verification**

Run: `corepack pnpm test -- --run` and `corepack pnpm build`.

Expected: all tests pass and the production build succeeds.
