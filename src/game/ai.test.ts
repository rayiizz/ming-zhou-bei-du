import { describe, expect, it, vi } from "vitest";
import { buildFallbackAiReply, requestAiReply } from "./ai";
import { createInvestigationState, enterEventArchive, enterStory } from "./investigation";

describe("AI reply orchestration", () => {
  const baseState = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));

  it("builds an offline fallback reply with choices and unlocks", () => {
    const reply = buildFallbackAiReply(baseState, "运粮为何这么急？");
    expect(reply.mode).toBe("offline");
    expect(reply.npcReply.length).toBeGreaterThan(8);
    expect(reply.suggestions).toHaveLength(3);
    expect(reply.suggestions[0].unlockKnowledge).toContain("ming-grain-transport");
  });

  it("builds a ship-repair answer for plank questions", () => {
    const reply = buildFallbackAiReply(baseState, "船板是不是早就坏了");

    expect(reply.mode).toBe("offline");
    expect(reply.npcReply).toContain("船板");
    expect(reply.suggestions.map((choice) => choice.label).join("")).toContain("船板");
  });

  it("changes depth when matching evidence is unlocked", () => {
    const reply = buildFallbackAiReply(
      { ...baseState, unlockedClues: ["broken-hull-plank"] },
      "船板是不是早就坏了"
    );

    expect(reply.npcReply).toContain("案卷里已有");
  });

  it("falls back when the endpoint rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    const reply = await requestAiReply(baseState, "船为什么会沉？", fetchMock);
    expect(reply.mode).toBe("offline");
    expect(fetchMock).toHaveBeenCalled();
  });
});
