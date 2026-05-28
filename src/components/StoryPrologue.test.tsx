import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StoryPrologue } from "./StoryPrologue";

describe("StoryPrologue", () => {
  it("plays the background sequence once and holds the final frame", () => {
    render(<StoryPrologue onBack={vi.fn()} onEnterArchive={vi.fn()} />);

    const frames = screen.getAllByAltText(/沉船案序章背景/);
    expect(frames).toHaveLength(4);
    expect(frames.every((frame) => frame.getAttribute("data-play-mode") === "once")).toBe(true);
    expect(frames.at(-1)).toHaveClass("prologue-frame-final");
  });

  it("reveals archive entry only after the narration finishes", () => {
    vi.useFakeTimers();
    const onEnterArchive = vi.fn();
    render(<StoryPrologue onBack={vi.fn()} onEnterArchive={onEnterArchive} revealDelayMs={1200} />);

    expect(screen.queryByRole("button", { name: "进入案卷馆" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1199);
    });
    expect(screen.queryByRole("button", { name: "进入案卷馆" })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    fireEvent.click(screen.getByRole("button", { name: "进入案卷馆" }));
    expect(onEnterArchive).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
