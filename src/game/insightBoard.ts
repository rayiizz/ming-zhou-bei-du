import type { ClueCardId, InsightId, InvestigationState } from "./types";

export interface Insight {
  id: InsightId;
  title: string;
  clueIds: [ClueCardId, ClueCardId];
  summary: string;
}

export const insightCatalog: Insight[] = [
  {
    id: "rush-and-rotten-plank",
    title: "急令与劣板",
    clueIds: ["grain-transport-order", "broken-hull-plank"],
    summary: "运粮急令压缩了航程，劣质船板则让永乐号更难承受徐州险段的水势。"
  },
  {
    id: "drugged-crew",
    title: "药渣与漕兵口供",
    clueIds: ["drug-residue", "soldier-testimony"],
    summary: "药渣和漕兵证词互相印证，说明船员失常可能不是单纯疲惫。"
  },
  {
    id: "hidden-route-pressure",
    title: "急令与残图",
    clueIds: ["grain-transport-order", "canal-route-fragment"],
    summary: "急令与残图共同指向一条被催促、被遮掩的北上路径。"
  }
];

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function samePair(left: [ClueCardId, ClueCardId], right: [ClueCardId, ClueCardId]) {
  return left.every((id) => right.includes(id));
}

function findInsight(clueIds: [ClueCardId, ClueCardId]) {
  return insightCatalog.find((insight) => samePair(insight.clueIds, clueIds));
}

export function connectClues(state: InvestigationState, clueIds: [ClueCardId, ClueCardId]): InvestigationState {
  const insight = findInsight(clueIds);

  if (!insight) {
    return {
      ...state,
      messages: [
        ...state.messages,
        {
          id: `insight-miss-${state.messages.length}`,
          speaker: "智能案牍",
          text: "这两份案卷暂时不能互证。也许还需要换一位人物追问，或等待新的线索归档。",
          source: "system"
        }
      ]
    };
  }

  return {
    ...state,
    phase: "evidence-review",
    unlockedInsights: unique([...state.unlockedInsights, insight.id]),
    messages: [
      ...state.messages,
      {
        id: `insight-${insight.id}-${state.messages.length}`,
        speaker: "智能案牍",
        text: `形成研判：${insight.title}。${insight.summary}`,
        source: "system"
      }
    ]
  };
}
