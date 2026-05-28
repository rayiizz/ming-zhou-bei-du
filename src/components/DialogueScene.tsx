import { useEffect, useMemo, useRef, useState } from "react";
import { requestAiReply } from "../game/ai";
import { getCasePhase } from "../game/caseProgression";
import { presentEvidenceToNpc } from "../game/evidencePresentation";
import { getFollowUpChoices } from "../game/followUpDialogue";
import { connectClues, insightCatalog } from "../game/insightBoard";
import { completeInvestigation, selectNpc, submitPlayerMessage, submitSuggestedChoice } from "../game/investigation";
import { getInvestigationStatus } from "../game/investigationProgress";
import { clueCards } from "../game/knowledge";
import { npcDialogueCatalog, npcVisuals } from "../game/npcDialogue";
import { npcProfiles } from "../game/npcs";
import type {
  CaseConclusion,
  ClueCardId,
  DirectCause,
  DrivingForce,
  InvestigationState,
  KeyEvidence,
  NpcId,
  SuggestedChoice
} from "../game/types";

interface DialogueSceneProps {
  state: InvestigationState;
  setState: React.Dispatch<React.SetStateAction<InvestigationState>>;
  onOpenArchive: () => void;
}

const directCauseOptions: Array<{ id: DirectCause; label: string; hint: string }> = [
  { id: "night-risk", label: "徐州夜行险段", hint: "水势、暗礁与夜航时机叠加" },
  { id: "hull-failure", label: "船板旧伤与水势冲击", hint: "船身带病进入最险一段河道" },
  { id: "crew-incapacitated", label: "船员失力无法控船", hint: "饭食与药渣使关键船员失去判断" }
];

const drivingForceOptions: Array<{ id: DrivingForce; label: string; hint: string }> = [
  { id: "transport-deadline", label: "漕粮急令压过验船", hint: "误期压力让船况风险被压下" },
  { id: "merchant-ledger", label: "商船调度藏着灰账", hint: "急调、修船与差价互相遮掩" },
  { id: "hidden-route", label: "北上暗线绕开查验", hint: "残图显示有人熟悉水口与查验空隙" }
];

const keyEvidenceOptions: Array<{ id: KeyEvidence; label: string; hint: string }> = [
  { id: "grain-transport-order", label: "运粮文书", hint: "证明急令与行期压力" },
  { id: "broken-hull-plank", label: "船板异常", hint: "证明船体隐患并非水急才出现" },
  { id: "drug-residue", label: "药渣", hint: "证明船员失能另有原因" },
  { id: "soldier-testimony", label: "漕兵证词", hint: "证明船上夜间异常与饭食细节" },
  { id: "canal-route-fragment", label: "残缺路线图", hint: "证明北上路线可能另有安排" }
];

export function DialogueScene({ state, setState, onOpenArchive }: DialogueSceneProps) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [judging, setJudging] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [caseBoardOpen, setCaseBoardOpen] = useState(false);
  const [selectedBoardClues, setSelectedBoardClues] = useState<ClueCardId[]>([]);
  const [caseConclusion, setCaseConclusion] = useState<CaseConclusion>({
    directCause: "hull-failure",
    drivingForce: "transport-deadline",
    keyEvidence: "broken-hull-plank"
  });
  const [suggestions, setSuggestions] = useState<SuggestedChoice[]>(npcDialogueCatalog[state.activeNpcId]);
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(Math.max(0, state.messages.length - 1));
  const previousMessageCount = useRef(state.messages.length);
  const playerProfile = {
    name: "沈砚",
    role: "案卷整理者",
    emotion: "冷静"
  };
  const activeNpc = useMemo(
    () => npcProfiles.find((npc) => npc.id === state.activeNpcId) ?? npcProfiles[0],
    [state.activeNpcId]
  );
  const activeVisual = npcVisuals[state.activeNpcId];
  const investigationStatus = getInvestigationStatus(state);
  const casePhase = getCasePhase(state);
  const unlockedClueCards = clueCards.filter((clue) => state.unlockedClues.includes(clue.id));
  const unlockedInsights = insightCatalog.filter((insight) => state.unlockedInsights.includes(insight.id));
  const visibleChoices = useMemo(() => {
    const allChoices = [...suggestions, ...getFollowUpChoices(state)];
    return allChoices.filter((choice, index) => allChoices.findIndex((item) => item.id === choice.id) === index);
  }, [state, suggestions]);
  useEffect(() => {
    const previousCount = previousMessageCount.current;
    if (state.messages.length > previousCount) {
      setVisibleMessageIndex(previousCount);
    } else if (state.messages.length === 0) {
      setVisibleMessageIndex(0);
    } else if (visibleMessageIndex >= state.messages.length) {
      setVisibleMessageIndex(state.messages.length - 1);
    }
    previousMessageCount.current = state.messages.length;
  }, [state.messages.length, visibleMessageIndex]);

  const visibleMessage = state.messages[visibleMessageIndex] ?? state.messages.at(-1);
  const canAdvanceDialogue = visibleMessageIndex < state.messages.length - 1;
  const canAskQuestion = !canAdvanceDialogue && !pending;
  const activeSpeakerName = visibleMessage?.speaker ?? activeNpc.name;
  const isPlayerSpeaking = activeSpeakerName === playerProfile.role || activeSpeakerName === playerProfile.name;
  const activePressure = state.npcPressure?.[state.activeNpcId];

  async function submitFreeText() {
    const text = input.trim();
    if (!text || pending) {
      return;
    }
    setInput("");
    setPending(true);
    setState((current) => submitPlayerMessage(current, text));
    const reply = await requestAiReply(state, text);
    setSuggestions(reply.suggestions);
    setState((current) => ({
      ...current,
      aiMode: reply.mode,
      messages: [
        ...current.messages,
        {
          id: `ai-${current.messages.length}`,
          speaker: activeNpc.name,
          text: reply.npcReply,
          source: "npc"
        }
      ]
    }));
    setPending(false);
  }

  function chooseSuggestion(choice: SuggestedChoice) {
    setEvidenceOpen(false);
    setCaseBoardOpen(false);
    setJudging(false);
    setState((current) => submitSuggestedChoice(current, choice));
  }

  function advanceDialogue() {
    setVisibleMessageIndex((current) => Math.min(current + 1, state.messages.length - 1));
  }

  function chooseNpc(npcId: NpcId) {
    setSuggestions(npcDialogueCatalog[npcId]);
    setState((current) => selectNpc(current, npcId));
  }

  function presentEvidence(clueId: ClueCardId) {
    setState((current) => presentEvidenceToNpc(current, clueId));
    setEvidenceOpen(false);
  }

  function toggleBoardClue(clueId: ClueCardId) {
    setSelectedBoardClues((current) => {
      if (current.includes(clueId)) {
        return current.filter((id) => id !== clueId);
      }

      return current.length >= 2 ? [current[1], clueId] : [...current, clueId];
    });
  }

  function connectSelectedClues() {
    if (selectedBoardClues.length !== 2) {
      return;
    }

    setState((current) => connectClues(current, selectedBoardClues as [ClueCardId, ClueCardId]));
    setSelectedBoardClues([]);
  }

  function updateConclusion<T extends keyof CaseConclusion>(key: T, value: CaseConclusion[T]) {
    setCaseConclusion((current) => ({ ...current, [key]: value }));
  }

  function submitConclusion() {
    setState((current) => completeInvestigation(current, caseConclusion));
  }

  return (
    <section className={`scene scene-wharf ${activeVisual.sceneClass}`} aria-label="永乐号沉船案">
      <div className="scene-atmosphere" aria-hidden="true">
        <div className="river-ribbon" />
        <div className="grain-boat boat-one" />
        <div className="grain-boat boat-two" />
      </div>

      <div className="cinematic-canal-layers" aria-label="大运河环境层">
        <div className="mist-layer mist-layer-back" />
        <div className="mist-layer mist-layer-front" />
        <div className="water-shimmer" />
        <div className="wreckage-hints">
          <span className="wreckage-plank" />
          <span className="wreckage-rope" />
          <span className="grain-sacks" />
        </div>
      </div>

      <div className="location-card location-card-cinematic" aria-label="沉船案场景信息">
        <span>当前案卷</span>
        <strong>永乐号沉船案</strong>
        <small>{activeVisual.backgroundLabel}</small>
      </div>

      <button className="evidence-chip" onClick={onOpenArchive} aria-label="打开案卷图鉴">
        案卷 {state.unlockedKnowledge.length + state.unlockedClues.length}
      </button>

      <aside className="case-progress" aria-label="调查进度">
        <div className="objective-strip">
          <span>{investigationStatus.label}</span>
          <strong>{investigationStatus.headline}</strong>
          <small>{investigationStatus.archiveText}</small>
          <div className="case-phase">
            <b>{casePhase.label}</b>
            <em>{casePhase.title}</em>
          </div>
        </div>
      </aside>

      <div className="npc-switcher" aria-label="可问询人物">
        {npcProfiles.map((npc) => (
          <button
            key={npc.id}
            className={npc.id === state.activeNpcId ? "npc-tab npc-tab-active" : "npc-tab"}
            aria-label={npc.name}
            onClick={() => chooseNpc(npc.id)}
          >
            {npc.name.slice(0, 1)}
          </button>
        ))}
      </div>

      <div className="portraits" aria-label="对话人物">
        <div
          className={`portrait portrait-left ${isPlayerSpeaking ? "portrait-speaking" : "portrait-dimmed"}`}
          aria-label="沈砚立绘"
        >
          <span>沈砚</span>
          <small>案卷整理者</small>
        </div>
        <div
          className={`portrait portrait-right ${activeVisual.portraitClass} ${
            isPlayerSpeaking ? "portrait-dimmed" : "portrait-speaking"
          }`}
          aria-label={`${activeNpc.name}立绘`}
        >
          <span>{activeNpc.name}</span>
          <small>{activeNpc.role}</small>
        </div>
      </div>

      <div className="dialogue-panel">
        <div className="speaker-name">{visibleMessage?.speaker ?? activeNpc.name}</div>
        {activePressure && (
          <div className={`pressure-cue pressure-cue-${activePressure.mood}`} aria-label="证据追问状态">
            {activePressure.lastCue}
          </div>
        )}
        <p>{visibleMessage?.text ?? activeNpc.openingLine}</p>
        {canAdvanceDialogue ? (
          <div className="dialogue-advance-row">
            <button className="dialogue-advance-button" onClick={advanceDialogue}>
              继续
            </button>
          </div>
        ) : (
          <>
            <div className="choice-list">
              {visibleChoices.map((choice) => (
                <button key={choice.id} className="choice-button" onClick={() => chooseSuggestion(choice)}>
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
            <div className="free-input-row">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="写下你的问询札记" />
              <button onClick={submitFreeText}>{pending ? "生成中" : "问询"}</button>
              <button onClick={() => setEvidenceOpen((value) => !value)}>出示证据</button>
              <button onClick={() => setCaseBoardOpen((value) => !value)}>案卷研判</button>
              <button onClick={onOpenArchive}>归档</button>
            </div>
          </>
        )}
        {evidenceOpen && (
          <div className="evidence-presenter" aria-label="出示证据">
            {unlockedClueCards.length === 0 ? (
              <p>尚无线索可出示。先通过问询收集可归档的证据。</p>
            ) : (
              unlockedClueCards.map((clue) => (
                <button key={clue.id} onClick={() => presentEvidence(clue.id)}>
                  <strong>{clue.title}</strong>
                  <small>{clue.tag}</small>
                </button>
              ))
            )}
          </div>
        )}
        {caseBoardOpen && (
          <div className="case-board-panel" aria-label="案卷研判">
            <div className="case-board-heading">
              <span>智能案牍</span>
              <strong>选择两份线索尝试关联</strong>
            </div>
            <div className="case-board-clues">
              {unlockedClueCards.length === 0 ? (
                <p>尚无线索可研判。先通过问询、出示证据或归档获得线索。</p>
              ) : (
                unlockedClueCards.map((clue) => (
                  <button
                    key={clue.id}
                    className={selectedBoardClues.includes(clue.id) ? "case-board-clue case-board-clue-selected" : "case-board-clue"}
                    onClick={() => toggleBoardClue(clue.id)}
                  >
                    <strong>{clue.title}</strong>
                    <small>{clue.tag}</small>
                  </button>
                ))
              )}
            </div>
            <button className="case-board-connect" onClick={connectSelectedClues} disabled={selectedBoardClues.length !== 2}>
              关联案卷
            </button>
            {unlockedInsights.length > 0 && (
              <div className="case-board-insights">
                {unlockedInsights.map((insight) => (
                  <article key={insight.id}>
                    <strong>{insight.title}</strong>
                    <p>{insight.summary}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="judgement-panel">
          {canAskQuestion && <button onClick={() => setJudging((value) => !value)}>形成案卷判断</button>}
          {judging && (
            <div className="judgement-dossier" aria-label="结案卷宗">
              <div className="judgement-column">
                <strong>沉船直接诱因</strong>
                {directCauseOptions.map((option) => (
                  <button
                    key={option.id}
                    aria-label={option.label}
                    className={caseConclusion.directCause === option.id ? "judgement-choice judgement-choice-active" : "judgement-choice"}
                    onClick={() => updateConclusion("directCause", option.id)}
                  >
                    <span>{option.label}</span>
                    <small>{option.hint}</small>
                  </button>
                ))}
              </div>
              <div className="judgement-column">
                <strong>背后推动力量</strong>
                {drivingForceOptions.map((option) => (
                  <button
                    key={option.id}
                    aria-label={option.label}
                    className={caseConclusion.drivingForce === option.id ? "judgement-choice judgement-choice-active" : "judgement-choice"}
                    onClick={() => updateConclusion("drivingForce", option.id)}
                  >
                    <span>{option.label}</span>
                    <small>{option.hint}</small>
                  </button>
                ))}
              </div>
              <div className="judgement-column">
                <strong>关键证据</strong>
                {keyEvidenceOptions.map((option) => (
                  <button
                    key={option.id}
                    aria-label={option.label}
                    className={caseConclusion.keyEvidence === option.id ? "judgement-choice judgement-choice-active" : "judgement-choice"}
                    onClick={() => updateConclusion("keyEvidence", option.id)}
                  >
                    <span>{option.label}</span>
                    <small>{option.hint}</small>
                  </button>
                ))}
              </div>
              <button className="judgement-submit" onClick={submitConclusion}>
                写入结案卷宗
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
