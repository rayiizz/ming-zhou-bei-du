import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceFiles = ["src/styles.css", "src/components/StoryPrologue.tsx", "src/components/LinqingPrologue.tsx"];
const deploySourceFiles = ["src/App.tsx", ...sourceFiles];
const optimizedFirstScreenAssets = [
  "public/assets/grand-canal-wharf.webp",
  "public/assets/prologue-nanjing-grain-depot.webp",
  "public/assets/prologue-canal-convoy.webp",
  "public/assets/prologue-xuzhou-shipwreck.webp",
  "public/assets/prologue-investigation-room.webp",
  "public/assets/linqing/prologue-city-gate.webp",
  "public/assets/linqing/prologue-customs-wharf.webp",
  "public/assets/linqing/prologue-night-cargo.webp",
  "public/assets/linqing/prologue-tax-office.webp"
];

describe("performance asset references", () => {
  it("does not reference large first-screen PNG backgrounds directly", () => {
    const source = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

    expect(source).not.toContain("/assets/grand-canal-wharf.png");
    expect(source).not.toContain("/assets/prologue-nanjing-grain-depot.png");
    expect(source).not.toContain("/assets/prologue-canal-convoy.png");
    expect(source).not.toContain("/assets/prologue-xuzhou-shipwreck.png");
    expect(source).not.toContain("/assets/prologue-investigation-room.png");
    expect(source).not.toContain("/assets/linqing/prologue-city-gate.png");
    expect(source).not.toContain("/assets/linqing/prologue-customs-wharf.png");
    expect(source).not.toContain("/assets/linqing/prologue-night-cargo.png");
    expect(source).not.toContain("/assets/linqing/prologue-tax-office.png");
  });

  it("keeps optimized first-screen backgrounds small enough for smooth scene changes", () => {
    optimizedFirstScreenAssets.forEach((assetPath) => {
      expect(statSync(assetPath).size, assetPath).toBeLessThan(250_000);
    });
  });

  it("does not hard-code root asset URLs that break on GitHub Pages project paths", () => {
    const source = deploySourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

    expect(source).not.toContain('"/assets/');
    expect(source).not.toContain("url(\"/assets/");
  });
});
