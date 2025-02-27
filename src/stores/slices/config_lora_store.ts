import { atomWithStorage } from "jotai/utils";

interface ConfigLoraState {
  civitaiKey: string;
}

const defaultState: ConfigLoraState = {
  civitaiKey: "",
};

export const configLoraStateAtom = atomWithStorage<ConfigLoraState>(
  "configLoraState",
  defaultState
);
