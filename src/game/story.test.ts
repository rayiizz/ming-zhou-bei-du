import { describe, expect, it } from "vitest";
import { firstNodeId, storyNodes } from "./story";

describe("story graph", () => {
  it("starts at the Hangzhou granary", () => {
    expect(firstNodeId).toBe("hangzhou-start");
    expect(storyNodes[firstNodeId].location).toBe("杭州粮仓");
  });

  it("has no choices pointing to missing nodes", () => {
    for (const node of Object.values(storyNodes)) {
      for (const choice of node.choices) {
        expect(storyNodes[choice.nextNodeId], `${node.id} -> ${choice.nextNodeId}`).toBeDefined();
      }
    }
  });

  it("includes Grand Canal route labels on every node", () => {
    for (const node of Object.values(storyNodes)) {
      expect(node.routeLabel.length).toBeGreaterThan(3);
    }
  });
});
