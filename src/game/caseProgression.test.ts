import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { getCasePhase } from "./caseProgression";

const baseState: InvestigationState = {
  view: "story",
  selectedEventId: "yongle-shipwreck",
  activeNpcId: "wang-huaiyuan",
  phase: "interviews",
  messages: [],
  unlockedKnowledge: [],
  unlockedClues: [],
  unlockedInsights: [],
  aiMode: "offline"
};

describe("caseProgression", () => {
  it("starts at first interviews before clues are archived", () => {
    expect(getCasePhase(baseState)).toMatchObject({
      label: "阶段一",
      title: "初访",
      level: 1
    });
  });

  it("moves into archive review when evidence has been connected", () => {
    expect(
      getCasePhase({
        ...baseState,
        unlockedClues: ["grain-transport-order", "broken-hull-plank"],
        unlockedInsights: ["rush-and-rotten-plank"]
      })
    ).toMatchObject({
      label: "阶段三",
      title: "案卷研判",
      level: 3
    });
  });
});
