import { describe, expect, it } from "vitest";
import { resolveEnding } from "./ending";
import type { GameFlags } from "./types";

const cleanFlags: GameFlags = {
  acceptedReplacementGrain: false,
  trustedFalseLead: false
};

describe("resolveEnding", () => {
  it("reveals the truth when the evidence chain is complete and clean", () => {
    expect(
      resolveEnding(
        ["hangzhou-ledger", "suzhou-seal-rope", "linqing-witness", "yangzhou-private-seal"],
        cleanFlags
      )
    ).toBe("truth");
  });

  it("returns no firm proof when the key evidence is missing", () => {
    expect(resolveEnding(["hangzhou-ledger", "suzhou-seal-rope", "linqing-witness"], cleanFlags)).toBe(
      "unproven"
    );
  });

  it("returns scapegoat when replacement grain was accepted", () => {
    expect(
      resolveEnding(
        ["hangzhou-ledger", "suzhou-seal-rope", "linqing-witness", "yangzhou-private-seal"],
        { acceptedReplacementGrain: true, trustedFalseLead: false }
      )
    ).toBe("scapegoat");
  });
});
