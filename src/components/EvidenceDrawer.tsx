import { clueCards, knowledgeCards } from "../game/knowledge";
import { npcProfiles } from "../game/npcs";
import type { InvestigationState } from "../game/types";

interface EvidenceDrawerProps {
  open: boolean;
  state: InvestigationState;
  onClose: () => void;
}

export function EvidenceDrawer({ open, state, onClose }: EvidenceDrawerProps) {
  const unlockedKnowledge = knowledgeCards.filter((card) => state.unlockedKnowledge.includes(card.id));
  const unlockedClues = clueCards.filter((card) => state.unlockedClues.includes(card.id));
  const hasCards = unlockedKnowledge.length > 0 || unlockedClues.length > 0;

  return (
    <aside className={`evidence-drawer ${open ? "evidence-drawer-open" : ""}`} aria-label="案卷图鉴">
      <div className="drawer-heading">
        <div>
          <span>大运河知识库</span>
          <h2>案卷图鉴</h2>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="关闭案卷图鉴">
          ×
        </button>
      </div>

      {!hasCards && (
        <p className="empty-evidence">尚无归档卡片。问询人物、选择线索后，知识卡与线索卡会在此处展开。</p>
      )}

      {unlockedKnowledge.length > 0 && (
        <section className="drawer-section">
          <h3>知识卡</h3>
          {unlockedKnowledge.map((card) => (
            <article className="evidence-card evidence-key" key={card.id}>
              <strong>{card.title}</strong>
              <span>
                {card.tag} · {card.source}
              </span>
              <p>{card.summary}</p>
            </article>
          ))}
        </section>
      )}

      {unlockedClues.length > 0 && (
        <section className="drawer-section">
          <h3>线索卡</h3>
          {unlockedClues.map((card) => (
            <article className="evidence-card evidence-physical" key={card.id}>
              <strong>{card.title}</strong>
              <span>
                {card.tag} · {card.source}
              </span>
              <p>{card.summary}</p>
            </article>
          ))}
        </section>
      )}

      <section className="drawer-section">
        <h3>人物档案</h3>
        {npcProfiles.map((npc) => (
          <article className="evidence-card" key={npc.id}>
            <strong>{npc.name}</strong>
            <span>{npc.role}</span>
            <p>{npc.tone}</p>
          </article>
        ))}
      </section>
    </aside>
  );
}
