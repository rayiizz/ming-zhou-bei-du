import { useEffect, useMemo, useRef, useState } from "react";
import { DialogueScene } from "./components/DialogueScene";
import { EventArchive } from "./components/EventArchive";
import { EventHome } from "./components/EventHome";
import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { GameTutorial } from "./components/GameTutorial";
import { JourneySummary } from "./components/JourneySummary";
import { LinqingChapter } from "./components/LinqingChapter";
import { LinqingPrologue } from "./components/LinqingPrologue";
import { StoryPrologue } from "./components/StoryPrologue";
import { assetPath } from "./assetPath";
import { eventCatalog, playableEventId } from "./game/events";
import { createInvestigationState, enterEventArchive, enterStory } from "./game/investigation";
import { createLinqingChapterSnapshot, type LinqingChapterSnapshot } from "./game/linqingChapter";
import { clearSaveGameSlot, createSaveGameSlot, loadSaveGameSlot, loadSaveGameSlots, saveGameSlot, type SaveGameSlot } from "./game/saveGame";
import type { EventId } from "./game/types";

const audioTracks = {
  theme: assetPath("assets/audio/mingzhou-theme.mp3"),
  investigation: assetPath("assets/audio/fog-canal-investigation.mp3"),
  ending: assetPath("assets/audio/ending-river-clear.mp3")
};

export default function App() {
  const [gameState, setGameState] = useState(createInvestigationState);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [saveSlots, setSaveSlots] = useState<SaveGameSlot[]>(() => loadSaveGameSlots());
  const [linqingSnapshot, setLinqingSnapshot] = useState<LinqingChapterSnapshot | undefined>(
    () => loadSaveGameSlot("linqing-customs")?.linqingState
  );
  const [saveNotice, setSaveNotice] = useState("");
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const selectedEvent = useMemo(
    () => eventCatalog.find((event) => event.id === gameState.selectedEventId),
    [gameState.selectedEventId]
  );
  const activeAudioSrc =
    gameState.view === "story"
      ? audioTracks.investigation
      : gameState.view === "summary"
        ? audioTracks.ending
        : audioTracks.theme;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0.28;
    if (musicPlaying) {
      void audio.play().catch(() => setMusicPlaying(false));
    }
  }, [activeAudioSrc, musicPlaying]);

  function handleSelectEvent(eventId: EventId) {
    if (eventId === playableEventId) {
      setGameState((state) => ({ ...state, view: "prologue", selectedEventId: eventId }));
      setArchiveOpen(false);
      return;
    }

    if (eventId === "linqing-customs") {
      setGameState((state) => ({ ...state, view: "linqing-prologue", selectedEventId: eventId }));
      setArchiveOpen(false);
      return;
    }

    setGameState((state) => enterEventArchive(state, eventId));
  }

  function handleEnterStory() {
    setGameState((state) => enterStory(state));
  }

  function handleOpenTutorial() {
    setGameState((state) => ({ ...state, view: "tutorial" }));
    setArchiveOpen(false);
  }

  function handleTutorialStart() {
    setGameState((state) => enterEventArchive(state, playableEventId));
  }

  function handleEnterArchiveFromPrologue() {
    setGameState((state) => enterEventArchive(state, playableEventId));
  }

  function handleEnterLinqingChapter() {
    setGameState((state) => ({ ...state, view: "story", selectedEventId: "linqing-customs" }));
  }

  function restart() {
    setGameState(createInvestigationState());
    setArchiveOpen(false);
    setRestartConfirmOpen(false);
  }

  function handleSaveProgress() {
    const nextSlot = createSaveGameSlot({
      investigationState: gameState,
      linqingState:
        gameState.selectedEventId === "linqing-customs" ? (linqingSnapshot ?? createLinqingChapterSnapshot()) : undefined
    });
    saveGameSlot(nextSlot);
    setSaveSlots(loadSaveGameSlots());
    setSaveNotice("进度已存入案卷书签");
  }

  function requestRestart() {
    if (saveSlots.length > 0) {
      setRestartConfirmOpen(true);
      return;
    }

    restart();
  }

  function handleLoadSave(eventId: EventId) {
    const nextSlot = loadSaveGameSlot(eventId);
    if (!nextSlot) {
      setSaveSlots(loadSaveGameSlots());
      return;
    }

    setSaveSlots(loadSaveGameSlots());
    setLinqingSnapshot(nextSlot.linqingState);
    setGameState(nextSlot.investigationState);
    setArchiveOpen(false);
  }

  function handleClearSave(eventId: EventId) {
    clearSaveGameSlot(eventId);
    setSaveSlots(loadSaveGameSlots());
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    audio.volume = 0.28;
    void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
  }

  return (
    <main className="game-shell">
      <header className="top-bar">
        <div className="brand-block">
          <span className="brand-kicker">明代大运河案卷</span>
          <div className="brand-title">明舟北渡</div>
        </div>
        <div className="top-actions">
          <button
            className={musicPlaying ? "music-toggle music-toggle-active" : "music-toggle"}
            onClick={toggleMusic}
            aria-label={musicPlaying ? "关闭背景音乐" : "开启背景音乐"}
            title={musicPlaying ? "关闭背景音乐" : "开启背景音乐"}
          >
            {musicPlaying ? "静" : "乐"}
          </button>
          <button onClick={handleSaveProgress} aria-label="保存进度" title="保存进度">
            存
          </button>
          <button onClick={() => setArchiveOpen(true)} aria-label="打开图鉴" title="打开图鉴">
            录
          </button>
          <button onClick={requestRestart} aria-label="重新开始" title="重新开始">
            ↺
          </button>
        </div>
      </header>

      {saveNotice && (
        <div className="save-toast" role="status" aria-live="polite">
          {saveNotice}
        </div>
      )}

      {gameState.view === "home" && (
        <EventHome
          events={eventCatalog}
          onSelectEvent={handleSelectEvent}
          onOpenTutorial={handleOpenTutorial}
          saveSlots={saveSlots}
          onLoadSave={handleLoadSave}
          onClearSave={handleClearSave}
        />
      )}
      {gameState.view === "tutorial" && <GameTutorial onBack={restart} onStart={handleTutorialStart} />}
      {gameState.view === "prologue" && (
        <StoryPrologue onBack={restart} onEnterArchive={handleEnterArchiveFromPrologue} />
      )}
      {gameState.view === "linqing-prologue" && (
        <LinqingPrologue onBack={restart} onEnterChapter={handleEnterLinqingChapter} />
      )}
      {gameState.view === "archive" && selectedEvent && (
        <EventArchive event={selectedEvent} onBack={restart} onEnterStory={handleEnterStory} />
      )}
      {gameState.view === "story" && gameState.selectedEventId === "linqing-customs" && (
        <LinqingChapter
          onBackHome={restart}
          initialSnapshot={linqingSnapshot}
          onSnapshotChange={setLinqingSnapshot}
        />
      )}
      {gameState.view === "story" && gameState.selectedEventId !== "linqing-customs" && (
        <DialogueScene state={gameState} setState={setGameState} onOpenArchive={() => setArchiveOpen(true)} />
      )}
      {gameState.view === "summary" && <JourneySummary state={gameState} onRestart={restart} />}

      {restartConfirmOpen && (
        <div className="modal-scrim" role="presentation">
          <section className="restart-dialog" role="dialog" aria-label="重新开始确认" aria-modal="true">
            <span>重开案卷</span>
            <strong>确认返回主页？</strong>
            <p>当前本地存档会保留，但未保存的新进度会回到主页。</p>
            <div>
              <button className="secondary-action" onClick={() => setRestartConfirmOpen(false)}>
                继续调查
              </button>
              <button className="primary-action" onClick={restart}>
                确认重开
              </button>
            </div>
          </section>
        </div>
      )}

      <audio ref={audioRef} src={activeAudioSrc} loop preload="auto" aria-label="背景音乐" />
      <EvidenceDrawer open={archiveOpen} state={gameState} onClose={() => setArchiveOpen(false)} />
    </main>
  );
}
