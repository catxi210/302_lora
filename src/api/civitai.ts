import { createScopedLogger } from "@/utils";
import ky from "ky";

const logger = createScopedLogger("civitai");

export interface CivitaiModelVersionResponse {
  id: number;
  name: string;
  description: string;
  images?: {
    url: string;
    nsfw: string;
    width: number;
    height: number;
    hash: string;
  }[];
  files: {
    name: string;
    sizeKB: number;
    type: string;
    metadata: {
      fp: string;
      size: string;
      format: string;
    };
  }[];
}

export const getCivitaiModelInfo = async (
  modelVersionId: string,
  apiKey?: string
): Promise<CivitaiModelVersionResponse> => {
  try {
    const response = await ky
      .get(`/api/civitai/model-version/${modelVersionId}`, {
        headers: apiKey ? { "X-Civitai-API-Key": apiKey } : undefined,
      })
      .json<CivitaiModelVersionResponse>();
    return response;
  } catch (error) {
    logger.error("Error fetching Civitai model info:", error);
    throw new Error("Failed to fetch model info.");
  }
};
