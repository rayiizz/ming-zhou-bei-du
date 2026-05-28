import { eventCatalog } from "./events";
import type { LinqingChapterSnapshot } from "./linqingChapter";
import type { EventId, InvestigationState } from "./types";

const SAVE_GAME_KEY = "ming-zhou-bei-du/save-slot";

export interface SaveGameSlot {
  version: 1;
  savedAt: string;
  eventId: EventId;
  eventTitle: string;
  viewLabel: string;
  investigationState: InvestigationState;
  linqingState?: LinqingChapterSnapshot;
}

interface SaveGameStore {
  version: 2;
  slots: Partial<Record<EventId, SaveGameSlot>>;
}

interface CreateSaveGameSlotInput {
  investigationState: InvestigationState;
  linqingState?: LinqingChapterSnapshot;
  now?: Date;
}

const viewLabels: Record<InvestigationState["view"], string> = {
  home: "主页",
  tutorial: "教程",
  prologue: "序章",
  "linqing-prologue": "序章",
  archive: "案卷馆",
  story: "问询中",
  summary: "总结"
};

function getEventTitle(state: InvestigationState) {
  return eventCatalog.find((event) => event.id === state.selectedEventId)?.title ?? "明舟北渡";
}

function getEventId(state: InvestigationState): EventId {
  return state.selectedEventId ?? "yongle-shipwreck";
}

function isSaveGameSlot(value: unknown): value is SaveGameSlot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const slot = value as Partial<SaveGameSlot>;
  return slot.version === 1 && typeof slot.savedAt === "string" && !!slot.investigationState;
}

function isSaveGameStore(value: unknown): value is SaveGameStore {
  if (!value || typeof value !== "object") {
    return false;
  }

  const store = value as Partial<SaveGameStore>;
  return store.version === 2 && !!store.slots && typeof store.slots === "object";
}

function normalizeSlot(slot: SaveGameSlot): SaveGameSlot {
  return {
    ...slot,
    eventId: slot.eventId ?? getEventId(slot.investigationState)
  };
}

function loadSaveGameStore(): SaveGameStore {
  const rawSlot = localStorage.getItem(SAVE_GAME_KEY);
  if (!rawSlot) {
    return { version: 2, slots: {} };
  }

  try {
    const parsed = JSON.parse(rawSlot);
    if (isSaveGameStore(parsed)) {
      return parsed;
    }

    if (isSaveGameSlot(parsed)) {
      const slot = normalizeSlot(parsed);
      return { version: 2, slots: { [slot.eventId]: slot } };
    }
  } catch {
    return { version: 2, slots: {} };
  }

  return { version: 2, slots: {} };
}

function saveGameStore(store: SaveGameStore) {
  localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(store));
}

export function createSaveGameSlot({ investigationState, linqingState, now = new Date() }: CreateSaveGameSlotInput): SaveGameSlot {
  return {
    version: 1,
    savedAt: now.toISOString(),
    eventId: getEventId(investigationState),
    eventTitle: getEventTitle(investigationState),
    viewLabel: viewLabels[investigationState.view],
    investigationState,
    linqingState
  };
}

export function saveGameSlot(slot: SaveGameSlot) {
  const store = loadSaveGameStore();
  const normalizedSlot = normalizeSlot(slot);
  saveGameStore({
    ...store,
    slots: {
      ...store.slots,
      [normalizedSlot.eventId]: normalizedSlot
    }
  });
}

export function loadSaveGameSlots(): SaveGameSlot[] {
  return Object.values(loadSaveGameStore().slots)
    .filter((slot): slot is SaveGameSlot => !!slot)
    .map(normalizeSlot)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function loadSaveGameSlot(eventId?: EventId): SaveGameSlot | undefined {
  const slots = loadSaveGameSlots();
  if (eventId) {
    return slots.find((slot) => slot.eventId === eventId);
  }

  return slots[0];
}

export function clearSaveGameSlot(eventId?: EventId) {
  if (!eventId) {
    localStorage.removeItem(SAVE_GAME_KEY);
    return;
  }

  const store = loadSaveGameStore();
  const nextSlots = { ...store.slots };
  delete nextSlots[eventId];
  saveGameStore({ ...store, slots: nextSlots });
}
