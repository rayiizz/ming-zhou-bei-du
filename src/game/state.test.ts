import { describe, expect, it } from "vitest";
import { createInitialState, chooseOption } from "./state";

describe("game state", () => {
  it("adds evidence once when a choice awards evidence", () => {
    const state = {
      ...createInitialState(),
      collectedEvidence: ["hangzhou-ledger" as const]
    };
    const next = chooseOption(state, "check-ledger");
    expect(next.collectedEvidence).toEqual(["hangzhou-ledger"]);
  });

  it("sets flags from risky choices", () => {
    const afterStart = chooseOption(createInitialState(), "depart");
    const afterSuzhou = chooseOption(afterStart, "go-yangzhou");
    const afterYangzhou = chooseOption(afterSuzhou, "accept-replacement");
    expect(afterYangzhou.flags.acceptedReplacementGrain).toBe(true);
  });
});
