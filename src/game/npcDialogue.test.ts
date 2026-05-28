import { describe, expect, it } from "vitest";
import { npcDialogueCatalog, npcVisuals } from "./npcDialogue";
import type { NpcId } from "./types";

const npcIds: NpcId[] = ["wang-huaiyuan", "zheng-chaosheng", "lin-wenqi", "su-xiuyun", "zhao-bingfeng"];

describe("npcDialogueCatalog", () => {
  it("provides three dedicated choices for every NPC", () => {
    for (const npcId of npcIds) {
      expect(npcDialogueCatalog[npcId]).toHaveLength(3);
      expect(new Set(npcDialogueCatalog[npcId].map((choice) => choice.id)).size).toBe(3);
    }
  });

  it("assigns visual scene and portrait classes for every NPC", () => {
    for (const npcId of npcIds) {
      expect(npcVisuals[npcId].sceneClass).toMatch(/^scene-npc-/);
      expect(npcVisuals[npcId].portraitClass).toMatch(/^portrait-npc-/);
      expect(npcVisuals[npcId].backgroundLabel.length).toBeGreaterThan(4);
    }
  });

  it("keeps core clue unlocks tied to the right NPC paths", () => {
    expect(npcDialogueCatalog["zheng-chaosheng"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "drug-residue"
    );
    expect(npcDialogueCatalog["lin-wenqi"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "canal-route-fragment"
    );
    expect(npcDialogueCatalog["zhao-bingfeng"].flatMap((choice) => choice.unlockClues ?? [])).toContain(
      "broken-hull-plank"
    );
  });

  it("gives each NPC reply enough texture to read like character dialogue", () => {
    for (const choices of Object.values(npcDialogueCatalog)) {
      for (const choice of choices) {
        expect(choice.reply.length).toBeGreaterThanOrEqual(90);
        expect(choice.reply).toMatch(/[。？！]/);
      }
    }
  });
});
