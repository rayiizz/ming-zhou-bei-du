import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { connectClues } from "./insightBoard";

const baseState: InvestigationState = {
  view: "story",
  selectedEventId: "yongle-shipwreck",
  activeNpcId: "wang-huaiyuan",
  phase: "interviews",
  messages: [],
  unlockedKnowledge: [],
  unlockedClues: ["grain-transport-order", "broken-hull-plank", "drug-residue"],
  unlockedInsights: [],
  aiMode: "offline"
};

describe("insightBoard", () => {
  it("unlocks an insight when two clues can explain each other", () => {
    const next = connectClues(baseState, ["grain-transport-order", "broken-hull-plank"]);

    expect(next.unlockedInsights).toContain("rush-and-rotten-plank");
    expect(next.messages.at(-1)).toMatchObject({
      speaker: "智能案牍"
    });
    expect(next.messages.at(-1)?.text).toContain("急令与劣板");
  });

  it("keeps progress unchanged when two clues do not connect yet", () => {
    const next = connectClues(baseState, ["drug-residue", "grain-transport-order"]);

    expect(next.unlockedInsights).toEqual([]);
    expect(next.messages.at(-1)?.text).toContain("暂时不能互证");
  });
});
