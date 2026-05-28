# Shipwreck NPC Content Visual Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the playable “永乐号沉船案” with five NPC-specific dialogue sets, per-NPC scene backgrounds, and four new character portraits while preserving the current investigation flow.

**Architecture:** Keep `npcProfiles` as the base character catalog and add `src/game/npcDialogue.ts` as the dedicated per-NPC dialogue/visual configuration layer. `DialogueScene.tsx` reads the active NPC configuration to choose suggestions, portrait class, and scene background class. Generated bitmap assets live under `public/assets/` and are referenced from CSS.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS background/animation, built-in image generation for project-bound PNG assets.

---

## File Structure

- Create `src/game/npcDialogue.ts`: owns NPC-specific suggested choices, scene class keys, and portrait asset class keys.
- Create `src/game/npcDialogue.test.ts`: verifies each NPC has exactly three choices and the expected visual keys.
- Modify `src/components/DialogueScene.tsx`: remove hard-coded shared suggestions and read active NPC config.
- Modify `src/components/DialogueScene.test.tsx`: verify NPC switching changes choices and portrait labels still work.
- Modify `src/styles.css`: add per-NPC scene background classes and portrait background classes.
- Add `public/assets/zheng-chaosheng-cutout.png`: 郑潮生 transparent or chroma-key-removed portrait.
- Add `public/assets/lin-wenqi-cutout.png`: 林文绮 transparent or chroma-key-removed portrait.
- Add `public/assets/su-xiuyun-cutout.png`: 苏岫云 transparent or chroma-key-removed portrait.
- Add `public/assets/zhao-bingfeng-cutout.png`: 赵秉丰 transparent or chroma-key-removed portrait.
- Add `public/assets/bg-wang-huaiyuan.png`: 王淮远 dialogue background.
- Add `public/assets/bg-zheng-chaosheng.png`: 郑潮生 dialogue background.
- Add `public/assets/bg-lin-wenqi.png`: 林文绮 dialogue background.
- Add `public/assets/bg-su-xiuyun.png`: 苏岫云 dialogue background.
- Add `public/assets/bg-zhao-bingfeng.png`: 赵秉丰 dialogue background.

---

### Task 1: NPC Dialogue Configuration

**Files:**
- Create: `src/game/npcDialogue.ts`
- Create: `src/game/npcDialogue.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/game/npcDialogue.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { npcDialogueCatalog, npcVisuals } from "./npcDialogue";
import type { NpcId } from "./types";

const npcIds: NpcId[] = ["wang-huaiyuan", "zheng-chaosheng", "lin-wenqi", "su-xiuyun", "zhao-bingfeng"];

describe("npcDialogueCatalog", () => {
  it("provides three dedicated choices for every NPC", () => {
    for (const npcId of npcIds) {
      expect(npcDialogueCatalog[npcId]).toHaveLength(3);
      expect(new Set(npcDialogueCatalog[npcId].map((choice) => choice.id)).size).toBe(3);
    }
  });

  it("assigns visual scene and portrait classes for every NPC", () => {
    for (const npcId of npcIds) {
      expect(npcVisuals[npcId].sceneClass).toMatch(/^scene-npc-/);
      expect(npcVisuals[npcId].portraitClass).toMatch(/^portrait-npc-/);
      expect(npcVisuals[npcId].backgroundLabel.length).toBeGreaterThan(4);
    }
  });

  it("keeps core clue unlocks tied to the right NPC paths", () => {
    expect(npcDialogueCatalog["zheng-chaosheng"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "drug-residue"
    );
    expect(npcDialogueCatalog["lin-wenqi"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "canal-route-fragment"
    );
    expect(npcDialogueCatalog["zhao-bingfeng"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "broken-hull-plank"
    );
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
corepack pnpm test src/game/npcDialogue.test.ts
```

Expected: FAIL because `src/game/npcDialogue.ts` does not exist.

- [ ] **Step 3: Create the NPC dialogue catalog**

Create `src/game/npcDialogue.ts`:

```ts
import type { NpcId, SuggestedChoice } from "./types";

interface NpcVisualConfig {
  sceneClass: string;
  portraitClass: string;
  backgroundLabel: string;
}

export const npcVisuals: Record<NpcId, NpcVisualConfig> = {
  "wang-huaiyuan": {
    sceneClass: "scene-npc-wang",
    portraitClass: "portrait-npc-wang",
    backgroundLabel: "徐州临时官署与运河码头"
  },
  "zheng-chaosheng": {
    sceneClass: "scene-npc-zheng",
    portraitClass: "portrait-npc-zheng",
    backgroundLabel: "夜色漕船甲板与船舱"
  },
  "lin-wenqi": {
    sceneClass: "scene-npc-lin",
    portraitClass: "portrait-npc-lin",
    backgroundLabel: "客栈案桌与运河路线图"
  },
  "su-xiuyun": {
    sceneClass: "scene-npc-su",
    portraitClass: "portrait-npc-su",
    backgroundLabel: "扬州戏园后门与码头灯火"
  },
  "zhao-bingfeng": {
    sceneClass: "scene-npc-zhao",
    portraitClass: "portrait-npc-zhao",
    backgroundLabel: "粮仓账房与码头货栈"
  }
};

export const npcDialogueCatalog: Record<NpcId, SuggestedChoice[]> = {
  "wang-huaiyuan": [
    {
      id: "wang-transport-pressure",
      label: "追问运粮为何如此急迫",
      reply: "急令压在衙门头上，谁也不敢慢。误期不是小过，征粮、调船、护运便都紧了。",
      unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
      unlockClues: ["grain-transport-order"]
    },
    {
      id: "wang-departure-ledger",
      label: "核对船队出发文书",
      reply: "文书写得明白，扬州启运、徐州验押，沿途不得久泊。可纸上越清楚，下面越容易急出乱子。",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["grain-transport-order"]
    },
    {
      id: "wang-night-sailing",
      label: "询问徐州险段为何仍要夜行",
      reply: "若非误期逼人，没人愿在徐州险段贪夜。水势、暗礁、风向，哪一样都不是能轻看的。",
      unlockKnowledge: ["xuzhou-danger-section"]
    }
  ],
  "zheng-chaosheng": [
    {
      id: "zheng-crew-food",
      label: "追问船员昏迷前吃过什么",
      reply: "那晚饭食味道发苦，起初没人敢说。等撑船的人一个个犯困，船已经进了最难回头的水道。",
      unlockClues: ["drug-residue", "soldier-testimony"]
    },
    {
      id: "zheng-grudge",
      label: "问他为何怨恨这趟漕运",
      reply: "有人拿漕粮换官声，有人却拿命去填河。我们不是不知皇粮要紧，只是从没人问过船上的人。",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["soldier-testimony"]
    },
    {
      id: "zheng-night-noise",
      label: "让他回忆沉船前夜的动静",
      reply: "二更后船尾响过一阵，像有人挪木板，也像绳索被重新系过。风浪声大，我不敢断言。",
      unlockClues: ["broken-hull-plank", "soldier-testimony"]
    }
  ],
  "lin-wenqi": [
    {
      id: "lin-route-fragment",
      label: "询问兄长留下的路线图",
      reply: "兄长留下的并非寻常游历图。几处河段被朱笔圈过，徐州与会通河之间，笔迹最重。",
      unlockKnowledge: ["huitong-river"],
      unlockClues: ["canal-route-fragment"]
    },
    {
      id: "lin-weaving-office",
      label: "追问织造府为何牵涉漕粮案",
      reply: "迁都以后，贡品、丝绢、粮食都向北走。运河不只运货，也运消息和风险。",
      unlockKnowledge: ["capital-move-beijing", "yangzhou-wharf"]
    },
    {
      id: "lin-hidden-river",
      label: "请她辨认图上隐去的河段",
      reply: "这段像是刻意略去。若我没看错，它避开了寻常驿路，却贴着几处可换船的水口。",
      unlockKnowledge: ["huitong-river"],
      unlockClues: ["canal-route-fragment"]
    }
  ],
  "su-xiuyun": [
    {
      id: "su-back-door-guests",
      label: "问戏园后门见过哪些船客",
      reply: "戏园后门连着码头小巷，夜里来过漕兵，也来过替商号送信的人。看衣着，不像一路人。",
      unlockKnowledge: ["yangzhou-wharf"],
      unlockClues: ["soldier-testimony"]
    },
    {
      id: "su-medicine-source",
      label: "追问药材从何处来",
      reply: "有味药不是戏班常用的。卖药的小厮说是替船上人带的，银钱给得急，也给得重。",
      unlockClues: ["drug-residue"]
    },
    {
      id: "su-wharf-rumor",
      label: "请她复述码头流言",
      reply: "码头人说，那船沉得太巧。若只怪水急，怎会偏偏在有人换值之后出事？",
      unlockKnowledge: ["yangzhou-wharf"],
      unlockClues: ["soldier-testimony"]
    }
  ],
  "zhao-bingfeng": [
    {
      id: "zhao-plank-ledger",
      label: "查看船板采购账目",
      reply: "账上写的是上等杉木，可码头上谁不晓得，急调的船多半修得仓促。账面好看，不代表船底结实。",
      unlockClues: ["broken-hull-plank"]
    },
    {
      id: "zhao-merchant-ships",
      label: "追问商船为何混入官船调度",
      reply: "官船不够，商船补上，这在急运时并不稀奇。稀奇的是，有人从这急字里赚了差价。",
      unlockKnowledge: ["ming-grain-transport", "yangzhou-wharf"]
    },
    {
      id: "zhao-repair-cost",
      label: "逼问他是否压低修船成本",
      reply: "压低成本的人未必亲手凿船，可若船板本就撑不住险段水势，那也是把人往河里推。",
      unlockKnowledge: ["xuzhou-danger-section"],
      unlockClues: ["broken-hull-plank"]
    }
  ]
};
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```powershell
corepack pnpm test src/game/npcDialogue.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/game/npcDialogue.ts src/game/npcDialogue.test.ts
git commit -m "feat: add npc-specific dialogue catalog"
```

---

### Task 2: Dialogue Scene Uses NPC-Specific Choices

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`
- Test: `src/components/DialogueScene.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Add tests for NPC-specific choice switching**

Add to `src/components/DialogueScene.test.tsx`:

```tsx
it("switches to NPC-specific suggested choices", async () => {
  const setState = vi.fn((updater: unknown) => {
    if (typeof updater === "function") {
      updater(storyState());
    }
  });
  render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);

  expect(screen.getByRole("button", { name: "核对船队出发文书" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "郑潮生" }));

  expect(setState).toHaveBeenCalled();
});
```

Add a pure render test for a manually selected NPC:

```tsx
it("renders Zheng Chaosheng choices when he is active", () => {
  const zhengState = { ...storyState(), activeNpcId: "zheng-chaosheng" as const };
  render(<DialogueScene state={zhengState} setState={() => {}} onOpenArchive={() => {}} />);

  expect(screen.getByRole("button", { name: "追问船员昏迷前吃过什么" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "让他回忆沉船前夜的动静" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: FAIL because `DialogueScene` still uses hard-coded `initialSuggestions`.

- [ ] **Step 3: Update `DialogueScene.tsx` to read `npcDialogueCatalog`**

Modify imports:

```tsx
import { npcDialogueCatalog, npcVisuals } from "../game/npcDialogue";
```

Remove the local `initialSuggestions` array. Replace suggestion state initialization:

```tsx
const [suggestions, setSuggestions] = useState<SuggestedChoice[]>(npcDialogueCatalog[state.activeNpcId]);
```

Add an active visual config:

```tsx
const activeVisual = npcVisuals[state.activeNpcId];
```

Add a local handler for NPC switching so choices update immediately:

```tsx
function chooseNpc(npcId: NpcId) {
  setSuggestions(npcDialogueCatalog[npcId]);
  setState((current) => selectNpc(current, npcId));
}
```

Update the NPC tab click:

```tsx
onClick={() => chooseNpc(npc.id)}
```

Ensure imports include `NpcId`:

```tsx
import type { FinalJudgement, InvestigationState, NpcId, SuggestedChoice } from "../game/types";
```

- [ ] **Step 4: Run focused tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx
git commit -m "feat: switch dialogue choices by npc"
```

---

### Task 3: Scene and Portrait Class Wiring

**Files:**
- Modify: `src/components/DialogueScene.tsx`
- Modify: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Add render tests for visual classes and background labels**

Add to `src/components/DialogueScene.test.tsx`:

```tsx
it("renders visual scene metadata for the active NPC", () => {
  const linState = { ...storyState(), activeNpcId: "lin-wenqi" as const };
  render(<DialogueScene state={linState} setState={() => {}} onOpenArchive={() => {}} />);

  expect(screen.getByLabelText("永乐号沉船案")).toHaveClass("scene-npc-lin");
  expect(screen.getByText("客栈案桌与运河路线图")).toBeInTheDocument();
  expect(screen.getByLabelText("林文绮立绘")).toHaveClass("portrait-npc-lin");
});
```

- [ ] **Step 2: Run focused test and verify failure**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: FAIL because the scene class, background label, and portrait class are not wired yet.

- [ ] **Step 3: Wire visual classes in `DialogueScene.tsx`**

Update the top-level section:

```tsx
<section className={`scene scene-wharf ${activeVisual.sceneClass}`} aria-label="永乐号沉船案">
```

Update the location card small text:

```tsx
<small>{activeVisual.backgroundLabel}</small>
```

Update the right portrait class:

```tsx
className={`portrait portrait-right ${activeVisual.portraitClass} ${
  isPlayerSpeaking ? "portrait-dimmed" : "portrait-speaking"
}`}
```

- [ ] **Step 4: Run focused tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx
git commit -m "feat: wire npc visual scene classes"
```

---

### Task 4: Generate Character Portrait Assets

**Files:**
- Add: `public/assets/zheng-chaosheng-cutout.png`
- Add: `public/assets/lin-wenqi-cutout.png`
- Add: `public/assets/su-xiuyun-cutout.png`
- Add: `public/assets/zhao-bingfeng-cutout.png`

- [ ] **Step 1: Generate 郑潮生**

Use built-in image generation with this prompt:

```text
Use case: historical-scene
Asset type: transparent-background game character cutout
Primary request: young Ming dynasty canal transport soldier named Zheng Chaosheng
Subject: young male canal soldier, plain worn short robe, subdued expression, holding rope or wooden oar
Style/medium: semi-realistic Chinese historical game character portrait, matching refined visual novel character art
Composition/framing: full body cutout, standing pose, three-quarter view, generous padding
Lighting/mood: soft dusk canal lighting, tense and restrained mood
Constraints: no modern objects, no armor fantasy exaggeration, no text, no watermark
Transparent workflow: create on a perfectly flat solid #00ff00 chroma-key background for local removal; do not use #00ff00 in the subject.
```

Save the chroma-key source in `tmp/imagegen/zheng-chaosheng-source.png`, remove chroma key with:

```powershell
python C:\Users\07062\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py --input tmp\imagegen\zheng-chaosheng-source.png --out public\assets\zheng-chaosheng-cutout.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

- [ ] **Step 2: Generate 林文绮**

Use built-in image generation with this prompt:

```text
Use case: historical-scene
Asset type: transparent-background game character cutout
Primary request: Ming dynasty woman connected to the Nanjing weaving office named Lin Wenqi
Subject: gentle but alert young woman, elegant restrained Ming dynasty dress, holding a canal route map or travel case
Style/medium: semi-realistic Chinese historical game character portrait, matching refined visual novel character art
Composition/framing: full body cutout, standing pose, three-quarter view, generous padding
Lighting/mood: soft candle and dusk canal lighting, quiet investigative mood
Constraints: no modern objects, no fantasy costume, no text, no watermark
Transparent workflow: create on a perfectly flat solid #00ff00 chroma-key background for local removal; do not use #00ff00 in the subject.
```

Save and remove chroma key to `public/assets/lin-wenqi-cutout.png`.

- [ ] **Step 3: Generate 苏岫云**

Use built-in image generation with this prompt:

```text
Use case: historical-scene
Asset type: transparent-background game character cutout
Primary request: Yangzhou theatre woman named Su Xiuyun
Subject: delicate reserved woman with theatre-house presence, tasteful Ming dynasty clothing, holding a small medicine packet or handkerchief
Style/medium: semi-realistic Chinese historical game character portrait, matching refined visual novel character art
Composition/framing: full body cutout, standing pose, three-quarter view, generous padding
Lighting/mood: warm lantern and canal dusk lighting, subtle sadness and caution
Constraints: no modern objects, not overly ornate, no text, no watermark
Transparent workflow: create on a perfectly flat solid #00ff00 chroma-key background for local removal; do not use #00ff00 in the subject.
```

Save and remove chroma key to `public/assets/su-xiuyun-cutout.png`.

- [ ] **Step 4: Generate 赵秉丰**

Use built-in image generation with this prompt:

```text
Use case: historical-scene
Asset type: transparent-background game character cutout
Primary request: middle-aged Ming dynasty grain merchant named Zhao Bingfeng
Subject: cautious smooth grain merchant, more refined clothing than a soldier, holding abacus or ledger
Style/medium: semi-realistic Chinese historical game character portrait, matching refined visual novel character art
Composition/framing: full body cutout, standing pose, three-quarter view, generous padding
Lighting/mood: warm warehouse lantern lighting, calculating and uneasy expression
Constraints: no modern objects, no fantasy costume, no text, no watermark
Transparent workflow: create on a perfectly flat solid #00ff00 chroma-key background for local removal; do not use #00ff00 in the subject.
```

Save and remove chroma key to `public/assets/zhao-bingfeng-cutout.png`.

- [ ] **Step 5: Validate images locally**

Run:

```powershell
Get-ChildItem public\assets\*-cutout.png | Select-Object Name,Length
```

Expected: all four new cutout files exist and have non-zero size.

- [ ] **Step 6: Commit**

```powershell
git add public/assets/zheng-chaosheng-cutout.png public/assets/lin-wenqi-cutout.png public/assets/su-xiuyun-cutout.png public/assets/zhao-bingfeng-cutout.png
git commit -m "assets: add npc character cutouts"
```

---

### Task 5: Generate NPC Background Assets

**Files:**
- Add: `public/assets/bg-wang-huaiyuan.png`
- Add: `public/assets/bg-zheng-chaosheng.png`
- Add: `public/assets/bg-lin-wenqi.png`
- Add: `public/assets/bg-su-xiuyun.png`
- Add: `public/assets/bg-zhao-bingfeng.png`

- [ ] **Step 1: Generate 王淮远 background**

Use built-in image generation:

```text
Use case: historical-scene
Asset type: 16:9 game dialogue background
Primary request: Xuzhou temporary canal official office and Grand Canal wharf for Wang Huaiyuan dialogue
Scene/backdrop: Ming dynasty canal wharf, temporary official desk, documents, lanterns, grain sacks, moored grain transport boats visible near water
Style/medium: semi-realistic cinematic historical game background
Composition/framing: wide 16:9 scene with clear space in lower center for dialogue HUD and characters
Lighting/mood: dusk lantern light, official pressure, misty canal atmosphere
Constraints: no modern objects, no readable text, no watermark
```

Save as `public/assets/bg-wang-huaiyuan.png`.

- [ ] **Step 2: Generate 郑潮生 background**

Prompt:

```text
Use case: historical-scene
Asset type: 16:9 game dialogue background
Primary request: night canal transport boat deck and dark cabin entrance for Zheng Chaosheng dialogue
Scene/backdrop: Ming dynasty grain boat deck, wet planks, grain sacks, ropes, dark cabin entrance, canal water at night
Style/medium: semi-realistic cinematic historical game background
Composition/framing: wide 16:9 scene with lower center kept readable for dialogue HUD
Lighting/mood: moonlit water, dim lanterns, tense suspicious atmosphere
Constraints: no modern objects, no readable text, no watermark
```

Save as `public/assets/bg-zheng-chaosheng.png`.

- [ ] **Step 3: Generate 林文绮 background**

Prompt:

```text
Use case: historical-scene
Asset type: 16:9 game dialogue background
Primary request: canal inn interior desk with route map for Lin Wenqi dialogue
Scene/backdrop: Ming dynasty inn room beside the Grand Canal, candlelit desk, travel case, canal route map, window showing water reflection
Style/medium: semi-realistic cinematic historical game background
Composition/framing: wide 16:9 scene with lower center kept readable for dialogue HUD
Lighting/mood: quiet candlelight, investigative and secretive
Constraints: no modern objects, no readable text, no watermark
```

Save as `public/assets/bg-lin-wenqi.png`.

- [ ] **Step 4: Generate 苏岫云 background**

Prompt:

```text
Use case: historical-scene
Asset type: 16:9 game dialogue background
Primary request: Yangzhou theatre back gate connected to canal wharf for Su Xiuyun dialogue
Scene/backdrop: Ming dynasty theatre back door, stage curtain edge, small medicine packets, canal lanterns, boat silhouettes
Style/medium: semi-realistic cinematic historical game background
Composition/framing: wide 16:9 scene with lower center kept readable for dialogue HUD
Lighting/mood: warm lantern light, gentle but suspicious city-at-night mood
Constraints: no modern objects, no readable text, no watermark
```

Save as `public/assets/bg-su-xiuyun.png`.

- [ ] **Step 5: Generate 赵秉丰 background**

Prompt:

```text
Use case: historical-scene
Asset type: 16:9 game dialogue background
Primary request: grain warehouse counting room and canal cargo depot for Zhao Bingfeng dialogue
Scene/backdrop: Ming dynasty grain warehouse, abacus, ledgers, planks, grain sacks, cargo depot near canal water
Style/medium: semi-realistic cinematic historical game background
Composition/framing: wide 16:9 scene with lower center kept readable for dialogue HUD
Lighting/mood: warm dim warehouse lantern light, calculating and uneasy
Constraints: no modern objects, no readable text, no watermark
```

Save as `public/assets/bg-zhao-bingfeng.png`.

- [ ] **Step 6: Validate background files**

Run:

```powershell
Get-ChildItem public\assets\bg-*.png | Select-Object Name,Length
```

Expected: all five background files exist and have non-zero size.

- [ ] **Step 7: Commit**

```powershell
git add public/assets/bg-wang-huaiyuan.png public/assets/bg-zheng-chaosheng.png public/assets/bg-lin-wenqi.png public/assets/bg-su-xiuyun.png public/assets/bg-zhao-bingfeng.png
git commit -m "assets: add npc dialogue backgrounds"
```

---

### Task 6: CSS Integration for NPC Assets

**Files:**
- Modify: `src/styles.css`
- Test: `src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Add CSS for NPC backgrounds**

Modify `src/styles.css`:

```css
.scene-npc-wang {
  --npc-scene-image: url("/assets/bg-wang-huaiyuan.png");
}

.scene-npc-zheng {
  --npc-scene-image: url("/assets/bg-zheng-chaosheng.png");
}

.scene-npc-lin {
  --npc-scene-image: url("/assets/bg-lin-wenqi.png");
}

.scene-npc-su {
  --npc-scene-image: url("/assets/bg-su-xiuyun.png");
}

.scene-npc-zhao {
  --npc-scene-image: url("/assets/bg-zhao-bingfeng.png");
}

.scene[class*="scene-npc-"]::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(120deg, rgba(20, 33, 38, 0.76), rgba(20, 33, 38, 0.18) 42%, rgba(20, 33, 38, 0.78)),
    var(--npc-scene-image) center center / cover no-repeat;
  opacity: 0.64;
  transition: opacity 0.28s ease;
}
```

- [ ] **Step 2: Add CSS for NPC portraits**

Modify `src/styles.css`:

```css
.portrait-npc-wang {
  background-image: url("/assets/canal-clerk-cutout.png");
}

.portrait-npc-zheng {
  background-image: url("/assets/zheng-chaosheng-cutout.png");
}

.portrait-npc-lin {
  background-image: url("/assets/lin-wenqi-cutout.png");
}

.portrait-npc-su {
  background-image: url("/assets/su-xiuyun-cutout.png");
}

.portrait-npc-zhao {
  background-image: url("/assets/zhao-bingfeng-cutout.png");
}

.portrait-right[class*="portrait-npc-"] {
  background-position: center bottom;
  background-size: contain;
  background-repeat: no-repeat;
}
```

Update the existing `.portrait-right` rule to avoid overriding the class-specific images:

```css
.portrait-right {
  background-position: center bottom;
  background-size: contain;
  background-repeat: no-repeat;
  filter: saturate(0.72) brightness(0.76) drop-shadow(0 24px 32px rgba(0, 0, 0, 0.42));
}
```

- [ ] **Step 3: Run focused tests**

Run:

```powershell
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run build**

Run:

```powershell
corepack pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/styles.css
git commit -m "style: wire npc portraits and backgrounds"
```

---

### Task 7: Browser Verification and Final Polish

**Files:**
- Modify: `src/styles.css` if browser verification reveals overlap or readability issues.

- [ ] **Step 1: Run full test suite**

Run:

```powershell
corepack pnpm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```powershell
corepack pnpm build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Browser check all five NPC scenes**

Open the local app, enter “永乐号沉船案”, and click each NPC:

- 王淮远: verify official office/wharf scene and Wang portrait.
- 郑潮生: verify boat deck scene and Zheng portrait.
- 林文绮: verify inn/map scene and Lin portrait.
- 苏岫云: verify theatre/wharf scene and Su portrait.
- 赵秉丰: verify warehouse scene and Zhao portrait.

For each scene, check:

- Right portrait is visible and not inside a rectangular background.
- Dialogue text remains readable.
- NPC tabs do not cover important text.
- Background communicates the intended location.

- [ ] **Step 4: Browser check mobile layout**

Use a 390 x 844 viewport and verify:

- NPC tabs remain horizontal.
- Dialogue panel scrolls if needed.
- Choice buttons do not overflow.
- Portraits remain visible enough to identify the current NPC.

- [ ] **Step 5: Apply focused CSS polish only if needed**

If browser verification reveals overlap, adjust only the relevant CSS. Examples:

```css
@media (max-width: 820px) {
  .portrait-right {
    right: 4vw;
  }

  .dialogue-panel {
    max-height: 62vh;
  }
}
```

- [ ] **Step 6: Re-run final verification**

Run:

```powershell
corepack pnpm test
corepack pnpm build
```

Expected: both commands pass.

- [ ] **Step 7: Commit final polish if files changed**

```powershell
git add src/styles.css
git commit -m "style: polish npc scene presentation"
```

If no files changed during final polish, do not make an empty commit.

---

## Self-Review

- Spec coverage: Task 1 covers per-NPC choices and visual keys. Tasks 2-3 wire choices, backgrounds, and portrait metadata into the scene. Tasks 4-5 generate the requested four portraits and five backgrounds. Task 6 connects assets to CSS. Task 7 verifies desktop and mobile for all five NPCs.
- Placeholder scan: The plan contains exact paths, prompts, commands, test snippets, and commit messages. No unfinished placeholder tasks remain.
- Type consistency: Uses existing `NpcId`, `SuggestedChoice`, `KnowledgeCardId`, and `ClueCardId`. New config types are local to `npcDialogue.ts`, and `DialogueScene.tsx` reads them without changing reducer contracts.
