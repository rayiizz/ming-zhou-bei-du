import type { InvestigationState } from "./types";

export interface CasePhase {
  label: string;
  title: string;
  description: string;
  level: 1 | 2 | 3 | 4;
}

export function getCasePhase(state: InvestigationState): CasePhase {
  if (state.phase === "summary" || state.finalJudgement) {
    return {
      label: "阶段四",
      title: "结案",
      description: "整理已归档的知识、线索与研判，生成本轮案卷总结。",
      level: 4
    };
  }

  if (state.unlockedInsights.length > 0) {
    return {
      label: "阶段三",
      title: "案卷研判",
      description: "已有线索可以互相印证，尝试形成更完整的沉船解释。",
      level: 3
    };
  }

  if (state.unlockedClues.length > 0 || state.unlockedKnowledge.length > 0) {
    return {
      label: "阶段二",
      title: "追问",
      description: "向不同人物追问细节，必要时出示证据观察反应。",
      level: 2
    };
  }

  return {
    label: "阶段一",
    title: "初访",
    description: "先辨认人物身份、案发地点与永乐号沉没的基本经过。",
    level: 1
  };
}
