import type { EventId, StoryEvent } from "../game/types";
import type { SaveGameSlot } from "../game/saveGame";

interface EventHomeProps {
  events: StoryEvent[];
  onSelectEvent: (eventId: EventId) => void;
  onOpenTutorial: () => void;
  saveSlots: SaveGameSlot[];
  onLoadSave: (eventId: EventId) => void;
  onClearSave: (eventId: EventId) => void;
}

function formatSaveTime(savedAt: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(savedAt));
}

export function EventHome({ events, onSelectEvent, onOpenTutorial, saveSlots, onLoadSave, onClearSave }: EventHomeProps) {
  const visibleEvents = events.filter((event) => !event.archiveOnly);

  return (
    <section className="home-view" aria-label="AI 衍生剧情实验室">
      <div className="home-heading">
        <span>大运河案卷馆</span>
        <h1>明舟北渡</h1>
        <p>大运河 AI 衍生剧情实验室</p>
        <div className="home-actions" aria-label="主页操作">
          <button className="primary-action" onClick={() => onSelectEvent("yongle-shipwreck")}>
            开始沉船案
          </button>
          <button className="secondary-action home-tutorial-button" onClick={onOpenTutorial}>
            玩法教程
          </button>
        </div>
        {saveSlots.length > 0 && (
          <div className="save-stack" aria-label="本地存档">
            {saveSlots.map((saveSlot) => (
              <div className="save-card" key={`${saveSlot.eventId}-${saveSlot.savedAt}`}>
                <span>上次存档</span>
                <strong>{saveSlot.eventTitle}</strong>
                <small>
                  {saveSlot.viewLabel} · {formatSaveTime(saveSlot.savedAt)}
                </small>
                <div>
                  <button className="secondary-action" onClick={() => onLoadSave(saveSlot.eventId)}>
                    继续{saveSlot.eventTitle}
                  </button>
                  <button
                    className="save-clear-button"
                    onClick={() => onClearSave(saveSlot.eventId)}
                    aria-label={`删除${saveSlot.eventTitle}存档`}
                  >
                    清
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="event-grid">
        {visibleEvents.map((event) => (
          <button
            className="event-card"
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            aria-label={`${event.title}，${event.subtitle}`}
          >
            <span className="event-status">{event.status === "playable" ? "完整可玩" : "扩展样例"}</span>
            <strong>{event.title}</strong>
            <small>{event.subtitle}</small>
            <em>{event.typeLabel}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
