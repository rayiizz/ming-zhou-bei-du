import { render, screen } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createInvestigationState, enterEventArchive, enterStory } from "../game/investigation";
import { npcDialogueCatalog } from "../game/npcDialogue";
import { npcProfiles } from "../game/npcs";
import { DialogueScene } from "./DialogueScene";

function storyState() {
  return enterStory(enterEventArchive(createInvestigationState(), "yongle-shipwreck"));
}

function StatefulDialogueScene() {
  const [state, setState] = useState(storyState());
  return <DialogueScene state={state} setState={setState} onOpenArchive={() => {}} />;
}

describe("DialogueScene", () => {
  it("renders the active NPC and free input", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);
    expect(screen.getAllByText("王淮远").length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText("写下你的问询札记")).toBeInTheDocument();
  });

  it("renders cinematic case staging metadata", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.queryByText("当前案卷")).not.toBeInTheDocument();
    expect(screen.getByLabelText("可问询人物菜单")).toBeInTheDocument();
    expect(screen.getByLabelText("大运河环境层")).toBeInTheDocument();
  });

  it("renders compact investigation status without exposing a deduction chain", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.queryByLabelText("调查进度")).not.toBeInTheDocument();
    expect(screen.queryByText("当前调查")).not.toBeInTheDocument();
    expect(screen.getByLabelText("可问询人物菜单")).toBeInTheDocument();
    expect(screen.queryByText("推理链")).not.toBeInTheDocument();
  });

  it("opens an empty evidence presenter before clues are archived", async () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "出示证据" }));

    expect(screen.getByLabelText("出示证据")).toBeInTheDocument();
    expect(screen.getByText("尚无线索可出示。先通过问询收集可归档的证据。")).toBeInTheDocument();
  });

  it("presents unlocked evidence to the active NPC", async () => {
    const state = { ...storyState(), unlockedClues: ["grain-transport-order" as const] };
    const setState = vi.fn((updater: unknown) => {
      if (typeof updater === "function") {
        updater(state);
      }
    });

    render(<DialogueScene state={state} setState={setState} onOpenArchive={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "出示证据" }));
    await userEvent.click(screen.getByRole("button", { name: /运粮文书/ }));

    expect(setState).toHaveBeenCalled();
  });

  it("shows the active NPC attitude cue during evidence pressure", () => {
    const state = {
      ...storyState(),
      npcPressure: {
        "wang-huaiyuan": { mood: "softened" as const, lastCue: "王淮远的语气松了一些。" }
      }
    };

    render(<DialogueScene state={state} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByText("王淮远的语气松了一些。")).toBeInTheDocument();
  });

  it("connects two archived clues through the case board", async () => {
    const state = {
      ...storyState(),
      unlockedClues: ["grain-transport-order" as const, "broken-hull-plank" as const],
      unlockedInsights: []
    };
    const setState = vi.fn((updater: unknown) => {
      if (typeof updater === "function") {
        updater(state);
      }
    });

    render(<DialogueScene state={state} setState={setState} onOpenArchive={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "案卷研判" }));
    await userEvent.click(screen.getByRole("button", { name: /运粮文书/ }));
    await userEvent.click(screen.getByRole("button", { name: /船板异常/ }));
    await userEvent.click(screen.getByRole("button", { name: "关联案卷" }));

    expect(setState).toHaveBeenCalled();
  });

  it("shows second-round dialogue choices after a case insight is unlocked", () => {
    const state = {
      ...storyState(),
      unlockedInsights: ["rush-and-rotten-plank" as const]
    };

    render(<DialogueScene state={state} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByRole("button", { name: "追问急令是否掩盖船板问题" })).toBeInTheDocument();
  });

  it("renders active NPC visual metadata for Lin Wenqi", () => {
    const linState = { ...storyState(), activeNpcId: "lin-wenqi" as const };

    render(<DialogueScene state={linState} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByLabelText("永乐号沉船案")).toHaveClass("scene-npc-lin");
    expect(screen.getByRole("button", { name: /林文绮/ })).toHaveClass("npc-tab-active");
    expect(screen.getByLabelText("林文绮立绘")).toHaveClass("portrait-npc-lin");
  });

  it("switches NPCs through the character list", async () => {
    const setState = vi.fn();
    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /郑潮生/ }));
    expect(setState).toHaveBeenCalled();
  });

  it("submits free text to the AI reply flow", async () => {
    const setState = vi.fn();
    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText("写下你的问询札记"), "船为什么会沉？");
    await userEvent.click(screen.getByRole("button", { name: "问询" }));
    expect(setState).toHaveBeenCalled();
  });

  it("builds a structured case conclusion inside the cinematic dialogue panel", async () => {
    const setState = vi.fn();
    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "形成案卷判断" }));

    expect(screen.queryByRole("button", { name: "多因素叠加" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "船板旧伤与水势冲击" }));
    await userEvent.click(screen.getByRole("button", { name: "漕粮急令压过验船" }));
    await userEvent.click(screen.getByRole("button", { name: "船板异常" }));
    await userEvent.click(screen.getByRole("button", { name: "写入结案卷宗" }));

    expect(setState).toHaveBeenCalled();
  });

  it("marks the active speaker portrait for visual emphasis", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByLabelText("沈砚立绘")).toHaveClass("portrait-dimmed");
    expect(screen.getByLabelText("王淮远立绘")).toHaveClass("portrait-speaking");
  });

  it("shows portrait names above identity labels", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    const playerPortrait = screen.getByLabelText("沈砚立绘");
    const npcPortrait = screen.getByLabelText("王淮远立绘");

    expect(playerPortrait.querySelector("span")).toHaveTextContent("沈砚");
    expect(playerPortrait.querySelector("small")).toHaveTextContent("案卷整理者");
    expect(npcPortrait.querySelector("span")).toHaveTextContent("王淮远");
    expect(npcPortrait.querySelector("small")).toHaveTextContent("漕粮督运官");
  });

  it("uses a character menu instead of separate case-status modules", () => {
    render(<DialogueScene state={storyState()} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByLabelText("可问询人物菜单")).toBeInTheDocument();
    expect(screen.queryByLabelText("调查进度")).not.toBeInTheDocument();
    expect(screen.queryByText("当前案卷")).not.toBeInTheDocument();
    for (const npc of npcProfiles) {
      expect(screen.getByRole("button", { name: npc.name })).toHaveTextContent(npc.name);
    }
  });

  it("switches to NPC-specific suggested choices", async () => {
    const setState = vi.fn((updater: unknown) => {
      if (typeof updater === "function") {
        updater(storyState());
      }
    });
    const wangDepartureChoice = npcDialogueCatalog["wang-huaiyuan"].find((choice) => choice.id === "wang-departure-ledger");
    const zhengProfile = npcProfiles.find((npc) => npc.id === "zheng-chaosheng");

    render(<DialogueScene state={storyState()} setState={setState} onOpenArchive={() => {}} />);

    expect(screen.getByRole("button", { name: wangDepartureChoice?.label })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: zhengProfile?.name }));

    expect(setState).toHaveBeenCalled();
  });

  it("renders Zheng Chaosheng choices when he is active", () => {
    const zhengState = { ...storyState(), activeNpcId: "zheng-chaosheng" as const };
    const zhengCrewFoodChoice = npcDialogueCatalog["zheng-chaosheng"].find((choice) => choice.id === "zheng-crew-food");
    const zhengNightNoiseChoice = npcDialogueCatalog["zheng-chaosheng"].find((choice) => choice.id === "zheng-night-noise");

    render(<DialogueScene state={zhengState} setState={() => {}} onOpenArchive={() => {}} />);

    expect(screen.getByRole("button", { name: zhengCrewFoodChoice?.label })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: zhengNightNoiseChoice?.label })).toBeInTheDocument();
  });

  it("plays a selected exchange line by line before showing question choices again", async () => {
    const firstChoice = npcDialogueCatalog["wang-huaiyuan"][0];
    const secondChoice = npcDialogueCatalog["wang-huaiyuan"][1];
    render(<StatefulDialogueScene />);

    await userEvent.click(screen.getByRole("button", { name: firstChoice.label }));

    expect(screen.getByRole("button", { name: "继续" })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("写下你的问询札记")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: secondChoice.label })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));

    expect(screen.getByPlaceholderText("写下你的问询札记")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: secondChoice.label })).toBeInTheDocument();
  });
});
