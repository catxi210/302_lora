import { createScopedLogger } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const logger = createScopedLogger("civitai:model-version");

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modelVersionId = params.id;
    const apiKey = request.headers.get("X-Civitai-API-Key");

    const url = `https://civitai.com/api/v1/model-versions/${modelVersionId}`;

    const response = await fetch(url, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Civitai API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error fetching civitai info:", error);
    return NextResponse.json(
      { error: "Failed to fetch model information" },
      { status: 500 }
    );
  }
}
