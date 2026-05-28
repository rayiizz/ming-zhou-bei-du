# AI Derived Canal Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current fixed-route dialogue demo into an ancient-style AI-derived Grand Canal story demo with three event entrances, one playable “永乐号沉船案” flow, NPC conversations, knowledge/clue cards, AI/fallback replies, and a journey summary.

**Architecture:** Keep the app as a Vite + React + TypeScript single-page app. Add focused game-domain modules for event archives, NPCs, knowledge cards, investigation state, and AI reply orchestration; keep UI components thin and driven by typed state. Use a browser-safe AI client abstraction that calls a configured endpoint when present and falls back to deterministic offline content when absent.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS modules via existing `src/styles.css`, browser `fetch` for optional AI endpoint calls.

---

## File Structure

Create or modify these files:

- Modify: `ming-zhou-bei-du/src/game/types.ts`
  - Add event, NPC, knowledge, clue, investigation, AI request/response, and app-view types.
- Create: `ming-zhou-bei-du/src/game/events.ts`
  - Three event entry definitions and archive-page metadata.
- Create: `ming-zhou-bei-du/src/game/npcs.ts`
  - NPC profiles for the playable story, including knowledge boundaries and fallback lines.
- Create: `ming-zhou-bei-du/src/game/knowledge.ts`
  - Knowledge cards and clue cards used by the playable story.
- Create: `ming-zhou-bei-du/src/game/ai.ts`
  - Builds AI prompts, calls an optional configured endpoint, validates response shape, and falls back offline.
- Modify: `ming-zhou-bei-du/src/game/state.ts`
  - Replace route-only state with event selection, active NPC, dialogue log, unlocked cards, investigation phase, and summary state.
- Create: `ming-zhou-bei-du/src/game/investigation.ts`
  - Pure reducers for selecting events, entering archives, selecting NPCs, submitting choices/free text, unlocking cards, and completing the investigation.
- Create tests:
  - `ming-zhou-bei-du/src/game/events.test.ts`
  - `ming-zhou-bei-du/src/game/knowledge.test.ts`
  - `ming-zhou-bei-du/src/game/ai.test.ts`
  - `ming-zhou-bei-du/src/game/investigation.test.ts`
- Modify: `ming-zhou-bei-du/src/App.tsx`
  - Route between home, archive, story, and summary views using local React state.
- Create: `ming-zhou-bei-du/src/components/EventHome.tsx`
  - Ancient archive-style event entrance page.
- Create: `ming-zhou-bei-du/src/components/EventArchive.tsx`
  - Selected event detail/archive page.
- Modify: `ming-zhou-bei-du/src/components/DialogueScene.tsx`
  - Add NPC switching, AI/offline status, free input, and generated/fallback options.
- Modify: `ming-zhou-bei-du/src/components/EvidenceDrawer.tsx`
  - Generalize into archive drawer showing knowledge cards, clue cards, and NPC files.
- Create: `ming-zhou-bei-du/src/components/JourneySummary.tsx`
  - End-state generated/fallback report.
- Modify tests:
  - `ming-zhou-bei-du/src/App.test.tsx`
  - `ming-zhou-bei-du/src/components/DialogueScene.test.tsx`
  - `ming-zhou-bei-du/src/components/EvidenceDrawer.test.tsx`
- Modify: `ming-zhou-bei-du/src/styles.css`
  - Ancient “大运河案卷馆” visual system for home, archive, dialogue, drawer, and summary.

## Preflight

The current working tree already contains staged UI and generated-asset changes from the existing visual prototype. Treat them as baseline work. Do not reset or revert them.

- [ ] **Step 1: Inspect status**

Run:

```bash
git status --short
```

Expected: staged changes under `ming-zhou-bei-du/public/assets/*` and `ming-zhou-bei-du/src/*`, plus unrelated untracked files outside the app.

- [ ] **Step 2: Commit the current staged app baseline before implementation**

Run:

```bash
git commit -m "feat: polish dialogue game visual baseline"
```

Expected: a commit containing only the currently staged app visual/assets changes. If Git reports nothing to commit, continue.

- [ ] **Step 3: Confirm spec and plan are present**

Run:

```bash
test -f docs/superpowers/specs/2026-05-24-ai-derived-canal-game-design.md
test -f docs/superpowers/plans/2026-05-24-ai-derived-canal-game.md
```

Expected: both commands exit successfully from `ming-zhou-bei-du`.

## Task 1: Event, NPC, Knowledge, and Clue Catalogs

**Files:**
- Modify: `ming-zhou-bei-du/src/game/types.ts`
- Create: `ming-zhou-bei-du/src/game/events.ts`
- Create: `ming-zhou-bei-du/src/game/npcs.ts`
- Create: `ming-zhou-bei-du/src/game/knowledge.ts`
- Test: `ming-zhou-bei-du/src/game/events.test.ts`
- Test: `ming-zhou-bei-du/src/game/knowledge.test.ts`

- [ ] **Step 1: Write catalog tests**

Create `src/game/events.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { eventCatalog, playableEventId } from "./events";

describe("eventCatalog", () => {
  it("contains three event entrances and one playable event", () => {
    expect(eventCatalog).toHaveLength(3);
    expect(eventCatalog.map((event) => event.id)).toEqual([
      "yongle-shipwreck",
      "nanwang-water-divide",
      "linqing-customs"
    ]);
    expect(eventCatalog.find((event) => event.id === playableEventId)?.status).toBe("playable");
  });

  it("keeps expansion entries non-playable in the MVP", () => {
    const expansions = eventCatalog.filter((event) => event.status === "expansion");
    expect(expansions).toHaveLength(2);
    expect(expansions.every((event) => event.archiveOnly)).toBe(true);
  });
});
```

Create `src/game/knowledge.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clueCards, knowledgeCards } from "./knowledge";

describe("knowledge and clue cards", () => {
  it("provides at least six Grand Canal knowledge cards", () => {
    expect(knowledgeCards).toHaveLength(6);
    expect(knowledgeCards.map((card) => card.id)).toContain("ming-grain-transport");
  });

  it("provides at least five investigation clue cards", () => {
    expect(clueCards).toHaveLength(5);
    expect(clueCards.map((card) => card.id)).toContain("broken-hull-plank");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
corepack pnpm test src/game/events.test.ts src/game/knowledge.test.ts
```

Expected: FAIL because `events.ts` and `knowledge.ts` do not exist yet.

- [ ] **Step 3: Add domain types**

Modify `src/game/types.ts` by preserving existing exports if still referenced, then add:

```ts
export type EventId = "yongle-shipwreck" | "nanwang-water-divide" | "linqing-customs";
export type EventStatus = "playable" | "expansion";

export interface StoryEvent {
  id: EventId;
  title: string;
  subtitle: string;
  status: EventStatus;
  archiveOnly: boolean;
  typeLabel: string;
  summary: string;
  knowledgeTags: string[];
  generatedFeatures: string[];
}

export type NpcId = "wang-huaiyuan" | "zheng-chaosheng" | "lin-wenqi" | "su-xiuyun" | "zhao-bingfeng";

export interface NpcProfile {
  id: NpcId;
  name: string;
  role: string;
  portraitSide: "left" | "right";
  tone: string;
  knows: string[];
  avoids: string[];
  openingLine: string;
  fallbackReplies: string[];
}

export type KnowledgeCardId =
  | "ming-grain-transport"
  | "capital-move-beijing"
  | "xuzhou-danger-section"
  | "huitong-river"
  | "nanwang-water-divide"
  | "yangzhou-wharf";

export type ClueCardId =
  | "broken-hull-plank"
  | "drug-residue"
  | "grain-transport-order"
  | "soldier-testimony"
  | "canal-route-fragment";

export interface ArchiveCard {
  id: KnowledgeCardId | ClueCardId;
  title: string;
  category: "knowledge" | "clue";
  tag: string;
  summary: string;
  source: string;
}
```

- [ ] **Step 4: Add event catalog**

Create `src/game/events.ts`:

```ts
import type { EventId, StoryEvent } from "./types";

export const playableEventId: EventId = "yongle-shipwreck";

export const eventCatalog: StoryEvent[] = [
  {
    id: "yongle-shipwreck",
    title: "永乐号沉船案",
    subtitle: "漕粮北运中的徐州险段疑案",
    status: "playable",
    archiveOnly: false,
    typeLabel: "案件调查 / 漕粮北运",
    summary: "永乐十九年，承载皇粮北上的首舰在徐州段沉没。玩家将问询多名 NPC，归档线索，判断沉船背后的多重原因。",
    knowledgeTags: ["明代漕运", "迁都北京", "徐州险段", "漕粮制度"],
    generatedFeatures: ["NPC 对话", "建议选项", "知识卡", "旅程总结"]
  },
  {
    id: "nanwang-water-divide",
    title: "南旺分水枢纽",
    subtitle: "一场关于水脉、闸坝与运河工程的推演",
    status: "expansion",
    archiveOnly: true,
    typeLabel: "工程治理 / 水利调度",
    summary: "以南旺分水为核心，展示大运河如何通过工程体系维持南北通航。",
    knowledgeTags: ["南旺分水", "会通河", "水利工程"],
    generatedFeatures: ["工程问答", "水势推演", "知识图鉴"]
  },
  {
    id: "linqing-customs",
    title: "临清钞关与运河商贸",
    subtitle: "码头、税关与南北物资流通",
    status: "expansion",
    archiveOnly: true,
    typeLabel: "商贸流通 / 城市经济",
    summary: "以临清钞关为入口，展示运河如何塑造商贸城市与南北货物流动。",
    knowledgeTags: ["临清钞关", "码头经济", "南北贸易"],
    generatedFeatures: ["商贸谈判", "人物访谈", "图鉴总结"]
  }
];
```

- [ ] **Step 5: Add NPC catalog**

Create `src/game/npcs.ts`:

```ts
import type { NpcProfile } from "./types";

export const npcProfiles: NpcProfile[] = [
  {
    id: "wang-huaiyuan",
    name: "王淮远",
    role: "漕粮督运官",
    portraitSide: "right",
    tone: "克制、负责，回答时带有官员的压力感",
    knows: ["漕粮北运任务", "运粮文书", "船队出发经过", "官方问责压力"],
    avoids: ["不主动承认督运失职", "前期不判断完整沉船原因"],
    openingLine: "案卷既已重启，便从这趟皇粮说起。九月十五，船队自扬州北上，人人都知道误期是死罪。",
    fallbackReplies: ["我能告诉你的，是船队确有急令在身。若要查沉船，不可只看一人一事。"]
  },
  {
    id: "zheng-chaosheng",
    name: "郑潮生",
    role: "年轻漕兵",
    portraitSide: "right",
    tone: "压抑、敏感，常从底层漕兵和个人遭遇出发",
    knows: ["船上饮食异常", "漕兵处境", "码头劳作", "运河复通带来的不公"],
    avoids: ["前期不直接承认下药", "不解释所有幕后关系"],
    openingLine: "你问运河？有人靠它升官发财，也有人被它压得喘不过气。",
    fallbackReplies: ["船上那晚并不寻常。可你若只问谁动了手，便漏看了这条河上的许多事。"]
  },
  {
    id: "lin-wenqi",
    name: "林文绮",
    role: "南京织造府相关家族成员",
    portraitSide: "right",
    tone: "温和但警觉，重视家族与兄长线索",
    knows: ["南京织造", "迁都后的贡品北运", "疑似运河线路图", "林文瑾行踪"],
    avoids: ["不完全理解密图前不直接给出结论"],
    openingLine: "我来徐州不是为看热闹。兄长的行踪，与这幅图，也许都被卷进了同一场风波。",
    fallbackReplies: ["织造府本不该涉入漕粮案，可迁都之后，许多事都沿着运河北上了。"]
  },
  {
    id: "su-xiuyun",
    name: "苏岫云",
    role: "扬州戏园女子",
    portraitSide: "right",
    tone: "柔弱、含蓄，常以民间见闻补足案卷",
    knows: ["扬州戏园", "码头市井", "药材来源", "民间流言"],
    avoids: ["不掌握官方文书", "不直接判断沉船责任"],
    openingLine: "戏园后门便是码头。河上来了什么船，城里便多了什么消息。",
    fallbackReplies: ["我只知道，药材、丝绸、粮食和人，都会随着河水来到扬州。"]
  },
  {
    id: "zhao-bingfeng",
    name: "赵秉丰",
    role: "粮商",
    portraitSide: "right",
    tone: "圆滑、谨慎，谈生意时避重就轻",
    knows: ["粮食贸易", "船只征调", "船板与货运成本", "商人与漕运关系"],
    avoids: ["不主动承认劣质船板问题", "不主动暴露利益交换"],
    openingLine: "做粮食生意的人，最怕误期，也最怕船沉。可有些账，不在明面账簿上。",
    fallbackReplies: ["官船、商船、粮船，看着各走各路，真到了码头，哪有分得那么清的道理。"]
  }
];
```

- [ ] **Step 6: Add knowledge and clue cards**

Create `src/game/knowledge.ts`:

```ts
import type { ArchiveCard } from "./types";

export const knowledgeCards: ArchiveCard[] = [
  {
    id: "ming-grain-transport",
    category: "knowledge",
    title: "明代漕运",
    tag: "制度",
    summary: "明代通过漕运将江南粮食输往北方，维系京师和军政供给。迁都北京后，漕运的重要性进一步上升。",
    source: "大运河知识库"
  },
  {
    id: "capital-move-beijing",
    category: "knowledge",
    title: "迁都北京与漕粮北运",
    tag: "政治",
    summary: "永乐时期迁都北京，使南粮北运成为稳定北方军政体系的重要基础，大运河由此成为朝廷命脉。",
    source: "大运河知识库"
  },
  {
    id: "xuzhou-danger-section",
    category: "knowledge",
    title: "徐州险段",
    tag: "地理",
    summary: "徐州一带水势复杂，自古为交通要道，也常因河道、暗礁和水患成为航运风险集中之处。",
    source: "大运河知识库"
  },
  {
    id: "huitong-river",
    category: "knowledge",
    title: "会通河",
    tag: "河道",
    summary: "会通河是元明运河体系的重要段落，明前期的重开和整修使南北漕运重新通畅。",
    source: "大运河知识库"
  },
  {
    id: "nanwang-water-divide",
    category: "knowledge",
    title: "南旺分水",
    tag: "工程",
    summary: "南旺分水枢纽通过调配水源维系会通河通航，是大运河工程智慧的重要代表。",
    source: "大运河知识库"
  },
  {
    id: "yangzhou-wharf",
    category: "knowledge",
    title: "扬州码头",
    tag: "城市",
    summary: "扬州因运河而成为重要商贸与转运节点，粮食、药材、戏班和各色人物都在码头交汇。",
    source: "大运河知识库"
  }
];

export const clueCards: ArchiveCard[] = [
  {
    id: "broken-hull-plank",
    category: "clue",
    title: "船板异常",
    tag: "物证",
    summary: "打捞残片显示船板新旧不一，部分材料质量可疑，说明沉船可能不只因水势。",
    source: "徐州府打捞记录"
  },
  {
    id: "drug-residue",
    category: "clue",
    title: "迷药残渣",
    tag: "物证",
    summary: "船员昏迷症状与药渣线索相互印证，提示船上饮食可能被人动过手脚。",
    source: "医士验看记录"
  },
  {
    id: "grain-transport-order",
    category: "clue",
    title: "运粮文书",
    tag: "文书",
    summary: "急令要求入冬前补运皇粮，时间压力使征粮、调船和护运都处在紧绷状态。",
    source: "漕运衙门文书"
  },
  {
    id: "soldier-testimony",
    category: "clue",
    title: "漕兵证词",
    tag: "人证",
    summary: "漕兵提到船上夜间动静和士卒怨言，显示底层人员对漕运秩序并非全然信服。",
    source: "问询札记"
  },
  {
    id: "canal-route-fragment",
    category: "clue",
    title: "运河线路图残片",
    tag: "关键",
    summary: "残片疑似与运河路线和隐秘传递有关，牵出迁都、锦衣卫和漕运政治风险。",
    source: "林文绮案卷"
  }
];
```

- [ ] **Step 7: Run tests**

Run:

```bash
corepack pnpm test src/game/events.test.ts src/game/knowledge.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/game/types.ts src/game/events.ts src/game/npcs.ts src/game/knowledge.ts src/game/events.test.ts src/game/knowledge.test.ts
git commit -m "feat: add AI archive catalogs"
```

## Task 2: Investigation State and Pure Reducers

**Files:**
- Modify: `ming-zhou-bei-du/src/game/types.ts`
- Modify: `ming-zhou-bei-du/src/game/state.ts`
- Create: `ming-zhou-bei-du/src/game/investigation.ts`
- Test: `ming-zhou-bei-du/src/game/investigation.test.ts`

- [ ] **Step 1: Write reducer tests**

Create `src/game/investigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  completeInvestigation,
  createInvestigationState,
  enterEventArchive,
  selectNpc,
  submitSuggestedChoice
} from "./investigation";

describe("investigation reducers", () => {
  it("starts on the home view with no selected event", () => {
    const state = createInvestigationState();
    expect(state.view).toBe("home");
    expect(state.selectedEventId).toBeUndefined();
  });

  it("enters the playable archive and initializes the first NPC", () => {
    const state = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    expect(state.view).toBe("archive");
    expect(state.selectedEventId).toBe("yongle-shipwreck");
    expect(state.activeNpcId).toBe("wang-huaiyuan");
  });

  it("switches NPCs and appends their opening line", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const state = selectNpc(archive, "zheng-chaosheng");
    expect(state.activeNpcId).toBe("zheng-chaosheng");
    expect(state.messages.at(-1)?.speaker).toBe("郑潮生");
  });

  it("unlocks cards from a suggested choice without duplicates", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const first = submitSuggestedChoice(archive, {
      id: "ask-transport-pressure",
      label: "追问运粮为何如此急迫",
      reply: "急令压在衙门头上，谁也不敢慢。",
      unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
      unlockClues: ["grain-transport-order"]
    });
    const second = submitSuggestedChoice(first, {
      id: "ask-transport-pressure-again",
      label: "再次追问运粮急令",
      reply: "案卷已经记下这道急令。",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["grain-transport-order"]
    });
    expect(second.unlockedKnowledge).toEqual(["ming-grain-transport", "capital-move-beijing"]);
    expect(second.unlockedClues).toEqual(["grain-transport-order"]);
  });

  it("completes with the multi-factor explanation", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const state = completeInvestigation(archive, "multi-factor");
    expect(state.view).toBe("summary");
    expect(state.finalJudgement).toBe("multi-factor");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
corepack pnpm test src/game/investigation.test.ts
```

Expected: FAIL because `investigation.ts` does not exist and new types are missing.

- [ ] **Step 3: Add state types**

Append to `src/game/types.ts`:

```ts
export type AppView = "home" | "archive" | "story" | "summary";
export type InvestigationPhase = "intake" | "interviews" | "evidence-review" | "judgement" | "summary";
export type FinalJudgement = "sabotage" | "bad-plank" | "multi-factor" | "political-risk";

export interface DialogueMessage {
  id: string;
  speaker: string;
  text: string;
  source: "npc" | "player" | "system";
}

export interface SuggestedChoice {
  id: string;
  label: string;
  reply: string;
  unlockKnowledge?: KnowledgeCardId[];
  unlockClues?: ClueCardId[];
}

export interface InvestigationState {
  view: AppView;
  selectedEventId?: EventId;
  activeNpcId: NpcId;
  phase: InvestigationPhase;
  messages: DialogueMessage[];
  unlockedKnowledge: KnowledgeCardId[];
  unlockedClues: ClueCardId[];
  finalJudgement?: FinalJudgement;
  aiMode: "online" | "offline";
}
```

- [ ] **Step 4: Implement reducers**

Create `src/game/investigation.ts`:

```ts
import { eventCatalog, playableEventId } from "./events";
import { npcProfiles } from "./npcs";
import type {
  ClueCardId,
  EventId,
  FinalJudgement,
  InvestigationState,
  KnowledgeCardId,
  NpcId,
  SuggestedChoice
} from "./types";

const firstNpcId: NpcId = "wang-huaiyuan";

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function npcById(npcId: NpcId) {
  const npc = npcProfiles.find((item) => item.id === npcId);
  if (!npc) {
    throw new Error(`NPC ${npcId} not found`);
  }
  return npc;
}

export function createInvestigationState(): InvestigationState {
  return {
    view: "home",
    activeNpcId: firstNpcId,
    phase: "intake",
    messages: [],
    unlockedKnowledge: [],
    unlockedClues: [],
    aiMode: "offline"
  };
}

export function enterEventArchive(state: InvestigationState, eventId: EventId): InvestigationState {
  const event = eventCatalog.find((item) => item.id === eventId);
  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  return {
    ...state,
    view: "archive",
    selectedEventId: eventId,
    activeNpcId: firstNpcId,
    phase: eventId === playableEventId ? "intake" : "summary",
    messages: []
  };
}

export function enterStory(state: InvestigationState): InvestigationState {
  const npc = npcById(state.activeNpcId);
  return {
    ...state,
    view: "story",
    phase: "interviews",
    messages: [
      {
        id: `${npc.id}-opening`,
        speaker: npc.name,
        text: npc.openingLine,
        source: "npc"
      }
    ]
  };
}

export function selectNpc(state: InvestigationState, npcId: NpcId): InvestigationState {
  const npc = npcById(npcId);
  return {
    ...state,
    activeNpcId: npcId,
    messages: [
      ...state.messages,
      {
        id: `${npc.id}-${state.messages.length}`,
        speaker: npc.name,
        text: npc.openingLine,
        source: "npc"
      }
    ]
  };
}

export function submitPlayerMessage(state: InvestigationState, text: string): InvestigationState {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: `player-${state.messages.length}`,
        speaker: "案卷整理者",
        text,
        source: "player"
      }
    ]
  };
}

export function submitSuggestedChoice(state: InvestigationState, choice: SuggestedChoice): InvestigationState {
  const npc = npcById(state.activeNpcId);
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: `choice-${choice.id}`,
        speaker: "案卷整理者",
        text: choice.label,
        source: "player"
      },
      {
        id: `reply-${choice.id}`,
        speaker: npc.name,
        text: choice.reply,
        source: "npc"
      }
    ],
    unlockedKnowledge: unique([
      ...state.unlockedKnowledge,
      ...((choice.unlockKnowledge ?? []) as KnowledgeCardId[])
    ]),
    unlockedClues: unique([...state.unlockedClues, ...((choice.unlockClues ?? []) as ClueCardId[])])
  };
}

export function completeInvestigation(state: InvestigationState, finalJudgement: FinalJudgement): InvestigationState {
  return {
    ...state,
    view: "summary",
    phase: "summary",
    finalJudgement
  };
}
```

- [ ] **Step 5: Update legacy state wrapper**

Modify `src/game/state.ts` to export the new initial state while temporarily preserving old route helpers only if tests still import them:

```ts
export { createInvestigationState as createInitialState } from "./investigation";
export type { InvestigationState as GameState } from "./types";
```

If old story tests still need `chooseOption`, keep them until the story files are removed in a later cleanup task.

- [ ] **Step 6: Run reducer tests**

Run:

```bash
corepack pnpm test src/game/investigation.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/game/types.ts src/game/state.ts src/game/investigation.ts src/game/investigation.test.ts
git commit -m "feat: add investigation state reducers"
```

## Task 3: AI Client, Response Validation, and Offline Fallback

**Files:**
- Create: `ming-zhou-bei-du/src/game/ai.ts`
- Test: `ming-zhou-bei-du/src/game/ai.test.ts`

- [ ] **Step 1: Write AI tests**

Create `src/game/ai.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { buildFallbackAiReply, requestAiReply } from "./ai";
import { createInvestigationState, enterEventArchive, enterStory } from "./investigation";

describe("AI reply orchestration", () => {
  it("builds an offline fallback reply with choices and unlocks", () => {
    const state = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
    const reply = buildFallbackAiReply(state, "运粮为何这么急？");
    expect(reply.mode).toBe("offline");
    expect(reply.npcReply.length).toBeGreaterThan(8);
    expect(reply.suggestions).toHaveLength(3);
    expect(reply.suggestions[0].unlockKnowledge).toContain("ming-grain-transport");
  });

  it("falls back when the endpoint rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    const state = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
    const reply = await requestAiReply(state, "船为什么会沉？", fetchMock);
    expect(reply.mode).toBe("offline");
    expect(fetchMock).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
corepack pnpm test src/game/ai.test.ts
```

Expected: FAIL because `ai.ts` does not exist.

- [ ] **Step 3: Implement AI module**

Create `src/game/ai.ts`:

```ts
import { clueCards, knowledgeCards } from "./knowledge";
import { npcProfiles } from "./npcs";
import type { InvestigationState, SuggestedChoice } from "./types";

export interface AiReply {
  mode: "online" | "offline";
  npcReply: string;
  suggestions: SuggestedChoice[];
  triggeredKnowledge: string[];
  triggeredClues: string[];
}

type FetchLike = typeof fetch;

function activeNpc(state: InvestigationState) {
  const npc = npcProfiles.find((item) => item.id === state.activeNpcId);
  if (!npc) {
    throw new Error(`NPC ${state.activeNpcId} not found`);
  }
  return npc;
}

export function buildAiPayload(state: InvestigationState, playerText: string) {
  const npc = activeNpc(state);
  return {
    event: "永乐号沉船案",
    phase: state.phase,
    npc,
    playerText,
    unlockedKnowledge: state.unlockedKnowledge,
    unlockedClues: state.unlockedClues,
    knowledgeContext: knowledgeCards
      .filter((card) => state.unlockedKnowledge.includes(card.id))
      .map((card) => `${card.title}: ${card.summary}`),
    rules: [
      "回答必须保持历史情境和角色口吻",
      "不得提前泄露完整沉船原因",
      "涉及史实优先依据知识卡",
      "知识库没有明确内容时说案卷未明言"
    ]
  };
}

export function buildFallbackAiReply(state: InvestigationState, playerText: string): AiReply {
  const npc = activeNpc(state);
  const text = playerText.includes("船") || playerText.includes("沉")
    ? `${npc.name}沉吟片刻：“若只说船沉，是水势、船板、人心都凑到了一处。案卷还缺几张关键证据。”`
    : npc.fallbackReplies[0];

  return {
    mode: "offline",
    npcReply: text,
    suggestions: [
      {
        id: "ask-transport-pressure",
        label: "追问运粮为何如此急迫",
        reply: "急令压在衙门头上，谁也不敢慢。误期不是小过，征粮、调船、护运便都紧了。",
        unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
        unlockClues: ["grain-transport-order"]
      },
      {
        id: "ask-hull-plank",
        label: "查看船板与暗礁记录",
        reply: "徐州段水势本就难测，若船板再有问题，轻轻一触便可能酿成大祸。",
        unlockKnowledge: ["xuzhou-danger-section"],
        unlockClues: ["broken-hull-plank"]
      },
      {
        id: "ask-crew-food",
        label: "追问船员昏迷前吃过什么",
        reply: "有人说饭后困意来得蹊跷。若医士验看的药渣属实，船上便不只是遇险。",
        unlockClues: ["drug-residue", "soldier-testimony"]
      }
    ],
    triggeredKnowledge: ["ming-grain-transport"],
    triggeredClues: []
  };
}

function isSuggestedChoice(value: unknown): value is SuggestedChoice {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Partial<SuggestedChoice>;
  return typeof item.id === "string" && typeof item.label === "string" && typeof item.reply === "string";
}

function normalizeAiReply(value: unknown): AiReply | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const item = value as Partial<AiReply>;
  if (typeof item.npcReply !== "string" || !Array.isArray(item.suggestions)) {
    return undefined;
  }
  const suggestions = item.suggestions.filter(isSuggestedChoice).slice(0, 5);
  if (suggestions.length === 0) {
    return undefined;
  }
  return {
    mode: "online",
    npcReply: item.npcReply,
    suggestions,
    triggeredKnowledge: Array.isArray(item.triggeredKnowledge) ? item.triggeredKnowledge : [],
    triggeredClues: Array.isArray(item.triggeredClues) ? item.triggeredClues : []
  };
}

export async function requestAiReply(
  state: InvestigationState,
  playerText: string,
  fetchImpl: FetchLike = fetch
): Promise<AiReply> {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT ?? "/api/ai/dialogue";
  const fallback = buildFallbackAiReply(state, playerText);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildAiPayload(state, playerText))
    });
    if (!response.ok) {
      return fallback;
    }
    const data = normalizeAiReply(await response.json());
    return data ?? fallback;
  } catch {
    return fallback;
  }
}
```

- [ ] **Step 4: Run AI tests**

Run:

```bash
corepack pnpm test src/game/ai.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/game/ai.ts src/game/ai.test.ts
git commit -m "feat: add AI reply fallback service"
```

## Task 4: Home and Event Archive Views

**Files:**
- Create: `ming-zhou-bei-du/src/components/EventHome.tsx`
- Create: `ming-zhou-bei-du/src/components/EventArchive.tsx`
- Modify: `ming-zhou-bei-du/src/App.tsx`
- Test: `ming-zhou-bei-du/src/App.test.tsx`

- [ ] **Step 1: Update App tests**

Modify `src/App.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the AI derived story entrances", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "明舟北渡" })).toBeInTheDocument();
    expect(screen.getByText("大运河 AI 衍生剧情实验室")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /永乐号沉船案/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /南旺分水枢纽/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /临清钞关与运河商贸/ })).toBeInTheDocument();
  });

  it("opens the playable event archive", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /永乐号沉船案/ }));
    expect(screen.getByRole("heading", { name: "永乐号沉船案" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "进入案卷" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
corepack pnpm test src/App.test.tsx
```

Expected: FAIL because `App` still renders the old dialogue scene first.

- [ ] **Step 3: Create EventHome**

Create `src/components/EventHome.tsx`:

```tsx
import type { EventId, StoryEvent } from "../game/types";

interface EventHomeProps {
  events: StoryEvent[];
  onSelectEvent: (eventId: EventId) => void;
}

export function EventHome({ events, onSelectEvent }: EventHomeProps) {
  return (
    <section className="home-view" aria-label="AI 衍生剧情实验室">
      <div className="home-heading">
        <span>大运河案卷馆</span>
        <h1>明舟北渡</h1>
        <p>大运河 AI 衍生剧情实验室</p>
      </div>
      <div className="event-grid">
        {events.map((event) => (
          <button className="event-card" key={event.id} onClick={() => onSelectEvent(event.id)}>
            <span className="event-status">{event.status === "playable" ? "完整可玩" : "扩展样例"}</span>
            <strong>{event.title}</strong>
            <small>{event.subtitle}</small>
            <em>{event.typeLabel}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create EventArchive**

Create `src/components/EventArchive.tsx`:

```tsx
import type { StoryEvent } from "../game/types";

interface EventArchiveProps {
  event: StoryEvent;
  onEnterStory: () => void;
  onBack: () => void;
}

export function EventArchive({ event, onBack, onEnterStory }: EventArchiveProps) {
  return (
    <section className="archive-view" aria-label={`${event.title} 档案`}>
      <button className="text-button" onClick={onBack}>
        返回案卷馆
      </button>
      <div className="archive-panel">
        <span>{event.status === "playable" ? "可交互案卷" : "扩展案卷"}</span>
        <h1>{event.title}</h1>
        <p>{event.summary}</p>
        <div className="tag-row">
          {event.knowledgeTags.map((tag) => (
            <i key={tag}>{tag}</i>
          ))}
        </div>
        <dl className="archive-features">
          <dt>AI 衍生内容</dt>
          <dd>{event.generatedFeatures.join(" / ")}</dd>
        </dl>
        <button className="primary-action" onClick={onEnterStory} disabled={event.archiveOnly}>
          {event.archiveOnly ? "暂未开放" : "进入案卷"}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire App view switching**

Modify `src/App.tsx` to use the new state and views:

```tsx
import { useMemo, useState } from "react";
import { DialogueScene } from "./components/DialogueScene";
import { EventArchive } from "./components/EventArchive";
import { EventHome } from "./components/EventHome";
import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { JourneySummary } from "./components/JourneySummary";
import { eventCatalog } from "./game/events";
import { createInvestigationState, enterEventArchive, enterStory } from "./game/investigation";
import type { EventId } from "./game/types";

export default function App() {
  const [gameState, setGameState] = useState(createInvestigationState);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const selectedEvent = useMemo(
    () => eventCatalog.find((event) => event.id === gameState.selectedEventId),
    [gameState.selectedEventId]
  );

  function handleSelectEvent(eventId: EventId) {
    setGameState((state) => enterEventArchive(state, eventId));
  }

  function handleEnterStory() {
    setGameState((state) => enterStory(state));
  }

  function restart() {
    setGameState(createInvestigationState());
    setArchiveOpen(false);
  }

  return (
    <main className="game-shell">
      <header className="top-bar">
        <div className="brand-block">
          <span className="brand-kicker">明代大运河案卷</span>
          <h1>明舟北渡</h1>
        </div>
        <div className="top-actions">
          <button onClick={() => setArchiveOpen(true)} aria-label="打开图鉴" title="打开图鉴">
            证
          </button>
          <button onClick={restart} aria-label="重新开始" title="重新开始">
            ↻
          </button>
        </div>
      </header>

      {gameState.view === "home" && <EventHome events={eventCatalog} onSelectEvent={handleSelectEvent} />}
      {gameState.view === "archive" && selectedEvent && (
        <EventArchive event={selectedEvent} onBack={restart} onEnterStory={handleEnterStory} />
      )}
      {gameState.view === "story" && (
        <DialogueScene state={gameState} setState={setGameState} onOpenArchive={() => setArchiveOpen(true)} />
      )}
      {gameState.view === "summary" && <JourneySummary state={gameState} onRestart={restart} />}

      <EvidenceDrawer open={archiveOpen} state={gameState} onClose={() => setArchiveOpen(false)} />
    </main>
  );
}
```

This step references `JourneySummary`, updated `DialogueScene`, and updated `EvidenceDrawer`; add temporary minimal stubs in those files if TypeScript needs them before later tasks.

- [ ] **Step 6: Run App tests**

Run:

```bash
corepack pnpm test src/App.test.tsx
```

Expected: PASS after temporary component signatures compile.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/App.tsx src/App.test.tsx src/components/EventHome.tsx src/components/EventArchive.tsx
git commit -m "feat: add event archive entry flow"
```

## Task 5: Dialogue Scene with NPC Switching, Free Input, and AI Suggestions

**Files:**
- Modify: `ming-zhou-bei-du/src/components/DialogueScene.tsx`
- Modify: `ming-zhou-bei-du/src/components/DialogueScene.test.tsx`

- [ ] **Step 1: Replace DialogueScene tests**

Modify `src/components/DialogueScene.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { enterEventArchive, enterStory } from "../game/investigation";
import { createInvestigationState } from "../game/investigation";
import { DialogueScene } from "./DialogueScene";

function storyState() {
  return enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
}

describe("DialogueScene", () => {
  it("renders the active NPC and free input", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);
    expect(screen.getByText("王淮远")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("写下你的问询札记")).toBeInTheDocument();
  });

  it("switches NPCs through the character list", async () => {
    const setState = vi.fn();
    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /郑潮生/ }));
    expect(setState).toHaveBeenCalled();
  });

  it("submits free text to the AI reply flow", async () => {
    const setState = vi.fn();
    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText("写下你的问询札记"), "船为什么会沉？");
    await userEvent.click(screen.getByRole("button", { name: "问询" }));
    expect(setState).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: FAIL because `DialogueScene` still accepts old props.

- [ ] **Step 3: Implement DialogueScene**

Modify `src/components/DialogueScene.tsx`:

```tsx
import { useMemo, useState } from "react";
import { requestAiReply } from "../game/ai";
import { npcProfiles } from "../game/npcs";
import {
  selectNpc,
  submitPlayerMessage,
  submitSuggestedChoice
} from "../game/investigation";
import type { InvestigationState, SuggestedChoice } from "../game/types";

interface DialogueSceneProps {
  state: InvestigationState;
  setState: React.Dispatch<React.SetStateAction<InvestigationState>>;
  onOpenArchive: () => void;
}

export function DialogueScene({ state, setState, onOpenArchive }: DialogueSceneProps) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedChoice[]>([
    {
      id: "ask-transport-pressure",
      label: "追问运粮为何如此急迫",
      reply: "急令压在衙门头上，谁也不敢慢。误期不是小过，征粮、调船、护运便都紧了。",
      unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
      unlockClues: ["grain-transport-order"]
    },
    {
      id: "ask-hull-plank",
      label: "查看船板与暗礁记录",
      reply: "徐州段水势本就难测，若船板再有问题，轻轻一触便可能酿成大祸。",
      unlockKnowledge: ["xuzhou-danger-section"],
      unlockClues: ["broken-hull-plank"]
    },
    {
      id: "ask-crew-food",
      label: "追问船员昏迷前吃过什么",
      reply: "有人说饭后困意来得蹊跷。若医士验看的药渣属实，船上便不只是遇险。",
      unlockClues: ["drug-residue", "soldier-testimony"]
    }
  ]);
  const activeNpc = useMemo(
    () => npcProfiles.find((npc) => npc.id === state.activeNpcId) ?? npcProfiles[0],
    [state.activeNpcId]
  );
  const lastMessage = state.messages.at(-1);

  async function submitFreeText() {
    const text = input.trim();
    if (!text || pending) {
      return;
    }
    setInput("");
    setPending(true);
    setState((current) => submitPlayerMessage(current, text));
    const reply = await requestAiReply(state, text);
    setSuggestions(reply.suggestions);
    setState((current) => ({
      ...current,
      aiMode: reply.mode,
      messages: [
        ...current.messages,
        {
          id: `ai-${current.messages.length}`,
          speaker: activeNpc.name,
          text: reply.npcReply,
          source: "npc"
        }
      ]
    }));
    setPending(false);
  }

  function chooseSuggestion(choice: SuggestedChoice) {
    setState((current) => submitSuggestedChoice(current, choice));
  }

  return (
    <section className="scene scene-wharf" aria-label="永乐号沉船案">
      <div className="scene-atmosphere" aria-hidden="true">
        <div className="river-ribbon" />
        <div className="grain-boat boat-one" />
        <div className="grain-boat boat-two" />
      </div>

      <div className="location-card">
        <span>当前案卷</span>
        <strong>永乐号沉船案</strong>
        <small>扬州启运 -> 徐州险段</small>
      </div>

      <div className="evidence-chip" aria-label="已归档卡片">
        案卷 {state.unlockedKnowledge.length + state.unlockedClues.length}
      </div>

      <div className="npc-switcher" aria-label="可问询人物">
        {npcProfiles.map((npc) => (
          <button
            key={npc.id}
            className={npc.id === state.activeNpcId ? "npc-tab npc-tab-active" : "npc-tab"}
            onClick={() => setState((current) => selectNpc(current, npc.id))}
          >
            {npc.name}
          </button>
        ))}
      </div>

      <div className="portraits" aria-label="对话人物">
        <div className="portrait portrait-left portrait-active">
          <span>案卷整理者</span>
          <small>临时巡检</small>
        </div>
        <div className="portrait portrait-right portrait-active">
          <span>{activeNpc.name}</span>
          <small>{activeNpc.role}</small>
        </div>
      </div>

      <div className="dialogue-panel">
        <div className="speaker-name">{lastMessage?.speaker ?? activeNpc.name}</div>
        <p>{lastMessage?.text ?? activeNpc.openingLine}</p>
        <div className="choice-list">
          {suggestions.map((choice) => (
            <button key={choice.id} className="choice-button" onClick={() => chooseSuggestion(choice)}>
              <span>{choice.label}</span>
            </button>
          ))}
        </div>
        <div className="free-input-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="写下你的问询札记"
          />
          <button onClick={submitFreeText}>{pending ? "生成中" : "问询"}</button>
          <button onClick={onOpenArchive}>归档</button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
corepack pnpm test src/components/DialogueScene.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/DialogueScene.tsx src/components/DialogueScene.test.tsx
git commit -m "feat: add AI dialogue scene controls"
```

## Task 6: Archive Drawer for Knowledge, Clues, and NPC Files

**Files:**
- Modify: `ming-zhou-bei-du/src/components/EvidenceDrawer.tsx`
- Modify: `ming-zhou-bei-du/src/components/EvidenceDrawer.test.tsx`

- [ ] **Step 1: Update drawer tests**

Modify `src/components/EvidenceDrawer.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { enterEventArchive, enterStory, submitSuggestedChoice } from "../game/investigation";
import { createInvestigationState } from "../game/investigation";
import { EvidenceDrawer } from "./EvidenceDrawer";

function stateWithCards() {
  const story = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
  return submitSuggestedChoice(story, {
    id: "ask-transport-pressure",
    label: "追问运粮为何如此急迫",
    reply: "急令压在衙门头上。",
    unlockKnowledge: ["ming-grain-transport"],
    unlockClues: ["grain-transport-order"]
  });
}

describe("EvidenceDrawer", () => {
  it("renders empty archive guidance", () => {
    render(<EvidenceDrawer open state={createInvestigationState()} onClose={() => {}} />);
    expect(screen.getByText(/尚无归档卡片/)).toBeInTheDocument();
  });

  it("renders unlocked knowledge and clue cards", () => {
    render(<EvidenceDrawer open state={stateWithCards()} onClose={() => {}} />);
    expect(screen.getByText("明代漕运")).toBeInTheDocument();
    expect(screen.getByText("运粮文书")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
corepack pnpm test src/components/EvidenceDrawer.test.tsx
```

Expected: FAIL because `EvidenceDrawer` still accepts `evidenceIds`.

- [ ] **Step 3: Implement generalized drawer**

Modify `src/components/EvidenceDrawer.tsx`:

```tsx
import { clueCards, knowledgeCards } from "../game/knowledge";
import { npcProfiles } from "../game/npcs";
import type { InvestigationState } from "../game/types";

interface EvidenceDrawerProps {
  open: boolean;
  state: InvestigationState;
  onClose: () => void;
}

export function EvidenceDrawer({ open, state, onClose }: EvidenceDrawerProps) {
  const unlockedKnowledge = knowledgeCards.filter((card) => state.unlockedKnowledge.includes(card.id));
  const unlockedClues = clueCards.filter((card) => state.unlockedClues.includes(card.id));
  const hasCards = unlockedKnowledge.length > 0 || unlockedClues.length > 0;

  return (
    <aside className={`evidence-drawer ${open ? "evidence-drawer-open" : ""}`} aria-label="案卷图鉴">
      <div className="drawer-heading">
        <div>
          <span>大运河知识库</span>
          <h2>案卷图鉴</h2>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="关闭案卷图鉴">
          ×
        </button>
      </div>

      {!hasCards && <p className="empty-evidence">尚无归档卡片。问询人物、选择线索后，知识卡与线索卡会在此处展开。</p>}

      {unlockedKnowledge.length > 0 && (
        <section className="drawer-section">
          <h3>知识卡</h3>
          {unlockedKnowledge.map((card) => (
            <article className="evidence-card evidence-key" key={card.id}>
              <strong>{card.title}</strong>
              <span>{card.tag} · {card.source}</span>
              <p>{card.summary}</p>
            </article>
          ))}
        </section>
      )}

      {unlockedClues.length > 0 && (
        <section className="drawer-section">
          <h3>线索卡</h3>
          {unlockedClues.map((card) => (
            <article className="evidence-card evidence-physical" key={card.id}>
              <strong>{card.title}</strong>
              <span>{card.tag} · {card.source}</span>
              <p>{card.summary}</p>
            </article>
          ))}
        </section>
      )}

      <section className="drawer-section">
        <h3>人物档案</h3>
        {npcProfiles.map((npc) => (
          <article className="evidence-card" key={npc.id}>
            <strong>{npc.name}</strong>
            <span>{npc.role}</span>
            <p>{npc.tone}</p>
          </article>
        ))}
      </section>
    </aside>
  );
}
```

- [ ] **Step 4: Run drawer tests**

Run:

```bash
corepack pnpm test src/components/EvidenceDrawer.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/EvidenceDrawer.tsx src/components/EvidenceDrawer.test.tsx
git commit -m "feat: add knowledge archive drawer"
```

## Task 7: Judgement and Journey Summary

**Files:**
- Create: `ming-zhou-bei-du/src/components/JourneySummary.tsx`
- Modify: `ming-zhou-bei-du/src/components/DialogueScene.tsx`
- Test: `ming-zhou-bei-du/src/App.test.tsx`

- [ ] **Step 1: Add summary flow test**

Append to `src/App.test.tsx`:

```ts
it("can reach the journey summary from the playable archive", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: /永乐号沉船案/ }));
  await userEvent.click(screen.getByRole("button", { name: "进入案卷" }));
  await userEvent.click(screen.getByRole("button", { name: "形成案卷判断" }));
  await userEvent.click(screen.getByRole("button", { name: /多因素叠加/ }));
  expect(screen.getByRole("heading", { name: "旅程总结" })).toBeInTheDocument();
  expect(screen.getByText(/多因素叠加/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
corepack pnpm test src/App.test.tsx
```

Expected: FAIL because the judgement UI and `JourneySummary` are not implemented.

- [ ] **Step 3: Add judgement controls to DialogueScene**

In `DialogueScene.tsx`, import `completeInvestigation`:

```ts
import { completeInvestigation, selectNpc, submitPlayerMessage, submitSuggestedChoice } from "../game/investigation";
```

Add inside the dialogue panel after the free input row:

```tsx
<details className="judgement-panel">
  <summary>形成案卷判断</summary>
  <button onClick={() => setState((current) => completeInvestigation(current, "sabotage"))}>
    人为下药与破坏
  </button>
  <button onClick={() => setState((current) => completeInvestigation(current, "bad-plank"))}>
    劣质船板与暗礁
  </button>
  <button onClick={() => setState((current) => completeInvestigation(current, "multi-factor"))}>
    多因素叠加
  </button>
  <button onClick={() => setState((current) => completeInvestigation(current, "political-risk"))}>
    迁都与运河政治风险
  </button>
</details>
```

- [ ] **Step 4: Create JourneySummary**

Create `src/components/JourneySummary.tsx`:

```tsx
import { clueCards, knowledgeCards } from "../game/knowledge";
import type { FinalJudgement, InvestigationState } from "../game/types";

interface JourneySummaryProps {
  state: InvestigationState;
  onRestart: () => void;
}

const judgementLabels: Record<FinalJudgement, string> = {
  sabotage: "人为下药与破坏",
  "bad-plank": "劣质船板与暗礁",
  "multi-factor": "多因素叠加",
  "political-risk": "迁都与运河政治风险"
};

export function JourneySummary({ onRestart, state }: JourneySummaryProps) {
  const knowledge = knowledgeCards.filter((card) => state.unlockedKnowledge.includes(card.id));
  const clues = clueCards.filter((card) => state.unlockedClues.includes(card.id));
  const judgement = state.finalJudgement ? judgementLabels[state.finalJudgement] : "尚未形成判断";

  return (
    <section className="summary-view" aria-label="旅程总结">
      <div className="ending-panel">
        <span className="ending-kicker">案卷生成</span>
        <h1>旅程总结</h1>
        <p>
          本次调查形成的解释为：{judgement}。永乐号沉船不应只被看作单点谜案，
          它折射出迁都之后漕粮北运、船只征调、徐州险段和人物命运交织出的运河系统。
        </p>
        <div className="ending-proof">
          <strong>已解锁知识卡 {knowledge.length} 张</strong>
          <span>{knowledge.map((card) => card.title).join("、") || "尚未解锁"}</span>
        </div>
        <div className="ending-proof">
          <strong>已归档线索 {clues.length} 张</strong>
          <span>{clues.map((card) => card.title).join("、") || "尚未归档"}</span>
        </div>
        <div className="ending-actions">
          <button onClick={onRestart}>返回案卷馆</button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run summary flow test**

Run:

```bash
corepack pnpm test src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/components/DialogueScene.tsx src/components/JourneySummary.tsx src/App.test.tsx
git commit -m "feat: add investigation judgement summary"
```

## Task 8: Ancient Archive Visual Polish

**Files:**
- Modify: `ming-zhou-bei-du/src/styles.css`

- [ ] **Step 1: Add visual selectors**

Append or integrate these selectors into `src/styles.css`, preserving the existing stage background and portrait work:

```css
.home-view,
.archive-view,
.summary-view {
  position: relative;
  z-index: 1;
  min-height: 0;
  padding: clamp(18px, 4vw, 48px);
  color: var(--paper);
}

.home-heading {
  max-width: 760px;
  margin: 0 auto 28px;
  text-align: center;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55);
}

.home-heading span,
.archive-panel > span,
.event-status {
  color: var(--gold);
  font-size: 13px;
  font-weight: 900;
}

.home-heading h1 {
  margin: 8px 0;
  font-size: clamp(42px, 7vw, 82px);
  letter-spacing: 0;
}

.home-heading p {
  margin: 0;
  font-size: 20px;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.event-card {
  min-height: 250px;
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 20px;
  text-align: left;
  border-radius: 8px;
  color: var(--ink);
  background: rgba(255, 244, 216, 0.88);
  border: 1px solid rgba(216, 168, 79, 0.62);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
}

.event-card strong {
  font-size: 25px;
}

.event-card small,
.event-card em {
  color: var(--reed);
  line-height: 1.6;
  font-style: normal;
}

.archive-panel {
  max-width: 860px;
  margin: 24px auto;
  padding: 30px;
  border-radius: 8px;
  color: var(--ink);
  background: rgba(255, 244, 216, 0.9);
  border: 1px solid rgba(216, 168, 79, 0.58);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}

.tag-row i,
.npc-tab {
  border-radius: 8px;
  padding: 7px 10px;
  font-style: normal;
  color: var(--cinnabar-dark);
  background: rgba(216, 168, 79, 0.18);
  border: 1px solid rgba(157, 47, 25, 0.22);
}

.primary-action,
.text-button {
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 8px;
  color: var(--paper);
  background: var(--cinnabar-dark);
  font-weight: 900;
}

.primary-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.npc-switcher {
  position: absolute;
  left: 50%;
  top: 24px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  transform: translateX(-50%);
}

.npc-tab-active {
  color: var(--paper);
  background: var(--cinnabar-dark);
}

.free-input-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  padding: 0 18px 18px;
}

.free-input-row input {
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(93, 74, 47, 0.3);
  padding: 10px 12px;
  font: inherit;
  color: var(--ink);
  background: rgba(255, 248, 231, 0.8);
}

.free-input-row button,
.judgement-panel button {
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--paper);
  background: var(--cinnabar-dark);
  font-weight: 900;
}

.judgement-panel {
  padding: 0 18px 18px;
  color: var(--ink);
}

.judgement-panel summary {
  cursor: pointer;
  font-weight: 900;
  margin-bottom: 10px;
}

.judgement-panel button {
  margin: 0 8px 8px 0;
}

.drawer-section h3 {
  color: var(--cinnabar-dark);
  margin: 18px 0 10px;
}

@media (max-width: 820px) {
  .event-grid {
    grid-template-columns: 1fr;
  }

  .npc-switcher {
    left: 14px;
    right: 14px;
    top: 82px;
    justify-content: center;
    transform: none;
  }

  .free-input-row {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Run full tests**

Run:

```bash
corepack pnpm test
```

Expected: all tests PASS.

- [ ] **Step 3: Build**

Run:

```bash
corepack pnpm build
```

Expected: TypeScript and Vite build PASS.

- [ ] **Step 4: Browser verify**

Open `http://localhost:5174/` or start the local preview server if it is not running. Verify:

- Desktop home page shows three ancient archive event cards.
- “永乐号沉船案” opens an archive page.
- “进入案卷” opens the dialogue scene.
- NPC tabs switch active speaker.
- Free input produces a fallback reply if no AI endpoint is configured.
- Knowledge drawer shows unlocked cards.
- Summary page is reachable.
- Mobile width around 390px does not overlap text, event cards, NPC tabs, or dialogue controls.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/styles.css
git commit -m "style: polish ancient archive experience"
```

## Task 9: Final Verification and Documentation

**Files:**
- Modify: `ming-zhou-bei-du/README.md`

- [ ] **Step 1: Update README usage notes**

Add a short section to `README.md`:

```md
## AI 衍生剧情 Demo

当前版本展示“三个大运河事件入口 + 一个完整可玩的永乐号沉船案”。NPC 自由问答会优先调用 `VITE_AI_ENDPOINT` 指向的后端接口；如果接口不可用，前端会自动进入“离线案卷模式”，使用预设回复和选项完成演示。

本地运行：

```bash
corepack pnpm install
corepack pnpm dev
```

可选 AI 接口：

```bash
VITE_AI_ENDPOINT=http://localhost:8787/api/ai/dialogue corepack pnpm dev
```
```

- [ ] **Step 2: Run all verification commands**

Run:

```bash
corepack pnpm test
corepack pnpm build
```

Expected: all tests PASS and build PASS.

- [ ] **Step 3: Check git diff**

Run:

```bash
git status --short
git diff --check
```

Expected: only intended app files modified, and `git diff --check` has no whitespace errors.

- [ ] **Step 4: Commit README**

Run:

```bash
git add README.md
git commit -m "docs: document AI derived story demo"
```

- [ ] **Step 5: Final browser smoke test**

Use the in-app browser or local Chrome to verify the same flow from Task 8 Step 4 after the final build.

Expected: no blank page, no console-blocking runtime errors, and the demo can complete from home to journey summary.

## Self-Review Notes

- Spec coverage:
  - Three event entrances: Task 1 and Task 4.
  - One full playable “永乐号沉船案”: Task 2, Task 5, Task 7.
  - AI real/fallback boundary: Task 3.
  - Knowledge and clue cards: Task 1 and Task 6.
  - Ancient visual direction: Task 8.
  - Summary and achievements/reporting: Task 7.
  - README and verification: Task 9.
- Scope check:
  - Real-time image, video, and music generation remain out of MVP. The plan only creates frontend “generation slots” via wording and UI, matching the spec.
  - Multi-story full gameplay remains out of MVP. Expansion entries are archive-only.
- Placeholder scan:
  - No placeholder tokens or vague deferred-work instructions are required for the plan.
- Type consistency:
  - Event IDs, NPC IDs, knowledge IDs, clue IDs, `InvestigationState`, `SuggestedChoice`, and `FinalJudgement` are introduced in Task 1/2 before use in UI tasks.
