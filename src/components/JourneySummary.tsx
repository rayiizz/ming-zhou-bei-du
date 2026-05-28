import { clueCards, knowledgeCards } from "../game/knowledge";
import { insightCatalog } from "../game/insightBoard";
import type { CaseConclusion, DirectCause, DrivingForce, FinalJudgement, InvestigationState, KeyEvidence } from "../game/types";

interface JourneySummaryProps {
  state: InvestigationState;
  onRestart: () => void;
}

const judgementLabels: Record<FinalJudgement, string> = {
  sabotage: "人为下药与破坏",
  "bad-plank": "劣质船板与暗礁",
  "multi-factor": "多因素叠加",
  "political-risk": "迁都与运河政治风险"
};

const directCauseLabels: Record<DirectCause, string> = {
  "night-risk": "徐州夜行险段",
  "hull-failure": "船板旧伤与水势冲击",
  "crew-incapacitated": "船员失力无法控船"
};

const drivingForceLabels: Record<DrivingForce, string> = {
  "transport-deadline": "漕粮急令压过验船",
  "merchant-ledger": "商船调度藏着灰账",
  "hidden-route": "北上暗线绕开查验"
};

const evidenceLabels: Record<KeyEvidence, string> = {
  "grain-transport-order": "运粮文书",
  "broken-hull-plank": "船板异常",
  "drug-residue": "药渣",
  "soldier-testimony": "漕兵证词",
  "canal-route-fragment": "残缺路线图"
};

function evaluateConclusion(conclusion?: CaseConclusion) {
  if (!conclusion) {
    return {
      grade: "尚未形成判断",
      thesis: "案卷仍缺少最终立论。"
    };
  }

  if (
    conclusion.directCause === "hull-failure" &&
    conclusion.drivingForce === "transport-deadline" &&
    ["broken-hull-plank", "grain-transport-order"].includes(conclusion.keyEvidence)
  ) {
    return {
      grade: "完整案卷",
      thesis: "船未必被人凿沉，但有人让它带病上路；急令、船板与徐州险段互相咬合，构成永乐号沉没的主要责任链。"
    };
  }

  if (conclusion.directCause === "crew-incapacitated" && conclusion.keyEvidence === "drug-residue") {
    return {
      grade: "局部真相",
      thesis: "药渣解释了船员为何失力，却仍不足以单独解释夜行、船板与急令之间的责任。"
    };
  }

  return {
    grade: "待补案卷",
    thesis: "这份结论抓住了部分线索，但直接诱因、推动力量和关键证据之间仍需更紧密的互证。"
  };
}

export function JourneySummary({ onRestart, state }: JourneySummaryProps) {
  const knowledge = knowledgeCards.filter((card) => state.unlockedKnowledge.includes(card.id));
  const clues = clueCards.filter((card) => state.unlockedClues.includes(card.id));
  const insights = insightCatalog.filter((insight) => state.unlockedInsights.includes(insight.id));
  const legacyJudgement = state.finalJudgement ? judgementLabels[state.finalJudgement] : "尚未形成判断";
  const conclusion = evaluateConclusion(state.caseConclusion);

  return (
    <section className="summary-view" aria-label="旅程总结">
      <div className="ending-panel">
        <span className="ending-kicker">案卷生成</span>
        <h1>旅程总结</h1>
        <p>
          本次调查形成的卷宗等级为：<strong className="ending-grade">{conclusion.grade}</strong>。
          {state.caseConclusion ? conclusion.thesis : `旧案卷判断为：${legacyJudgement}。`}
        </p>
        {state.caseConclusion && (
          <div className="ending-conclusion" aria-label="结案卷宗">
            <article>
              <span>直接诱因</span>
              <strong>{directCauseLabels[state.caseConclusion.directCause]}</strong>
            </article>
            <article>
              <span>推动力量</span>
              <strong>{drivingForceLabels[state.caseConclusion.drivingForce]}</strong>
            </article>
            <article>
              <span>关键证据</span>
              <strong>{evidenceLabels[state.caseConclusion.keyEvidence]}</strong>
            </article>
          </div>
        )}
        <div className="ending-proof">
          <strong>已解锁知识卡 {knowledge.length} 张</strong>
          <span>{knowledge.map((card) => card.title).join("、") || "尚未解锁"}</span>
        </div>
        <div className="ending-proof">
          <strong>已归档线索 {clues.length} 张</strong>
          <span>{clues.map((card) => card.title).join("、") || "尚未归档"}</span>
        </div>
        <div className="ending-proof">
          <strong>已形成研判 {insights.length} 条</strong>
          <span>{insights.map((insight) => insight.title).join("、") || "尚未形成研判"}</span>
        </div>
        <div className="ending-actions">
          <button onClick={onRestart}>返回案卷馆</button>
        </div>
      </div>
    </section>
  );
}
