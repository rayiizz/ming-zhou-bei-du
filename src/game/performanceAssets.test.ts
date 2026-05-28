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

  it("keeps a dedicated narrow-phone layout for cinematic dialogue scenes", () => {
    const styles = readFileSync("src/styles.css", "utf8");
    const start = styles.indexOf("@media (max-width: 480px)");
    const end = styles.indexOf("@media (max-width: 420px)");
    const narrowPhoneRules = start >= 0 && end > start ? styles.slice(start, end) : "";
    const smallerPhoneRules = end >= 0 ? styles.slice(end) : "";

    expect(narrowPhoneRules).toContain(".portraits");
    expect(narrowPhoneRules).toContain("top: 128px");
    expect(narrowPhoneRules).toContain("height: min(33svh, 270px)");
    expect(narrowPhoneRules).toContain("top: 76px");
    expect(narrowPhoneRules).toContain("grid-template-columns: auto 1fr auto");
    expect(narrowPhoneRules).toContain("text-overflow: ellipsis");
    expect(narrowPhoneRules).toContain("max-height: 42svh");
    expect(narrowPhoneRules).toContain("font-size: 15px");
    expect(narrowPhoneRules).toContain("min-height: 50px");
    expect(smallerPhoneRules).not.toContain("max-height: 54vh");
  });

  it("uses mobile-safe Chinese font stacks instead of unavailable calligraphy defaults", () => {
    const styles = readFileSync("src/styles.css", "utf8");

    expect(styles).toContain("--font-ui");
    expect(styles).toContain("--font-display");
    expect(styles).toContain("PingFang SC");
    expect(styles).toContain("Noto Sans CJK SC");
    expect(styles).not.toContain("LXGW WenKai");
    expect(styles).toContain("KaiTi");
    expect(styles).toContain("Kaiti SC");
    expect(styles).toContain("font-family: var(--font-ui)");
  });

  it("declutters the phone dialogue layout so the game view reads as a visual novel", () => {
    const styles = readFileSync("src/styles.css", "utf8");
    const start = styles.indexOf("@media (max-width: 480px)");
    const end = styles.indexOf("@media (max-width: 420px)");
    const narrowPhoneRules = start >= 0 && end > start ? styles.slice(start, end) : "";

    expect(narrowPhoneRules).toContain(".route-cue");
    expect(narrowPhoneRules).toContain("display: none");
    expect(narrowPhoneRules).toContain(".objective-strip small");
    expect(narrowPhoneRules).toContain("top: 12px");
    expect(narrowPhoneRules).toContain("top: 76px");
    expect(narrowPhoneRules).toContain("top: 128px");
    expect(narrowPhoneRules).toContain("max-height: 42svh");
    expect(narrowPhoneRules).toContain("border-image");
  });

  it("centers prologue narration in the viewport without being pushed by controls", () => {
    const styles = readFileSync("src/styles.css", "utf8");

    expect(styles).toContain(".prologue-overlay");
    expect(styles).toContain("position: fixed");
    expect(styles).toContain("inset: 0");
    expect(styles).toContain("place-items: center");
    expect(styles).toContain("translate: -50% -50%");
  });
});
