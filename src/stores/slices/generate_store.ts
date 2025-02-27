import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { atom } from "jotai";
import { type LoraItem, loras } from "@/data/loras";
import type { GenerateResponse } from "@/api/generate";
import { customLorasAtom } from "./lora_store";

// Default to the first style LoRA
const defaultLora = loras.find((lora) => lora.category === "style") || loras[0];

interface GenerateState {
  selectedLoraId: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  loraScale: number;
  isGenerating: boolean;
  result: GenerateResponse | null;
}

const defaultState: GenerateState = {
  selectedLoraId: defaultLora.id,
  prompt: "",
  negativePrompt: "",
  width: 1024,
  height: 1024,
  steps: 28,
  guidance: 3.5,
  loraScale: 1.0,
  isGenerating: false,
  result: null,
};

// Persistent state
export const generateStateAtom = atomWithStorage<GenerateState>(
  "generateState",
  defaultState,
  createJSONStorage(() =>
    typeof window !== "undefined"
      ? sessionStorage
      : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        }
  ),
  { getOnInit: true }
);

// Helper function to find a LoRA by ID
const findLoraById = (
  id: string,
  customLoras: LoraItem[]
): LoraItem | undefined => {
  // First check built-in LoRAs
  const builtInLora = loras.find((l) => l.id === id);
  if (builtInLora) return builtInLora;

  // Then check custom LoRAs
  return customLoras.find((l) => l.id === id);
};

// Derived atoms
export const selectedLoraAtom = atom(
  (get) => {
    const state = get(generateStateAtom);
    const customLoras = get(customLorasAtom).items;
    return findLoraById(state.selectedLoraId, customLoras) || defaultLora;
  },
  (get, set, lora: LoraItem) => {
    const state = get(generateStateAtom);
    const newState = {
      ...state,
      selectedLoraId: lora.id,
      result: null, // Clear the result when selecting a different LoRA
    };

    // Apply LoRA's default parameters if available
    if (lora.defaultParams) {
      if (lora.defaultParams.steps) newState.steps = lora.defaultParams.steps;
      if (lora.defaultParams.guidance)
        newState.guidance = lora.defaultParams.guidance;
      if (lora.defaultParams.loraScale)
        newState.loraScale = lora.defaultParams.loraScale;
    } else {
      // Use LoRA's weight as scale if no specific defaults
      newState.loraScale = lora.weight || 0.85; // Default to 0.85 if weight is not specified
    }

    set(generateStateAtom, newState);
  }
);

export const promptAtom = atom(
  (get) => get(generateStateAtom).prompt,
  (get, set, value: string) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, prompt: value });
  }
);

export const displayPromptAtom = atom<string>("");
export const originalPromptAtom = atom<string>("");
export const autoTranslateAtom = atomWithStorage<boolean>(
  "autoTranslateState",
  false
);

export const displayNegativePromptAtom = atom<string>("");
export const originalNegativePromptAtom = atom<string>("");

export const negativePromptAtom = atom(
  (get) => get(generateStateAtom).negativePrompt,
  (get, set, value: string) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, negativePrompt: value });
  }
);

export const widthAtom = atom(
  (get) => get(generateStateAtom).width,
  (get, set, value: number) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, width: value });
  }
);

export const heightAtom = atom(
  (get) => get(generateStateAtom).height,
  (get, set, value: number) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, height: value });
  }
);

export const stepsAtom = atom(
  (get) => get(generateStateAtom).steps,
  (get, set, value: number) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, steps: value });
  }
);

export const guidanceAtom = atom(
  (get) => get(generateStateAtom).guidance,
  (get, set, value: number) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, guidance: value });
  }
);

export const loraScaleAtom = atom(
  (get) => get(generateStateAtom).loraScale,
  (get, set, value: number) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, loraScale: value });
  }
);

export const elapsedTimeAtom = atom<string>("");

// Timer state
export const startTimeAtom = atom<number | null>(null);

// Timer update function
export const updateElapsedTime = atom(null, (get, set) => {
  const startTime = get(startTimeAtom);
  if (!startTime) return;

  const elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000);
  set(elapsedTimeAtom, `${seconds}s`);
});

// Generation state
export const isGeneratingAtom = atom(
  (get) => get(generateStateAtom).isGenerating,
  (get, set, value: boolean) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, isGenerating: value });
  }
);

export const resultAtom = atom(
  (get) => get(generateStateAtom).result,
  (get, set, value: GenerateResponse | null) => {
    const state = get(generateStateAtom);
    set(generateStateAtom, { ...state, result: value });
  }
);

// Sync URL with selected LoRA
export const syncSelectedLoraWithUrl = atom(
  null,
  (get, set, loraId: string | null) => {
    if (!loraId) return;
    const customLoras = get(customLorasAtom).items;
    const lora = findLoraById(loraId, customLoras);
    if (lora) {
      const state = get(generateStateAtom);
      const newState = {
        ...state,
        selectedLoraId: lora.id,
        result: null, // Clear the result when selecting a different LoRA via URL
      };

      // Apply LoRA's default parameters if available
      if (lora.defaultParams) {
        if (lora.defaultParams.steps) newState.steps = lora.defaultParams.steps;
        if (lora.defaultParams.guidance)
          newState.guidance = lora.defaultParams.guidance;
        if (lora.defaultParams.loraScale)
          newState.loraScale = lora.defaultParams.loraScale;
      } else {
        // Use LoRA's weight as scale if no specific defaults
        newState.loraScale = lora.weight || 0.85; // Default to 0.85 if weight is not specified
      }

      set(generateStateAtom, newState);
    }
  }
);

// Reset state to default values
export const resetGenerateState = atom(null, (get, set) => {
  set(generateStateAtom, defaultState);
});

// Load parameters from history record
export const loadGenerateParams = atom(
  null,
  (
    get,
    set,
    params: {
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
    const state = get(generateStateAtom);
    set(generateStateAtom, {
      ...state,
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      width: params.parameters.width,
      height: params.parameters.height,
      steps: params.parameters.steps,
      guidance: params.parameters.guidance,
      loraScale: params.parameters.loraScale,
      selectedLoraId: params.lora.id,
    });
  }
);
