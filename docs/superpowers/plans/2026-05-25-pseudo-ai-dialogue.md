# Pseudo AI Dialogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make free-text questions feel AI-driven without requiring a paid or hosted model.

**Architecture:** Upgrade the existing offline reply path in `src/game/ai.ts` into a deterministic rule-driven responder. It will classify player text by topic, choose NPC-specific wording, respect unlocked evidence depth, and return useful follow-up suggestions in the same shape the UI already consumes.

**Tech Stack:** TypeScript, Vitest, existing React/Vite app.

---

### Task 1: Topic-Aware Offline Replies

**Files:**
- Modify: `src/game/ai.test.ts`
- Modify: `src/game/ai.ts`

- [ ] **Step 1: Write failing tests**

Add tests that verify:

```ts
it("builds a ship-repair answer for plank questions", () => {
  const reply = buildFallbackAiReply(baseState, "船板是不是早就坏了");

  expect(reply.mode).toBe("offline");
  expect(reply.npcReply).toContain("船板");
  expect(reply.suggestions.map((choice) => choice.label).join("")).toContain("船板");
});

it("changes depth when matching evidence is unlocked", () => {
  const reply = buildFallbackAiReply(
    { ...baseState, unlockedClues: ["broken-hull-plank"] },
    "船板是不是早就坏了"
  );

  expect(reply.npcReply).toContain("案卷里已有");
});
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test -- --run src/game/ai.test.ts`

Expected: FAIL because current fallback only has broad ship/river detection and does not mention evidence depth.

- [ ] **Step 3: Implement topic matching**

Add a small topic classifier for:
- `hull`: 船板、木料、修船、漏水、暗礁
- `drug`: 药、饭、昏迷、困、吃
- `transport`: 漕粮、急令、误期、北上、期限
- `route`: 路线、残图、换船、水口、暗线
- `rumor`: 戏园、码头、传闻、后门、商号

Return NPC-specific text and matching follow-up choices.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test -- --run src/game/ai.test.ts`

Expected: PASS.

### Task 2: Full Verification

**Files:**
- No new files unless TypeScript requires a small helper type.

- [ ] **Step 1: Run full test suite**

Run: `corepack pnpm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `corepack pnpm build`

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-05-25-pseudo-ai-dialogue.md src/game/ai.ts src/game/ai.test.ts
git commit -m "feat: add pseudo ai dialogue"
```
