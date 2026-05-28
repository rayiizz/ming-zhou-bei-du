import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LinqingChapter } from "./LinqingChapter";

describe("LinqingChapter", () => {
  it("renders the full customs investigation interface", () => {
    render(<LinqingChapter onBackHome={() => {}} />);

    expect(screen.getByLabelText("临清钞关疑账")).toBeInTheDocument();
    expect(screen.getByText("临清钞关疑账")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "顾承槐" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "罗万舟" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "马三" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "许应年" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("写下你的钞关问询")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "出示证据" })).toBeInTheDocument();
    expect(screen.getByText("疑账线索 0/5")).toBeInTheDocument();
  });

  it("unlocks evidence through dialogue and completes the customs dossier", async () => {
    render(<LinqingChapter onBackHome={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "核对税票为何低报" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));

    expect(screen.getByText("异常税票")).toBeInTheDocument();
    expect(screen.getByText("疑账线索 2/5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "形成疑账卷宗" }));
    await userEvent.click(screen.getByRole("button", { name: "低报税额" }));
    await userEvent.click(screen.getByRole("button", { name: "商号暗账" }));
    await userEvent.click(screen.getByRole("button", { name: "写入疑账卷宗" }));

    expect(screen.getByRole("heading", { name: "钞关疑账总结" })).toBeInTheDocument();
    expect(screen.getByText("临清商路暗线")).toBeInTheDocument();
  });

  it("shows an attitude cue after presenting evidence", async () => {
    render(<LinqingChapter onBackHome={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "核对税票为何低报" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "出示证据" }));
    await userEvent.click(screen.getByRole("button", { name: /异常税票/ }));

    expect(screen.getByText(/语气/)).toBeInTheDocument();
  });
});
