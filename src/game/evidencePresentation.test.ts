import { describe, expect, it } from "vitest";
import type { InvestigationState } from "./types";
import { presentEvidenceToNpc } from "./evidencePresentation";

const baseState: InvestigationState = {
  view: "story",
  selectedEventId: "yongle-shipwreck",
  activeNpcId: "wang-huaiyuan",
  phase: "interviews",
  messages: [],
  unlockedKnowledge: [],
  unlockedClues: ["grain-transport-order", "drug-residue"],
  unlockedInsights: [],
  aiMode: "offline"
};

describe("evidencePresentation", () => {
  it("adds a focused reaction when evidence fits the active NPC", () => {
    const next = presentEvidenceToNpc(baseState, "grain-transport-order");

    expect(next.messages.at(-3)).toMatchObject({
      speaker: "案卷整理者",
      text: "出示证据：运粮文书"
    });
    expect(next.messages.at(-1)?.speaker).toBe("王淮远");
    expect(next.messages.filter((message) => message.speaker === "王淮远").map((message) => message.text).join("")).toContain("误期");
    expect(next.unlockedKnowledge).toContain("ming-grain-transport");
  });

  it("records an attitude shift and staged reaction for fitting evidence", () => {
    const next = presentEvidenceToNpc(baseState, "grain-transport-order");

    expect(next.npcPressure?.["wang-huaiyuan"]).toMatchObject({
      mood: "softened",
      lastCue: expect.stringContaining("语气")
    });
    expect(next.messages.filter((message) => message.speaker === "王淮远").length).toBeGreaterThan(1);
  });

  it("adds an evasive reaction when evidence does not fit the active NPC", () => {
    const next = presentEvidenceToNpc(baseState, "drug-residue");

    expect(next.messages.at(-1)?.speaker).toBe("王淮远");
    expect(next.messages.at(-1)?.text).toContain("这件证据");
    expect(next.unlockedKnowledge).toEqual([]);
  });
});
