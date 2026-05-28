# Soft Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add softer game interactions without adding new navigation controls.

**Architecture:** Keep app state and navigation unchanged. Use CSS-only transitions and keyframes on existing scene, portrait, dialogue, choice, and evidence elements so the feature stays lightweight and respects the existing reduced-motion media query.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Soft Motion Styling

**Files:**
- Modify: `src/styles.css`

- [x] **Step 1: Add CSS-only motion**

Add subtle entrance animations to scene metadata, portraits, dialogue panel, options, and evidence presenter. Use opacity/translate/filter only.

- [x] **Step 2: Preserve reduced-motion behavior**

Confirm the existing `@media (prefers-reduced-motion: reduce)` still covers new animations because they use normal CSS `animation` and `transition` properties.

- [x] **Step 3: Run verification**

Run: `corepack pnpm test` and `corepack pnpm build`.

Expected: all tests pass and production build succeeds.
