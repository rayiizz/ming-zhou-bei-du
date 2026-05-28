import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

describe("portrait clarity styling", () => {
  it("does not blur portrait art with CSS filter stacks", () => {
    const portraitRules = styles.match(/\.portrait(?:[-\w\s.,:])* \{[^}]*\}/g)?.join("\n") ?? "";

    expect(portraitRules).not.toContain("drop-shadow(");
    expect(portraitRules).not.toContain("brightness(");
    expect(portraitRules).not.toContain("saturate(");
    expect(portraitRules).not.toContain("sepia(");
    expect(portraitRules).not.toContain("hue-rotate(");
  });
});
