import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { nanoid } from "nanoid";
import type { LoraItem } from "@/data/loras";

export interface HistoryRecord {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  parameters: {
    width: number;
    height: number;
    steps: number;
    guidance: number;
    loraScale: number;
  };
  lora: {
    id: string;
    name: string;
    prompt?: string;
    imageUrl: string;
  };
}

interface HistoryState {
  records: HistoryRecord[];
}

const defaultState: HistoryState = {
  records: [],
};

// Persistent state
export const historyStateAtom = atomWithStorage<HistoryState>(
  "historyState",
  defaultState,
  undefined,
  { getOnInit: true }
);

// Add a new record
export const addHistoryRecord = atom(
  null,
  (
    get,
    set,
    params: {
      imageUrl: string;
      prompt: string;
      negativePrompt: string;
      parameters: {
        width: number;
        height: number;
        steps: number;
        guidance: number;
        loraScale: number;
      };
      lora: LoraItem;
    }
  ) => {
    const state = get(historyStateAtom);
    const newRecord: HistoryRecord = {
      id: nanoid(),
      timestamp: Date.now(),
      imageUrl: params.imageUrl,
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      parameters: params.parameters,
      lora: {
        id: params.lora.id,
        name: params.lora.name,
        prompt: params.lora.prompt,
        imageUrl: params.lora.imageUrl,
      },
    };

    set(historyStateAtom, {
      records: [newRecord, ...state.records],
    });

    return newRecord;
  }
);

// Delete a single record
export const deleteHistoryRecord = atom(null, (get, set, recordId: string) => {
  const state = get(historyStateAtom);
  set(historyStateAtom, {
    records: state.records.filter((record) => record.id !== recordId),
  });
});

// Clear all records
export const clearHistory = atom(null, (get, set) => {
  set(historyStateAtom, defaultState);
});

// Get records sorted by timestamp
export const sortedHistoryRecordsAtom = atom((get) => {
  const state = get(historyStateAtom);
  return [...state.records].sort((a, b) => b.timestamp - a.timestamp);
});
