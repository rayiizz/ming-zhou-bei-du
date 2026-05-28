interface GameTutorialProps {
  onBack: () => void;
  onStart: () => void;
}

const tutorialSteps = [
  {
    title: "问询人物",
    text: "选择人物后，可以点选追问，也可以自由输入问题。不同人物会从官府、漕兵、商路或民间见闻补足案情。"
  },
  {
    title: "出示证据",
    text: "获得线索后，在对话中把证据递给合适的人。人物会给出新的解释、回避或补充证言。"
  },
  {
    title: "案卷研判",
    text: "在案卷图鉴中查看知识卡、线索卡和推理结果。游戏不会直接给答案，需要你判断哪些信息能互相支撑。"
  },
  {
    title: "形成判断",
    text: "当你认为证据足够时，进入最终判断。结论会生成旅程总结，回顾你的调查路径与大运河知识点。"
  }
];

export function GameTutorial({ onBack, onStart }: GameTutorialProps) {
  return (
    <section className="tutorial-view" aria-label="玩法教程">
      <button className="text-button" onClick={onBack}>
        返回主页
      </button>
      <div className="tutorial-layout">
        <div className="tutorial-copy">
          <span>新手案牍</span>
          <h1>玩法教程</h1>
          <p>
            《明舟北渡》的核心不是找唯一按钮，而是在人物对话、证据出示和案卷归纳之间来回推进。把它当作一场大运河沉船案的现场复盘。
          </p>
          <button className="primary-action" onClick={onStart}>
            进入案卷馆
          </button>
        </div>

        <ol className="tutorial-steps">
          {tutorialSteps.map((step, index) => (
            <li key={step.title} className="tutorial-step">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
