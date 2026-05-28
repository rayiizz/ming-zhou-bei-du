import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { getFollowUpChoices } from "./followUpDialogue";

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

describe("followUpDialogue", () => {
  it("unlocks Wang Huaiyuan's second-round question after the rushed-plank insight", () => {
    const choices = getFollowUpChoices({
      ...baseState,
      unlockedInsights: ["rush-and-rotten-plank"]
    });

    expect(choices.map((choice) => choice.label)).toContain("追问急令是否掩盖船板问题");
  });

  it("unlocks Zheng Chaosheng's second-round question after the drugged-crew insight", () => {
    const choices = getFollowUpChoices({
      ...baseState,
      activeNpcId: "zheng-chaosheng",
      unlockedInsights: ["drugged-crew"]
    });

    expect(choices.map((choice) => choice.label)).toContain("追问药渣与当夜饭食");
  });

  it("does not reveal follow-ups before the required clue or insight exists", () => {
    expect(getFollowUpChoices(baseState)).toEqual([]);
  });

  it("keeps unlocked follow-up replies narratively substantial", () => {
    const states: InvestigationState[] = [
      { ...baseState, unlockedInsights: ["rush-and-rotten-plank"] },
      { ...baseState, activeNpcId: "zheng-chaosheng", unlockedInsights: ["drugged-crew"] },
      { ...baseState, activeNpcId: "lin-wenqi", unlockedClues: ["canal-route-fragment"] },
      { ...baseState, activeNpcId: "su-xiuyun", unlockedClues: ["drug-residue"] },
      { ...baseState, activeNpcId: "zhao-bingfeng", unlockedClues: ["grain-transport-order"] }
    ];

    for (const state of states) {
      for (const choice of getFollowUpChoices(state)) {
        expect(choice.reply.length).toBeGreaterThanOrEqual(90);
        expect(choice.reply).toMatch(/[。？！]/);
      }
    }
  });
});
