import { endings } from "../game/ending";
import { evidenceCatalog } from "../game/evidence";
import type { EndingId, EvidenceId } from "../game/types";

interface EndingPanelProps {
  endingId: EndingId;
  evidenceIds: EvidenceId[];
  onRestart: () => void;
  onOpenEvidence: () => void;
}

export function EndingPanel({ endingId, evidenceIds, onRestart, onOpenEvidence }: EndingPanelProps) {
  const ending = endings[endingId];

  return (
    <section className="ending-panel">
      <span className="ending-kicker">通州审粮｜案卷落印</span>
      <h1>{ending.title}</h1>
      <p>{ending.summary}</p>
      <div className="ending-proof">
        <strong>呈堂证据</strong>
        <span>{evidenceIds.length > 0 ? evidenceIds.map((id) => evidenceCatalog[id].title).join("、") : "无"}</span>
      </div>
      <div className="ending-actions">
        <button onClick={onRestart}>重新开始</button>
        <button onClick={onOpenEvidence}>查看证据册</button>
      </div>
    </section>
  );
}
