import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LinqingPrologue } from "./LinqingPrologue";

describe("LinqingPrologue", () => {
  it("plays four Linqing background frames once", () => {
    render(<LinqingPrologue onBack={vi.fn()} onEnterChapter={vi.fn()} />);

    const frames = screen.getAllByAltText(/临清钞关疑账序章背景/);
    expect(frames).toHaveLength(4);
    expect(frames.every((frame) => frame.getAttribute("data-play-mode") === "once")).toBe(true);
    expect(frames.at(-1)).toHaveClass("prologue-frame-final");
  });

  it("reveals chapter entry after narration finishes", () => {
    vi.useFakeTimers();
    const onEnterChapter = vi.fn();
    render(<LinqingPrologue onBack={vi.fn()} onEnterChapter={onEnterChapter} revealDelayMs={900} />);

    expect(screen.queryByRole("button", { name: "进入钞关" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(900);
    });
    fireEvent.click(screen.getByRole("button", { name: "进入钞关" }));
    expect(onEnterChapter).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
