import { atom } from "jotai";
import { type CategoryId } from "@/app/[locale]/(main-layout)/loras/_components/category-tabs";
import { type LoraItem, loras } from "@/data/loras";
import { nanoid } from "nanoid";
import { configLoraStateAtom } from "./config_lora_store";

const PAGE_SIZE = 12;

interface CustomLoraState {
  items: LoraItem[];
}

const defaultCustomState = {
  items: [],
};

export const customLorasAtom = atom<CustomLoraState>(defaultCustomState);

export const currentCategoryAtom = atom<CategoryId>("style");

export const loraItemsAtom = atom((get) => {
  const currentCategory = get(currentCategoryAtom);
  const customLoras = get(customLorasAtom).items;

  if (currentCategory === "custom") {
    return customLoras;
  }
  return loras.filter((item) => item.category === currentCategory);
});

export const currentPageAtom = atom(1);

export const displayedItemsAtom = atom((get) => {
  const items = get(loraItemsAtom);
  const currentPage = get(currentPageAtom);
  return items.slice(0, currentPage * PAGE_SIZE);
});

export const hasMoreItemsAtom = atom((get) => {
  const items = get(loraItemsAtom);
  const currentPage = get(currentPageAtom);
  return currentPage * PAGE_SIZE < items.length;
});

export const loadMoreItems = atom(null, (get, set) => {
  const currentPage = get(currentPageAtom);
  set(currentPageAtom, currentPage + 1);
});

// Reset page when switching category
export const resetPage = atom(null, (get, set) => {
  set(currentPageAtom, 1);
});

// Add custom LoRA
export const addCustomLora = atom(
  null,
  (get, set, lora: Omit<LoraItem, "id" | "category">) => {
    const state = get(customLorasAtom);
    const config = get(configLoraStateAtom);

    let modelUrl = lora.url;
    // Check if the URL is a CivitAI URL
    if (lora.url.includes("civitai.com")) {
      const match = lora.url.match(/models\/(\d+)/);
      if (match) {
        const modelId = match[1];
        const apiKey = lora.civitaiKey || config.civitaiKey;
        // Construct the download URL using the CivitAI API key
        modelUrl = `https://civitai.com/api/download/models/${modelId}${
          apiKey ? `?token=${apiKey}` : ""
        }`;
      }
    }

    const newLora: LoraItem = {
      ...lora,
      url: modelUrl, // Use the potentially modified URL
      id: nanoid(),
      category: "custom",
    };
    set(customLorasAtom, {
      items: [...state.items, newLora],
    });
  }
);

// Delete custom LoRA
export const deleteCustomLora = atom(null, (get, set, id: string) => {
  const state = get(customLorasAtom);
  set(customLorasAtom, {
    items: state.items.filter((item) => item.id !== id),
  });
});

// Edit custom LoRA
export const editCustomLora = atom(
  null,
  (get, set, params: { id: string } & Omit<LoraItem, "id" | "category">) => {
    const state = get(customLorasAtom);
    const config = get(configLoraStateAtom);

    let modelUrl = params.url;
    // Check if the URL is a CivitAI URL
    if (params.url.includes("civitai.com")) {
      const match = params.url.match(/models\/(\d+)/);
      if (match) {
        const modelId = match[1];
        const apiKey = params.civitaiKey || config.civitaiKey;
        // Construct the download URL using the CivitAI API key
        modelUrl = `https://civitai.com/api/download/models/${modelId}${
          apiKey ? `?token=${apiKey}` : ""
        }`;
      }
    }

    set(customLorasAtom, {
      items: state.items.map((item) =>
        item.id === params.id
          ? {
              ...item,
              ...params,
              url: modelUrl,
            }
          : item
      ),
    });
  }
);
