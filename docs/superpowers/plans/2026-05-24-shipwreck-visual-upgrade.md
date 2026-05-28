# Shipwreck Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the “永乐号沉船案” scene into a more polished semi-realistic historical dialogue-game experience with stronger Grand Canal atmosphere, improved character presentation, 3A-inspired dialogue staging, and restrained animation.

**Architecture:** Keep the existing React/Vite state model and investigation flow. Add presentational metadata and scene layers in `DialogueScene.tsx`, concentrate visual changes in `src/styles.css`, and optionally add generated bitmap assets under `public/assets/` without changing the investigation reducer contracts.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS animations, existing bitmap assets in `public/assets/`.

---

## File Structure

- Modify `src/components/DialogueScene.tsx`: add scene-layer markup, speaker metadata, active-speaker classes, and more structured dialogue controls.
- Modify `src/components/DialogueScene.test.tsx`: assert upgraded dialogue structure remains accessible and the judgement flow still works.
- Modify `src/styles.css`: implement cinematic canal scene, portrait staging, dialogue HUD, motion, reduced-motion behavior, and responsive layout.
- Optionally add `public/assets/xuzhou-shipwreck-canal.png`: upgraded background asset for the shipwreck case.
- Optionally add `public/assets/shen-yan-premium.png`: upgraded沈砚立绘.
- Optionally add `public/assets/wang-huaiyuan-premium.png`: upgraded王淮远立绘.
- Keep reducers and data files unchanged unless a small display-only field is strictly needed.

---

### Task 1: Dialogue Scene Structure

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Add tests for the upgraded accessible structure**

Update `src/components/DialogueScene.test.tsx` with a new test:

```tsx
it("renders cinematic case staging metadata", () => {
  render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

  expect(screen.getByLabelText("沉船案场景信息")).toBeInTheDocument();
  expect(screen.getByText("徐州运河险段")).toBeInTheDocument();
  expect(screen.getByText("漕粮督运官 · 克制")).toBeInTheDocument();
  expect(screen.getByLabelText("大运河环境层")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: FAIL because `沉船案场景信息`, `徐州运河险段`, `漕粮督运官 · 克制`, and `大运河环境层` are not present yet.

- [ ] **Step 3: Add presentation metadata and scene layers**

Modify `src/components/DialogueScene.tsx`:

```tsx
const playerProfile = {
  name: "沈砚",
  role: "案卷整理者",
  emotion: "冷静"
};

function speakerMeta(speaker?: string) {
  if (speaker === playerProfile.role || speaker === playerProfile.name || speaker === "案卷整理者") {
    return `${playerProfile.role} · ${playerProfile.emotion}`;
  }
  return `${activeNpc.role} · ${activeNpc.tone.split("，")[0]}`;
}
```

Add scene-layer markup inside the returned `<section>` before the location card:

```tsx
<div className="cinematic-canal-layers" aria-label="大运河环境层">
  <div className="mist-layer mist-layer-back" />
  <div className="mist-layer mist-layer-front" />
  <div className="water-shimmer" />
  <div className="wreckage-hints">
    <span className="wreckage-plank" />
    <span className="wreckage-rope" />
    <span className="grain-sacks" />
  </div>
</div>
```

Replace the location card body with:

```tsx
<div className="location-card location-card-cinematic" aria-label="沉船案场景信息">
  <span>当前案卷</span>
  <strong>永乐号沉船案</strong>
  <small>徐州运河险段</small>
</div>
```

Inside `.dialogue-panel`, add a speaker metadata line below the name:

```tsx
<div className="speaker-name">{lastMessage?.speaker ?? activeNpc.name}</div>
<div className="speaker-meta">{speakerMeta(lastMessage?.speaker)}</div>
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx
git commit -m "feat: add cinematic dialogue staging metadata"
```

---

### Task 2: Cinematic Dialogue HUD Styling

**Files:**
- Modify: `src/styles.css`
- Test: `src/components/DialogueScene.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Add a regression test for judgement controls after structure changes**

Add to `src/components/DialogueScene.test.tsx`:

```tsx
it("shows judgement options inside the cinematic dialogue panel", async () => {
  const setState = vi.fn();
  render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);

  await userEvent.click(screen.getByRole("button", { name: "形成案卷判断" }));

  expect(screen.getByRole("button", { name: "多因素叠加" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "迁都与运河政治风险" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx src/App.test.tsx
```

Expected: PASS before CSS changes; this protects the flow while styling.

- [ ] **Step 3: Update dialogue panel CSS**

Modify `src/styles.css`:

```css
.dialogue-panel {
  bottom: 24px;
  width: min(1040px, calc(100% - 56px));
  min-height: 236px;
  background:
    linear-gradient(90deg, rgba(12, 18, 20, 0.86), rgba(35, 26, 18, 0.72)),
    linear-gradient(180deg, rgba(255, 244, 216, 0.14), rgba(255, 244, 216, 0.04));
  color: var(--paper);
  border: 1px solid rgba(216, 168, 79, 0.58);
  box-shadow:
    0 26px 90px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 244, 216, 0.16);
}

.speaker-name {
  min-width: 168px;
  padding: 12px 20px 7px;
  background: linear-gradient(180deg, rgba(157, 47, 25, 0.95), rgba(109, 31, 16, 0.92));
  font-size: 19px;
}

.speaker-meta {
  display: inline-block;
  margin-left: 14px;
  color: #f4dfad;
  font-size: 13px;
  font-weight: 900;
}

.dialogue-panel p {
  color: #fff4d8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}
```

Restyle choices:

```css
.choice-button {
  color: #fff4d8;
  background: linear-gradient(180deg, rgba(255, 244, 216, 0.14), rgba(255, 244, 216, 0.07));
  border: 1px solid rgba(216, 168, 79, 0.46);
  box-shadow: none;
}

.choice-button:hover {
  background: linear-gradient(180deg, rgba(216, 168, 79, 0.24), rgba(157, 47, 25, 0.22));
  border-color: var(--gold);
  transform: translateY(-2px);
}
```

- [ ] **Step 4: Run tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/styles.css src/components/DialogueScene.test.tsx
git commit -m "style: add cinematic dialogue hud"
```

---

### Task 3: Canal Atmosphere Layers and Animation

**Files:**
- Modify: `src/styles.css`
- Test: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Add CSS for canal layers**

Modify `src/styles.css`:

```css
.cinematic-canal-layers {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.mist-layer {
  position: absolute;
  left: -12%;
  width: 124%;
  height: 34%;
  background: linear-gradient(90deg, transparent, rgba(255, 244, 216, 0.18), transparent);
  filter: blur(18px);
  opacity: 0.42;
}

.mist-layer-back {
  top: 18%;
  animation: canal-mist-drift 28s linear infinite;
}

.mist-layer-front {
  bottom: 24%;
  animation: canal-mist-drift 36s linear infinite reverse;
}

.water-shimmer {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: 18%;
  height: 34%;
  background: linear-gradient(110deg, transparent 20%, rgba(216, 168, 79, 0.18) 44%, transparent 62%);
  opacity: 0.34;
  animation: water-shimmer 7s ease-in-out infinite;
}

.wreckage-hints span {
  position: absolute;
  display: block;
  background: rgba(70, 42, 24, 0.72);
  border: 1px solid rgba(216, 168, 79, 0.22);
}

.wreckage-plank {
  left: 16%;
  bottom: 19%;
  width: 130px;
  height: 16px;
  transform: rotate(-13deg);
}

.wreckage-rope {
  right: 22%;
  bottom: 24%;
  width: 98px;
  height: 9px;
  border-radius: 999px;
  transform: rotate(18deg);
}

.grain-sacks {
  left: 7%;
  bottom: 12%;
  width: 96px;
  height: 42px;
  border-radius: 46% 46% 18% 18%;
  background: rgba(174, 126, 71, 0.62);
}

@keyframes canal-mist-drift {
  from { transform: translateX(-7%); }
  to { transform: translateX(7%); }
}

@keyframes water-shimmer {
  0%, 100% { transform: translateX(-5%); opacity: 0.2; }
  50% { transform: translateX(5%); opacity: 0.38; }
}
```

- [ ] **Step 2: Add reduced-motion behavior**

Modify `src/styles.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Run focused tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add src/styles.css
git commit -m "style: add canal atmosphere animation"
```

---

### Task 4: Portrait Staging and Active Speaker Treatment

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/styles.css`
- Test: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Add active speaker class tests**

Add to `src/components/DialogueScene.test.tsx`:

```tsx
it("marks the active speaker portrait for visual emphasis", () => {
  render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

  expect(screen.getByLabelText("沈砚立绘")).toHaveClass("portrait-dimmed");
  expect(screen.getByLabelText("王淮远立绘")).toHaveClass("portrait-speaking");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: FAIL because portrait labels/classes are not present.

- [ ] **Step 3: Add portrait labels and active classes**

Modify `src/components/DialogueScene.tsx`:

```tsx
const activeSpeakerName = lastMessage?.speaker ?? activeNpc.name;
const isPlayerSpeaking = activeSpeakerName === "案卷整理者" || activeSpeakerName === playerProfile.name;
```

Update portrait markup:

```tsx
<div
  className={`portrait portrait-left ${isPlayerSpeaking ? "portrait-speaking" : "portrait-dimmed"}`}
  aria-label="沈砚立绘"
>
  <span>沈砚</span>
  <small>案卷整理者</small>
</div>
<div
  className={`portrait portrait-right ${isPlayerSpeaking ? "portrait-dimmed" : "portrait-speaking"}`}
  aria-label={`${activeNpc.name}立绘`}
>
  <span>{activeNpc.role}</span>
  <small>{activeNpc.name}</small>
</div>
```

- [ ] **Step 4: Add active speaker styling**

Modify `src/styles.css`:

```css
.portrait {
  animation: portrait-breath 5.5s ease-in-out infinite;
}

.portrait-speaking {
  opacity: 1;
  filter: saturate(1.12) brightness(1.08) drop-shadow(0 30px 42px rgba(0, 0, 0, 0.54));
  transform: scale(1.02);
}

.portrait-dimmed {
  opacity: 0.54;
  filter: saturate(0.58) brightness(0.68) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.35));
  transform: scale(0.96);
}

.portrait-speaking::after {
  content: "";
  position: absolute;
  inset: 8% 10% 0;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 44%, rgba(216, 168, 79, 0.22), transparent 56%);
  z-index: -1;
}

@keyframes portrait-breath {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -5px; }
}
```

- [ ] **Step 5: Run tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx src/styles.css
git commit -m "style: enhance active speaker portraits"
```

---

### Task 5: Optional Premium Asset Swap

**Files:**
- Add: `public/assets/xuzhou-shipwreck-canal.png`
- Add: `public/assets/shen-yan-premium.png`
- Add: `public/assets/wang-huaiyuan-premium.png`
- Modify: `src/styles.css`

- [ ] **Step 1: Generate or prepare bitmap assets**

Use the image generation skill or approved local assets to create:

1. `public/assets/xuzhou-shipwreck-canal.png`
   - Prompt: “semi-realistic cinematic Ming dynasty Grand Canal shipwreck investigation scene, Xuzhou dangerous canal section at dusk, wide canal water, grain transport boats, wet wooden wharf, broken planks, grain sacks, lantern light, mist, historical Chinese architecture, no modern objects, 16:9 game background”
2. `public/assets/shen-yan-premium.png`
   - Prompt: “transparent background semi-realistic Chinese historical game character portrait, young Ming dynasty case archivist named Shen Yan, blue-green robe, holding notebook scroll, calm intelligent expression, full body cutout, consistent soft dusk lighting”
3. `public/assets/wang-huaiyuan-premium.png`
   - Prompt: “transparent background semi-realistic Chinese historical game character portrait, older Ming dynasty grain transport official Wang Huaiyuan, brown official robe, holding ledger, cautious responsible expression, full body cutout, consistent soft dusk lighting”

- [ ] **Step 2: Swap CSS asset references**

Modify `src/styles.css`:

```css
.game-shell {
  background:
    linear-gradient(120deg, rgba(20, 33, 38, 0.86), rgba(20, 33, 38, 0.28) 44%, rgba(20, 33, 38, 0.86)),
    url("/assets/xuzhou-shipwreck-canal.png") center center / cover no-repeat,
    linear-gradient(145deg, #5c6f57 0%, #c5a66f 25%, #2c7780 26%, #0f5363 56%, #b78951 57%, #362315 100%);
}

.portrait-left {
  background: url("/assets/shen-yan-premium.png") center bottom / contain no-repeat;
}

.portrait-right {
  background: url("/assets/wang-huaiyuan-premium.png") center bottom / contain no-repeat;
}
```

- [ ] **Step 3: Run build**

Run:

```powershell
corepack pnpm build
```

Expected: PASS and no missing asset errors.

- [ ] **Step 4: Browser visual check**

Open the local app and verify:

- Desktop dialogue scene shows upgraded canal background.
-沈砚 appears left and王淮远 appears right.
- Transparent portrait backgrounds do not show rectangular boxes.
- Dialogue panel does not cover faces.

- [ ] **Step 5: Commit**

```powershell
git add public/assets/xuzhou-shipwreck-canal.png public/assets/shen-yan-premium.png public/assets/wang-huaiyuan-premium.png src/styles.css
git commit -m "style: add premium shipwreck visual assets"
```

If asset generation is unavailable, skip this task and keep the CSS improvements from Tasks 1-4.

---

### Task 6: Responsive Polish and Final Verification

**Files:**
- Modify: `src/styles.css`
- Modify: `README.md` if asset or visual notes need documenting

- [ ] **Step 1: Tighten mobile dialogue layout**

Modify `src/styles.css` inside `@media (max-width: 820px)`:

```css
.dialogue-panel {
  bottom: 12px;
  max-height: 60vh;
  overflow: auto;
}

.speaker-meta {
  display: block;
  margin: 4px 18px 0;
}

.choice-list {
  grid-template-columns: 1fr;
}

.cinematic-canal-layers {
  opacity: 0.72;
}
```

- [ ] **Step 2: Run full tests**

Run:

```powershell
corepack pnpm test
```

Expected: all test files pass.

- [ ] **Step 3: Run production build**

Run:

```powershell
corepack pnpm build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 4: Browser visual verification**

Check desktop viewport:

- Home page still readable.
- Archive page still readable.
- Shipwreck dialogue page shows left/right characters, low dialogue panel, visible canal background.
- Judgement options open without overflowing.

Check mobile viewport:

- Home cards are single column.
- Dialogue text is readable.
- NPC tabs do not cover dialogue text.
- Choices do not overflow horizontally.

- [ ] **Step 5: Commit**

```powershell
git add src/styles.css README.md
git commit -m "style: polish responsive shipwreck scene"
```

---

## Self-Review

- Spec coverage: Tasks 1-4 cover dialogue structure, 3A-inspired HUD, atmosphere layers, animation, and active speaker treatment. Task 5 covers optional premium background and portrait assets. Task 6 covers mobile and final verification.
- Placeholder scan: No unfinished placeholders remain. The optional asset task includes exact prompts and a defined skip condition if generation is unavailable.
- Type consistency: Uses existing `InvestigationState`, `SuggestedChoice`, `npcProfiles`, and component names. New display helpers stay local to `DialogueScene.tsx` and do not alter reducers.
