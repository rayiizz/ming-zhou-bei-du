import type { InvestigationState } from "./types";

export interface InvestigationStatus {
  label: string;
  headline: string;
  archiveText: string;
}

export function getInvestigationStatus(state: InvestigationState): InvestigationStatus {
  const archiveCount = state.unlockedKnowledge.length + state.unlockedClues.length;

  return {
    label: "当前调查",
    headline: "永乐号为何沉没",
    archiveText: `案卷资料 ${archiveCount}`
  };
}
