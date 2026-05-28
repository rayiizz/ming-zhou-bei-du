import { useEffect, useMemo, useState } from "react";
import {
  createLinqingChapterSnapshot,
  getLinqingEvidence,
  getLinqingNpc,
  linqingChoices,
  linqingConclusionOptions,
  linqingEvidence,
  linqingNpcs,
  type LinqingChapterMessage,
  type LinqingChapterSnapshot,
  type LinqingConclusion,
  type LinqingEvidenceId,
  type LinqingNpcId,
  type LinqingPressureCue
} from "../game/linqingChapter";

interface LinqingChapterProps {
  onBackHome: () => void;
  initialSnapshot?: LinqingChapterSnapshot;
  onSnapshotChange?: (snapshot: LinqingChapterSnapshot) => void;
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function buildFreeInquiryReply(npcId: LinqingNpcId, text: string): string {
  const npc = getLinqingNpc(npcId);
  if (text.includes("税") || text.includes("票") || text.includes("朱批")) {
    return `${npc.name}沉吟片刻：“钞关只看文书便会被文书牵着走。若税票、朱批和验货时辰错开，就要问是谁让规矩先让了一步。”`;
  }
  if (text.includes("货") || text.includes("箱") || text.includes("船")) {
    return `${npc.name}望向码头：“货箱不会自己走夜路。问货，不如问谁有本事让它避开正栈。”`;
  }
  return `${npc.name}放慢语气：“这话案卷未明言。你若把问题落到税票、船单、夜货或暗账上，我便能说得更准。”`;
}

export function LinqingChapter({ onBackHome, initialSnapshot, onSnapshotChange }: LinqingChapterProps) {
  const startingSnapshot = initialSnapshot ?? createLinqingChapterSnapshot();
  const [activeNpcId, setActiveNpcId] = useState<LinqingNpcId>(startingSnapshot.activeNpcId);
  const [messages, setMessages] = useState<LinqingChapterMessage[]>(startingSnapshot.messages);
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(startingSnapshot.visibleMessageIndex);
  const [unlockedEvidence, setUnlockedEvidence] = useState<LinqingEvidenceId[]>(startingSnapshot.unlockedEvidence);
  const [input, setInput] = useState("");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [judging, setJudging] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(startingSnapshot.summaryOpen);
  const [pressureCue, setPressureCue] = useState<LinqingPressureCue | undefined>(startingSnapshot.pressureCue);
  const [conclusion, setConclusion] = useState<LinqingConclusion>(startingSnapshot.conclusion);
  const activeNpc = getLinqingNpc(activeNpcId);
  const visibleMessage = messages[visibleMessageIndex] ?? messages.at(-1);
  const canAdvance = visibleMessageIndex < messages.length - 1;
  const activeChoices = useMemo(() => linqingChoices.filter((choice) => choice.npcId === activeNpcId), [activeNpcId]);
  const evidenceCards = linqingEvidence.filter((evidence) => unlockedEvidence.includes(evidence.id));
  const isPlayerSpeaking = visibleMessage?.source === "player";

  useEffect(() => {
    onSnapshotChange?.({
      activeNpcId,
      messages,
      visibleMessageIndex,
      unlockedEvidence,
      pressureCue,
      conclusion,
      summaryOpen
    });
  }, [activeNpcId, messages, visibleMessageIndex, unlockedEvidence, pressureCue, conclusion, summaryOpen, onSnapshotChange]);

  function pushMessages(nextMessages: LinqingChapterMessage[], unlocks: LinqingEvidenceId[] = []) {
    setMessages((current) => {
      setVisibleMessageIndex(current.length);
      return [...current, ...nextMessages];
    });
    setUnlockedEvidence((current) => unique([...current, ...unlocks]));
  }

  function switchNpc(npcId: LinqingNpcId) {
    const npc = getLinqingNpc(npcId);
    setActiveNpcId(npcId);
    setEvidenceOpen(false);
    setJudging(false);
    setPressureCue(undefined);
    pushMessages([
      {
        id: `npc-${npcId}-${messages.length}`,
        speaker: npc.name,
        text: npc.opening,
        source: "npc"
      }
    ]);
  }

  function chooseQuestion(choiceId: string) {
    const choice = linqingChoices.find((item) => item.id === choiceId);
    if (!choice) {
      return;
    }
    const npc = getLinqingNpc(choice.npcId);
    setPressureCue(undefined);
    pushMessages(
      [
        {
          id: `player-${choice.id}`,
          speaker: "沈砚",
          text: choice.playerLine,
          source: "player"
        },
        ...choice.replyLines.map((line, index) => ({
          id: `npc-${choice.id}-${index}`,
          speaker: npc.name,
          text: line,
          source: "npc" as const
        }))
      ],
      choice.unlockEvidence ?? []
    );
  }

  function submitFreeInquiry() {
    const text = input.trim();
    if (!text) {
      return;
    }
    setInput("");
    setPressureCue(undefined);
    pushMessages([
      {
        id: `free-player-${messages.length}`,
        speaker: "沈砚",
        text,
        source: "player"
      },
      {
        id: `free-npc-${messages.length + 1}`,
        speaker: activeNpc.name,
        text: buildFreeInquiryReply(activeNpcId, text),
        source: "npc"
      }
    ]);
  }

  function presentEvidence(evidenceId: LinqingEvidenceId) {
    const evidence = getLinqingEvidence(evidenceId);
    const isUsefulPressure =
      (activeNpcId === "gu-chenghuai" && (evidenceId === "tax-ticket" || evidenceId === "customs-seal")) ||
      (activeNpcId === "luo-wanzhou" && (evidenceId === "altered-manifest" || evidenceId === "merchant-ledger")) ||
      (activeNpcId === "ma-san" && evidenceId === "night-cargo") ||
      (activeNpcId === "xu-yingnian" && evidenceId === "merchant-ledger");
    setPressureCue({
      tone: isUsefulPressure ? "softened" : "guarded",
      text: isUsefulPressure
        ? `${activeNpc.name}的语气松了一些，开始把话从规矩背后移出来。`
        : `${activeNpc.name}仍有戒心，这份证据暂时只能压住一句场面话。`
    });
    pushMessages([
      {
        id: `present-${evidenceId}`,
        speaker: "沈砚",
        text: `出示证据：${evidence.title}`,
        source: "player"
      },
      {
        id: `reaction-${activeNpcId}-${evidenceId}`,
        speaker: activeNpc.name,
        text: `${activeNpc.name}看过${evidence.title}，语气低了些：“这件东西若写入卷宗，临清这一船便不能只按寻常商货放过。”`,
        source: "npc"
      }
    ]);
    setEvidenceOpen(false);
  }

  if (summaryOpen) {
    return (
      <section className="linqing-summary" aria-label="临清钞关疑账总结">
        <span>疑账卷宗</span>
        <h1>钞关疑账总结</h1>
        <strong>临清商路暗线</strong>
        <p>
          沈砚将税票、暗账与夜搬证言并入一卷：低报税额不是孤立笔误，而是船主、商号与钞关放行之间互相借力的结果。
        </p>
        <div className="ending-conclusion">
          <article>
            <span>判断</span>
            <strong>{linqingConclusionOptions.cause.find((item) => item.id === conclusion.cause)?.label}</strong>
          </article>
          <article>
            <span>证据</span>
            <strong>{linqingConclusionOptions.proof.find((item) => item.id === conclusion.proof)?.label}</strong>
          </article>
          <article>
            <span>余波</span>
            <strong>商路复查</strong>
          </article>
        </div>
        <button className="primary-action" onClick={onBackHome}>
          返回主页
        </button>
      </section>
    );
  }

  return (
    <section className={`scene scene-wharf linqing-scene ${activeNpc.sceneClass}`} aria-label="临清钞关疑账">
      <div className="scene-atmosphere" aria-hidden="true">
        <div className="river-ribbon" />
        <div className="grain-boat boat-one" />
        <div className="grain-boat boat-two" />
      </div>
      <div className="location-card location-card-cinematic" aria-label="临清钞关场景信息">
        <span>当前案卷</span>
        <strong>临清钞关疑账</strong>
        <small>{activeNpc.backgroundLabel}</small>
      </div>

      <aside className="case-progress linqing-case-progress" aria-label="临清疑账进度">
        <div className="objective-strip">
          <span>临清调查</span>
          <strong>税票、船单与夜货</strong>
          <small>{`疑账线索 ${unlockedEvidence.length}/${linqingEvidence.length}`}</small>
        </div>
      </aside>

      <div className="npc-switcher" aria-label="临清可问询人物">
        {linqingNpcs.map((npc) => (
          <button
            key={npc.id}
            aria-label={npc.name}
            className={npc.id === activeNpcId ? "npc-tab npc-tab-active" : "npc-tab"}
            onClick={() => switchNpc(npc.id)}
          >
            {npc.name.slice(0, 1)}
          </button>
        ))}
      </div>

      <div className="portraits" aria-label="临清对话人物">
        <div
          className={`portrait portrait-left ${isPlayerSpeaking ? "portrait-speaking" : "portrait-dimmed"}`}
          aria-label="沈砚立绘"
        >
          <span>沈砚</span>
          <small>案卷整理者</small>
        </div>
        <div
          className={`portrait portrait-right ${activeNpc.portraitClass} ${
            isPlayerSpeaking ? "portrait-dimmed" : "portrait-speaking"
          }`}
          aria-label={`${activeNpc.name}立绘`}
        >
          <span>{activeNpc.name}</span>
          <small>{activeNpc.role}</small>
        </div>
      </div>

      <div className="dialogue-panel linqing-dialogue-panel">
        <div className="speaker-name">{visibleMessage?.speaker ?? activeNpc.name}</div>
        <p>{visibleMessage?.text ?? activeNpc.opening}</p>
        {canAdvance ? (
          <div className="dialogue-advance-row">
            <button className="dialogue-advance-button" onClick={() => setVisibleMessageIndex((current) => current + 1)}>
              继续
            </button>
          </div>
        ) : (
          <>
            <div className="choice-list">
              {activeChoices.map((choice) => (
                <button key={choice.id} className="choice-button" onClick={() => chooseQuestion(choice.id)}>
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
            <div className="free-input-row">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="写下你的钞关问询" />
              <button onClick={submitFreeInquiry}>问询</button>
              <button onClick={() => setEvidenceOpen((value) => !value)}>出示证据</button>
              <button onClick={() => setJudging((value) => !value)}>形成疑账卷宗</button>
              <button onClick={onBackHome}>归档</button>
            </div>
          </>
        )}

        {evidenceCards.length > 0 && (
          <div className="linqing-evidence-strip" aria-label="已获临清证据">
            {evidenceCards.map((evidence) => (
              <span key={evidence.id}>{evidence.title}</span>
            ))}
          </div>
        )}
        {pressureCue && <div className={`pressure-cue pressure-cue-${pressureCue.tone}`}>{pressureCue.text}</div>}
        {evidenceOpen && (
          <div className="evidence-presenter" aria-label="出示临清证据">
            {evidenceCards.length === 0 ? (
              <p>尚无临清证据。先问询钞关人物，收集税票、船单与暗账。</p>
            ) : (
              evidenceCards.map((evidence) => (
                <button key={evidence.id} onClick={() => presentEvidence(evidence.id)}>
                  <strong>{evidence.title}</strong>
                  <small>{evidence.tag}</small>
                </button>
              ))
            )}
          </div>
        )}
        {judging && (
          <div className="judgement-dossier" aria-label="临清疑账卷宗">
            <div className="judgement-column">
              <strong>疑账性质</strong>
              {linqingConclusionOptions.cause.map((option) => (
                <button
                  key={option.id}
                  aria-label={option.label}
                  className={conclusion.cause === option.id ? "judgement-choice judgement-choice-active" : "judgement-choice"}
                  onClick={() => setConclusion((current) => ({ ...current, cause: option.id }))}
                >
                  <span>{option.label}</span>
                  <small>{option.hint}</small>
                </button>
              ))}
            </div>
            <div className="judgement-column">
              <strong>关键凭据</strong>
              {linqingConclusionOptions.proof.map((option) => (
                <button
                  key={option.id}
                  aria-label={option.label}
                  className={conclusion.proof === option.id ? "judgement-choice judgement-choice-active" : "judgement-choice"}
                  onClick={() => setConclusion((current) => ({ ...current, proof: option.id }))}
                >
                  <span>{option.label}</span>
                  <small>{option.hint}</small>
                </button>
              ))}
            </div>
            <button className="judgement-submit" onClick={() => setSummaryOpen(true)}>
              写入疑账卷宗
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
