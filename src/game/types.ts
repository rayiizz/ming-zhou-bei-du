export type EvidenceType = "account" | "physical" | "witness" | "key";

export type EvidenceId =
  | "hangzhou-ledger"
  | "zhou-rumor"
  | "suzhou-seal-rope"
  | "aqi-testimony"
  | "yangzhou-cargo-note"
  | "yangzhou-private-seal"
  | "huaian-side-ledger"
  | "linqing-witness"
  | "false-boat-gang-lead";

export interface Evidence {
  id: EvidenceId;
  title: string;
  type: EvidenceType;
  source: string;
  reliability: "含糊" | "可信" | "关键" | "可疑";
  description: string;
}

export interface GameFlags {
  acceptedReplacementGrain: boolean;
  trustedFalseLead: boolean;
}

export type EndingId = "truth" | "unproven" | "scapegoat";

export interface Ending {
  id: EndingId;
  title: string;
  summary: string;
}

export interface Choice {
  id: string;
  label: string;
  nextNodeId: string;
  evidenceAward?: EvidenceId;
  setFlag?: Partial<GameFlags>;
}

export interface StoryNode {
  id: string;
  actTitle: string;
  routeLabel: string;
  location: string;
  background: string;
  leftCharacter: string;
  rightCharacter: string;
  activeSpeaker: string;
  dialogue: string;
  choices: Choice[];
  endingId?: EndingId;
}

export interface GameState {
  currentNodeId: string;
  collectedEvidence: EvidenceId[];
  flags: GameFlags;
}

export type EventId = "yongle-shipwreck" | "nanwang-water-divide" | "linqing-customs";
export type EventStatus = "playable" | "expansion";

export interface StoryEvent {
  id: EventId;
  title: string;
  subtitle: string;
  status: EventStatus;
  archiveOnly: boolean;
  typeLabel: string;
  summary: string;
  knowledgeTags: string[];
  generatedFeatures: string[];
}

export type NpcId = "wang-huaiyuan" | "zheng-chaosheng" | "lin-wenqi" | "su-xiuyun" | "zhao-bingfeng";

export interface NpcProfile {
  id: NpcId;
  name: string;
  role: string;
  portraitSide: "left" | "right";
  tone: string;
  knows: string[];
  avoids: string[];
  openingLine: string;
  fallbackReplies: string[];
}

export type KnowledgeCardId =
  | "ming-grain-transport"
  | "capital-move-beijing"
  | "xuzhou-danger-section"
  | "huitong-river"
  | "nanwang-water-divide"
  | "yangzhou-wharf";

export type ClueCardId =
  | "broken-hull-plank"
  | "drug-residue"
  | "grain-transport-order"
  | "soldier-testimony"
  | "canal-route-fragment";

export type InsightId = "rush-and-rotten-plank" | "drugged-crew" | "hidden-route-pressure";

export interface ArchiveCard<TId extends KnowledgeCardId | ClueCardId = KnowledgeCardId | ClueCardId> {
  id: TId;
  title: string;
  category: "knowledge" | "clue";
  tag: string;
  summary: string;
  source: string;
}

export type AppView = "home" | "archive" | "story" | "summary" | "tutorial" | "prologue" | "linqing-prologue";
export type InvestigationPhase = "intake" | "interviews" | "evidence-review" | "judgement" | "summary";
export type FinalJudgement = "sabotage" | "bad-plank" | "multi-factor" | "political-risk";
export type DirectCause = "night-risk" | "hull-failure" | "crew-incapacitated";
export type DrivingForce = "transport-deadline" | "merchant-ledger" | "hidden-route";
export type KeyEvidence = "grain-transport-order" | "broken-hull-plank" | "drug-residue" | "soldier-testimony" | "canal-route-fragment";

export interface CaseConclusion {
  directCause: DirectCause;
  drivingForce: DrivingForce;
  keyEvidence: KeyEvidence;
}

export type NpcPressureMood = "neutral" | "softened" | "guarded";

export interface NpcPressureState {
  mood: NpcPressureMood;
  lastCue: string;
}

export interface DialogueMessage {
  id: string;
  speaker: string;
  text: string;
  source: "npc" | "player" | "system";
}

export interface SuggestedChoice {
  id: string;
  label: string;
  reply: string;
  playerQuestion?: string;
  playerReflection?: string;
  npcAfterword?: string;
  unlockKnowledge?: KnowledgeCardId[];
  unlockClues?: ClueCardId[];
}

export interface InvestigationState {
  view: AppView;
  selectedEventId?: EventId;
  activeNpcId: NpcId;
  phase: InvestigationPhase;
  messages: DialogueMessage[];
  unlockedKnowledge: KnowledgeCardId[];
  unlockedClues: ClueCardId[];
  unlockedInsights: InsightId[];
  finalJudgement?: FinalJudgement;
  caseConclusion?: CaseConclusion;
  npcPressure?: Partial<Record<NpcId, NpcPressureState>>;
  aiMode: "online" | "offline";
}
