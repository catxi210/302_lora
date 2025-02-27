"use client";

import { apiKy } from "./normal";

export interface ImageSize {
  height: number;
  width: number;
}

export interface Lora {
  path?: string;
  scale?: number;
}

export interface GenerateRequest {
  guidance_scale?: number;
  image_size?: ImageSize;
  loras: Lora[];
  negative_prompt: string;
  num_inference_steps?: number;
  prompt: string;
}

export interface GenerateResponse {
  images: Array<{
    url: string;
    content_type: string;
    file_size: number;
    width: number;
    height: number;
  }>;
  seed: number;
  has_nsfw_concepts: boolean[];
  debug_latents: any;
  debug_per_pass_latents: any;
}

export const generateImage = async (
  params: GenerateRequest
): Promise<GenerateResponse> => {
  return await apiKy
    .post("302/submit/flux-lora", {
      json: params,
    })
    .json<GenerateResponse>();
};
