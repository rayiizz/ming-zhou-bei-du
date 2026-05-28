import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createInvestigationState, enterEventArchive, enterStory, submitSuggestedChoice } from "../game/investigation";
import { EvidenceDrawer } from "./EvidenceDrawer";

function stateWithCards() {
  const story = enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
  return submitSuggestedChoice(story, {
    id: "ask-transport-pressure",
    label: "追问运粮为何如此急迫",
    reply: "急令压在衙门头上。",
    unlockKnowledge: ["ming-grain-transport"],
    unlockClues: ["grain-transport-order"]
  });
}

describe("EvidenceDrawer", () => {
  it("renders empty archive guidance", () => {
    render(<EvidenceDrawer open state={createInvestigationState()} onClose={() => {}} />);
    expect(screen.getByText(/尚无归档卡片/)).toBeInTheDocument();
  });

  it("renders unlocked knowledge and clue cards", () => {
    render(<EvidenceDrawer open state={stateWithCards()} onClose={() => {}} />);
    expect(screen.getByText("明代漕运")).toBeInTheDocument();
    expect(screen.getByText("运粮文书")).toBeInTheDocument();
  });
});
