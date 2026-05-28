import { describe, expect, it } from "vitest";
import {
  completeInvestigation,
  createInvestigationState,
  enterEventArchive,
  selectNpc,
  submitSuggestedChoice
} from "./investigation";
import { npcDialogueCatalog } from "./npcDialogue";

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

  it("turns a suggested choice into a multi-line galgame style exchange", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const state = submitSuggestedChoice(archive, {
      id: "ask-transport-pressure",
      label: "追问运粮为何如此急迫",
      reply: "急令压在衙门头上，谁也不敢慢。误期不是小过，征粮、调船、护运便都紧了。",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["grain-transport-order"]
    });

    expect(state.messages).toHaveLength(5);
    expect(state.messages.map((message) => message.source)).toEqual(["player", "npc", "npc", "player", "npc"]);
    expect(state.messages.at(1)?.speaker).toBe("王淮远");
    expect(state.messages.at(2)?.speaker).toBe("王淮远");
    expect(state.messages.at(3)?.text).not.toContain("我会把这句话记入案卷");
  });

  it("uses natural player dialogue and varied follow-up lines for suggested choices", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const firstChoice = npcDialogueCatalog["wang-huaiyuan"][0];
    const secondChoice = npcDialogueCatalog["wang-huaiyuan"][1];
    const first = submitSuggestedChoice(archive, firstChoice);
    const second = submitSuggestedChoice(first, secondChoice);

    expect(first.messages.at(0)?.text).toBe("王大人，永乐号为何被催得这样急？徐州险段不是能靠一纸急令抢过去的水路。");
    expect(first.messages.at(3)?.text).not.toContain("我会把这句话记入案卷");
    expect(first.messages.at(3)?.text).not.toBe(second.messages.at(8)?.text);
    expect(second.messages.at(5)?.text).toBe("我想再核一遍文书。扬州启运、徐州验报之间，哪一处最可能被人动过手脚？");
  });

  it("completes with a structured case conclusion", () => {
    const archive = enterEventArchive(createInvestigationState(), "yongle-shipwreck");
    const state = completeInvestigation(archive, {
      directCause: "hull-failure",
      drivingForce: "transport-deadline",
      keyEvidence: "broken-hull-plank"
    });
    expect(state.view).toBe("summary");
    expect(state.caseConclusion).toEqual({
      directCause: "hull-failure",
      drivingForce: "transport-deadline",
      keyEvidence: "broken-hull-plank"
    });
  });
});
