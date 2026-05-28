import { useEffect, useState } from "react";
import { assetPath } from "../assetPath";

interface LinqingPrologueProps {
  onEnterChapter: () => void;
  onBack: () => void;
  revealDelayMs?: number;
}

const linqingFrames = [
  {
    src: assetPath("assets/linqing/prologue-city-gate.webp"),
    alt: "临清钞关疑账序章背景一：临清城门",
    caption: "漕船北上，临清城门外商旅云集，钞关税票随水路一并流转。"
  },
  {
    src: assetPath("assets/linqing/prologue-customs-wharf.webp"),
    alt: "临清钞关疑账序章背景二：钞关码头",
    caption: "一批南货在钞关低报为杂货，船单与税票却留下了不合时宜的空白。"
  },
  {
    src: assetPath("assets/linqing/prologue-night-cargo.webp"),
    alt: "临清钞关疑账序章背景三：夜搬货箱",
    caption: "夜色里，有人绕开正栈搬运货箱，脚夫、船主与商号各执一词。"
  },
  {
    src: assetPath("assets/linqing/prologue-tax-office.webp"),
    alt: "临清钞关疑账序章背景四：税房账案",
    caption: "沈砚奉命整理疑账卷宗，要查清这条运河商路究竟漏掉了什么。"
  }
];

export function LinqingPrologue({ onEnterChapter, onBack, revealDelayMs = 20000 }: LinqingPrologueProps) {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setFinished(true), revealDelayMs);
    return () => window.clearTimeout(timer);
  }, [revealDelayMs]);

  return (
    <section className="prologue-view prologue-view-linqing" aria-label="临清钞关疑账序章">
      <div className="prologue-stage">
        {linqingFrames.map((frame, index) => {
          const isFinalFrame = index === linqingFrames.length - 1;
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
        <div className="prologue-narration" aria-label="临清序章旁白">
          {linqingFrames.map((frame, index) => (
            <p key={frame.caption} style={{ animationDelay: `${index * 5}s` }}>
              {frame.caption}
            </p>
          ))}
        </div>
        {finished && (
          <div className="prologue-actions">
            <button className="primary-action" onClick={onEnterChapter}>
              进入钞关
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
