import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { getInvestigationStatus } from "./investigationProgress";

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

describe("investigationProgress", () => {
  it("summarizes investigation status without exposing the answer chain", () => {
    expect(getInvestigationStatus(baseState)).toEqual({
      label: "当前调查",
      headline: "永乐号为何沉没",
      archiveText: "案卷资料 0"
    });

    expect(
      getInvestigationStatus({
        ...baseState,
        unlockedKnowledge: ["ming-grain-transport"],
        unlockedClues: ["grain-transport-order", "broken-hull-plank"]
      }).archiveText
    ).toBe("案卷资料 3");
  });
});
