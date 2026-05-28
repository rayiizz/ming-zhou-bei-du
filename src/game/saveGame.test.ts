import { describe, expect, it, beforeEach } from "vitest";
import { createInvestigationState, enterEventArchive, enterStory } from "./investigation";
import {
  clearSaveGameSlot,
  createSaveGameSlot,
  loadSaveGameSlot,
  loadSaveGameSlots,
  saveGameSlot
} from "./saveGame";

describe("saveGame", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and restores a playable investigation slot", () => {
    const state = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));

    const slot = createSaveGameSlot({ investigationState: state });
    saveGameSlot(slot);

    const restored = loadSaveGameSlot();
    expect(restored?.eventTitle).toBe("永乐号沉船案");
    expect(restored?.viewLabel).toBe("问询中");
    expect(restored?.investigationState.view).toBe("story");
    expect(restored?.investigationState.selectedEventId).toBe("yongle-shipwreck");
  });

  it("clears an existing save slot", () => {
    const slot = createSaveGameSlot({ investigationState: createInvestigationState() });
    saveGameSlot(slot);

    clearSaveGameSlot();

    expect(loadSaveGameSlot()).toBeUndefined();
  });

  it("keeps a separate save slot for each playable story", () => {
    const shipwreck = createSaveGameSlot({
      investigationState: enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck")),
      now: new Date("2026-05-01T08:00:00.000Z")
    });
    const linqing = createSaveGameSlot({
      investigationState: { ...createInvestigationState(), view: "story", selectedEventId: "linqing-customs" },
      now: new Date("2026-05-02T08:00:00.000Z")
    });

    saveGameSlot(shipwreck);
    saveGameSlot(linqing);

    expect(loadSaveGameSlots()).toHaveLength(2);
    expect(loadSaveGameSlot("yongle-shipwreck")?.savedAt).toBe("2026-05-01T08:00:00.000Z");
    expect(loadSaveGameSlot("linqing-customs")?.savedAt).toBe("2026-05-02T08:00:00.000Z");
  });

  it("clears only the requested story save slot", () => {
    saveGameSlot(
      createSaveGameSlot({
        investigationState: enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"))
      })
    );
    saveGameSlot(
      createSaveGameSlot({
        investigationState: { ...createInvestigationState(), view: "story", selectedEventId: "linqing-customs" }
      })
    );

    clearSaveGameSlot("yongle-shipwreck");

    expect(loadSaveGameSlot("yongle-shipwreck")).toBeUndefined();
    expect(loadSaveGameSlot("linqing-customs")?.investigationState.selectedEventId).toBe("linqing-customs");
  });
});
