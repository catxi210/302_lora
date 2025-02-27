import { atom } from "jotai";
import {
  trainService,
  type TrainingParams,
  type TrainingResult,
} from "@/services/train";

interface TrainingState {
  requestId: string | null;
  status: "idle" | "uploading" | "training" | "success" | "error";
  error: string | null;
  result: TrainingResult | null;
  isCompleted: boolean;
}

export const trainingStateAtom = atom<TrainingState>({
  requestId: null,
  status: "idle",
  error: null,
  result: null,
  isCompleted: false,
});

export const submitTraining = atom(
  null,
  async (get, set, params: TrainingParams) => {
    set(trainingStateAtom, {
      requestId: null,
      status: "training",
      error: null,
      result: null,
      isCompleted: false,
    });

    try {
      const data = await trainService.submitTraining(params);
      set(trainingStateAtom, {
        requestId: data.request_id,
        status: "training",
        error: null,
        result: null,
        isCompleted: false,
      });

      return data.request_id;
    } catch (error) {
      set(trainingStateAtom, {
        requestId: null,
        status: "error",
        error:
          error instanceof Error ? error.message : "Training request failed",
        result: null,
        isCompleted: false,
      });
      throw error;
    }
  }
);

export const checkTrainingStatus = atom(null, async (get, set) => {
  const state = get(trainingStateAtom);
  if (!state.requestId || state.isCompleted) return state.result;

  try {
    const data = await trainService.checkTrainingStatus(state.requestId);

    if (trainService.isTrainingProgress(data)) {
      return false;
    }

    if (trainService.isTrainingResult(data)) {
      const result = data as TrainingResult;
      set(trainingStateAtom, {
        requestId: null,
        status: "success",
        error: null,
        result,
        isCompleted: true,
      });
      return result;
    }

    // Must be an error
    const errorMsg = Array.isArray(data.detail)
      ? data.detail[0]?.msg
      : data.detail;
    throw new Error(errorMsg || "Training failed");
  } catch (error) {
    set(trainingStateAtom, {
      requestId: state.requestId,
      status: "error",
      error:
        error instanceof Error ? error.message : "Training status check failed",
      result: null,
      isCompleted: true,
    });
    throw error;
  }
});

export const resetTrainingState = atom(null, (get, set) => {
  set(trainingStateAtom, {
    requestId: null,
    status: "idle",
    error: null,
    result: null,
    isCompleted: false,
  });
});
