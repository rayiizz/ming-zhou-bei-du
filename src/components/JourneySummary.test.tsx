import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { InvestigationState } from "../game/types";
import { JourneySummary } from "./JourneySummary";

const state: InvestigationState = {
  view: "summary",
  selectedEventId: "yongle-shipwreck",
  activeNpcId: "wang-huaiyuan",
  phase: "summary",
  messages: [],
  unlockedKnowledge: [],
  unlockedClues: ["grain-transport-order", "broken-hull-plank"],
  unlockedInsights: ["rush-and-rotten-plank"],
  caseConclusion: {
    directCause: "hull-failure",
    drivingForce: "transport-deadline",
    keyEvidence: "broken-hull-plank"
  },
  aiMode: "offline"
};

describe("JourneySummary", () => {
  it("renders unlocked case insights in the generated summary", () => {
    render(<JourneySummary state={state} onRestart={() => {}} />);

    expect(screen.getByText("已形成研判 1 条")).toBeInTheDocument();
    expect(screen.getByText("急令与劣板")).toBeInTheDocument();
    expect(screen.getByText("完整案卷")).toBeInTheDocument();
    expect(screen.getByText(/船未必被人凿沉/)).toBeInTheDocument();
  });
});
