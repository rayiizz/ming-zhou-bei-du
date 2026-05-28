import type { StoryEvent } from "../game/types";

interface EventArchiveProps {
  event: StoryEvent;
  onEnterStory: () => void;
  onBack: () => void;
}

export function EventArchive({ event, onBack, onEnterStory }: EventArchiveProps) {
  return (
    <section className="archive-view" aria-label={`${event.title} 档案`}>
      <button className="text-button" onClick={onBack}>
        返回案卷馆
      </button>
      <div className="archive-panel">
        <span>{event.status === "playable" ? "可交互案卷" : "扩展案卷"}</span>
        <h1>{event.title}</h1>
        <p>{event.summary}</p>
        <div className="tag-row">
          {event.knowledgeTags.map((tag) => (
            <i key={tag}>{tag}</i>
          ))}
        </div>
        <dl className="archive-features">
          <dt>AI 衍生内容</dt>
          <dd>{event.generatedFeatures.join(" / ")}</dd>
        </dl>
        <button className="primary-action" onClick={onEnterStory} disabled={event.archiveOnly}>
          {event.archiveOnly ? "暂未开放" : "进入案卷"}
        </button>
      </div>
    </section>
  );
}
