import { describe, expect, it } from "vitest";
import { eventCatalog, playableEventId } from "./events";

describe("eventCatalog", () => {
  it("contains three event entrances and two playable events", () => {
    expect(eventCatalog).toHaveLength(3);
    expect(eventCatalog.map((event) => event.id)).toEqual([
      "yongle-shipwreck",
      "nanwang-water-divide",
      "linqing-customs"
    ]);
    expect(eventCatalog.find((event) => event.id === playableEventId)?.status).toBe("playable");
    expect(eventCatalog.find((event) => event.id === "linqing-customs")?.status).toBe("playable");
  });

  it("keeps Nanwang as the remaining expansion entry", () => {
    const expansions = eventCatalog.filter((event) => event.status === "expansion");
    expect(expansions).toHaveLength(1);
    expect(expansions[0]?.id).toBe("nanwang-water-divide");
    expect(expansions.every((event) => event.archiveOnly)).toBe(true);
  });
});
