import { useEffect, useState } from "react";
import { assetPath } from "../assetPath";

interface StoryPrologueProps {
  onEnterArchive: () => void;
  onBack: () => void;
  revealDelayMs?: number;
}

const prologueFrames = [
  {
    src: assetPath("assets/prologue-nanjing-grain-depot.webp"),
    alt: "沉船案序章背景一：南京漕仓启运",
    caption: "漕粮自南京起运，官仓开封，船队沿大运河北上。"
  },
  {
    src: assetPath("assets/prologue-canal-convoy.webp"),
    alt: "沉船案序章背景二：漕船北上",
    caption: "水路牵动京师粮脉，也牵动沿岸官府、商船与漕兵的命运。"
  },
  {
    src: assetPath("assets/prologue-xuzhou-shipwreck.webp"),
    alt: "沉船案序章背景三：徐州夜雨沉船",
    caption: "抵达徐州险段那夜，首船忽然沉没，账册、船板与证词一同落入暗流。"
  },
  {
    src: assetPath("assets/prologue-investigation-room.webp"),
    alt: "沉船案序章背景四：案房整理证物",
    caption: "你将重整残缺案卷，问询各方人物，判断这场沉船究竟因何而起。"
  }
];

export function StoryPrologue({ onEnterArchive, onBack, revealDelayMs = 20000 }: StoryPrologueProps) {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setFinished(true), revealDelayMs);
    return () => window.clearTimeout(timer);
  }, [revealDelayMs]);

  return (
    <section className="prologue-view" aria-label="永乐号沉船案序章">
      <div className="prologue-stage">
        {prologueFrames.map((frame, index) => {
          const isFinalFrame = index === prologueFrames.length - 1;
          return (
          <img
            alt={frame.alt}
            className={`prologue-frame${isFinalFrame ? " prologue-frame-final" : ""}`}
            data-play-mode="once"
            key={frame.src}
            src={frame.src}
            style={{ animationDelay: `${index * 5}s` }}
          />
          );
        })}
      </div>

      <div className="prologue-overlay">
        <div className="prologue-narration" aria-label="序章旁白">
          {prologueFrames.map((frame, index) => (
            <p key={frame.caption} style={{ animationDelay: `${index * 5}s` }}>
              {frame.caption}
            </p>
          ))}
        </div>
        {finished && (
          <div className="prologue-actions">
            <button className="primary-action" onClick={onEnterArchive}>
              进入案卷馆
            </button>
            <button className="text-button" onClick={onBack}>
              返回主页
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
