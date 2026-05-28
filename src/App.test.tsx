import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the AI derived story entrances", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "明舟北渡" })).toBeInTheDocument();
    expect(screen.getByText("大运河 AI 衍生剧情实验室")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "玩法教程" })).toHaveClass("secondary-action");
    expect(screen.getByRole("button", { name: "开始沉船案" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /永乐号沉船案/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /临清钞关与运河商贸/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /南旺分水枢纽/ })).not.toBeInTheDocument();
    expect(screen.queryByText("暂未开放")).not.toBeInTheDocument();
  });

  it("opens the gameplay tutorial from the home view", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "玩法教程" }));
    expect(screen.getByRole("heading", { name: "玩法教程" })).toBeInTheDocument();
    expect(screen.getByText("问询人物")).toBeInTheDocument();
    expect(screen.getByText("出示证据")).toBeInTheDocument();
    expect(screen.getByText("案卷研判")).toBeInTheDocument();
    expect(screen.getByText("形成判断")).toBeInTheDocument();
  });

  it("starts and pauses background music from the top bar", async () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pauseSpy = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

    render(<App />);

    const musicButton = screen.getByRole("button", { name: "开启背景音乐" });
    expect(screen.getByLabelText("背景音乐")).toHaveAttribute("src", expect.stringContaining("assets/audio/mingzhou-theme.mp3"));
    expect(playSpy).not.toHaveBeenCalled();

    await userEvent.click(musicButton);
    expect(playSpy).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "关闭背景音乐" })).toHaveTextContent("静");

    await userEvent.click(screen.getByRole("button", { name: "关闭背景音乐" }));
    expect(pauseSpy).toHaveBeenCalled();

    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  it("can enter the playable archive from the tutorial", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "玩法教程" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷馆" }));
    expect(screen.getByRole("heading", { name: "永乐号沉船案" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "进入案卷" })).toBeInTheDocument();
  });

  it("opens the playable event prologue and waits to reveal archive entry", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /永乐号沉船案/ }));
    expect(screen.getByLabelText("永乐号沉船案序章")).toBeInTheDocument();
    expect(screen.getByText(/漕粮自南京起运/)).toBeInTheDocument();
    expect(screen.getAllByAltText(/沉船案序章背景/)).toHaveLength(4);
    expect(screen.queryByRole("heading", { name: "沉船案序章" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "进入案卷馆" })).not.toBeInTheDocument();
  });

  it("opens the Linqing customs prologue from the home view", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /临清钞关与运河商贸/ }));
    expect(screen.getByLabelText("临清钞关疑账序章")).toBeInTheDocument();
    expect(screen.getByText(/钞关税票/)).toBeInTheDocument();
  });

  it("can reach the journey summary from the playable archive", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "玩法教程" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷馆" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷" }));
    await userEvent.click(screen.getByRole("button", { name: "形成案卷判断" }));
    await userEvent.click(screen.getByRole("button", { name: "船板旧伤与水势冲击" }));
    await userEvent.click(screen.getByRole("button", { name: "漕粮急令压过验船" }));
    await userEvent.click(screen.getByRole("button", { name: "船板异常" }));
    await userEvent.click(screen.getByRole("button", { name: "写入结案卷宗" }));
    expect(screen.getByRole("heading", { name: "旅程总结" })).toBeInTheDocument();
    expect(screen.getByText("完整案卷")).toBeInTheDocument();
  });

  it("saves the current archive and resumes it from the home view", async () => {
    const firstRender = render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "玩法教程" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷馆" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷" }));
    await userEvent.click(screen.getByRole("button", { name: "保存进度" }));

    expect(screen.getByText("进度已存入案卷书签")).toBeInTheDocument();

    firstRender.unmount();
    render(<App />);

    expect(screen.getByText("上次存档")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /继续永乐号沉船案/ }));

    expect(screen.getByLabelText("永乐号沉船案")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "王淮远" })).toHaveClass("npc-tab-active");
  });

  it("keeps separate continue cards for different story saves", async () => {
    const firstRender = render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "玩法教程" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷馆" }));
    await userEvent.click(screen.getByRole("button", { name: "进入案卷" }));
    await userEvent.click(screen.getByRole("button", { name: "保存进度" }));

    firstRender.unmount();
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /临清钞关与运河商贸/ }));
    await userEvent.click(screen.getByRole("button", { name: "保存进度" }));
    await userEvent.click(screen.getByRole("button", { name: "重新开始" }));
    await userEvent.click(screen.getByRole("button", { name: "确认重开" }));

    expect(screen.getByRole("button", { name: /继续永乐号沉船案/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /继续临清钞关与运河商贸/ })).toBeInTheDocument();
  });

  it("asks before restarting when a save exists", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "保存进度" }));
    await userEvent.click(screen.getByRole("button", { name: "重新开始" }));

    expect(screen.getByRole("dialog", { name: "重新开始确认" })).toBeInTheDocument();
    expect(screen.getByText("当前本地存档会保留，但未保存的新进度会回到主页。")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "继续调查" }));
    expect(screen.queryByRole("dialog", { name: "重新开始确认" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "重新开始" }));
    await userEvent.click(screen.getByRole("button", { name: "确认重开" }));

    expect(screen.getByText("大运河 AI 衍生剧情实验室")).toBeInTheDocument();
  });
});
