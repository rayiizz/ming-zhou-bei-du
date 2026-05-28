import { firstNodeId, storyNodes } from "./story";
import type { Choice, GameState } from "./types";

export function createInitialState(): GameState {
  return {
    currentNodeId: firstNodeId,
    collectedEvidence: [],
    flags: {
      acceptedReplacementGrain: false,
      trustedFalseLead: false
    }
  };
}

export function findChoice(state: GameState, choiceId: string): Choice {
  const node = storyNodes[state.currentNodeId];
  const choice = node.choices.find((item) => item.id === choiceId);
  if (!choice) {
    throw new Error(`Choice ${choiceId} not found on node ${state.currentNodeId}`);
  }
  return choice;
}

export function chooseOption(state: GameState, choiceId: string): GameState {
  const choice = findChoice(state, choiceId);
  const nextEvidence =
    choice.evidenceAward && !state.collectedEvidence.includes(choice.evidenceAward)
      ? [...state.collectedEvidence, choice.evidenceAward]
      : state.collectedEvidence;

  return {
    currentNodeId: choice.nextNodeId,
    collectedEvidence: nextEvidence,
    flags: {
      ...state.flags,
      ...choice.setFlag
    }
  };
}
