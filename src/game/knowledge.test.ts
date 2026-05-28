import { describe, expect, it } from "vitest";
import { clueCards, knowledgeCards } from "./knowledge";

describe("knowledge and clue cards", () => {
  it("provides at least six Grand Canal knowledge cards", () => {
    expect(knowledgeCards).toHaveLength(6);
    expect(knowledgeCards.map((card) => card.id)).toContain("ming-grain-transport");
  });

  it("provides at least five investigation clue cards", () => {
    expect(clueCards).toHaveLength(5);
    expect(clueCards.map((card) => card.id)).toContain("broken-hull-plank");
  });
});
