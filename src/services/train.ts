import { apiKy } from "@/api/normal";

export interface TrainingParams {
  name: string;
  description: string;
  images_data_url: string;
  trigger_word?: string;
  is_style?: boolean;
  create_masks?: boolean;
  steps?: number;
}

export interface TrainingResponse {
  logs: null;
  metrics: Record<string, any>;
  queue_position: number;
  request_id: string;
  status: string;
}

export interface TrainingResult {
  diffusers_lora_file: {
    url: string;
    content_type: string;
    file_size: number;
  };
  config_file: {
    url: string;
    content_type: string;
    file_size: number;
  };
  debug_preprocessed_output: null;
}

export interface TrainingError {
  detail: string | { msg: string }[];
}

export interface TrainingProgress {
  detail: "Request is still in progress";
  request_id: string;
}

export type TrainingStatusResponse =
  | TrainingResult
  | TrainingError
  | TrainingProgress;

export const trainService = {
  async submitTraining(params: TrainingParams) {
    return apiKy
      .post("302/submit/flux-lora-training", {
        json: params,
      })
      .json<TrainingResponse>();
  },

  async checkTrainingStatus(requestId: string) {
    return apiKy
      .get(`302/submit/flux-lora-training?request_id=${requestId}`)
      .json<TrainingStatusResponse>();
  },

  isTrainingProgress(
    response: TrainingStatusResponse
  ): response is TrainingProgress {
    return (
      "detail" in response && response.detail === "Request is still in progress"
    );
  },

  isTrainingResult(
    response: TrainingStatusResponse
  ): response is TrainingResult {
    return "diffusers_lora_file" in response;
  },

  isTrainingError(response: TrainingStatusResponse): response is TrainingError {
    return (
      "detail" in response && response.detail !== "Request is still in progress"
    );
  },
};
