import { APICallError, generateText } from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import prompts from "@/constants/prompts-trans";
import { env } from "@/env";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("translation");

export async function POST(request: Request) {
  try {
    const {
      text,
      model,
      apiKey,
    }: {
      text: string;
      model: string;
      apiKey: string;
    } = await request.json();

    const ai302 = createAI302({
      apiKey: apiKey,
    });

    const { text: translatedText } = await generateText({
      model: ai302.chatModel(model),
      prompt: prompts.translateToEnglish.compile({ input: text }),
    });

    return Response.json({ text: translatedText });
  } catch (error) {
    logger.error(error);
    if (error instanceof APICallError) {
      const resp = error.responseBody;

      return Response.json(resp, { status: 500 });
    }
    // Handle different types of errors
    let errorMessage = "Failed to translate text";
    let errorCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // You can add specific error code mapping here if needed
      if ("code" in error && typeof (error as any).code === "number") {
        errorCode = (error as any).code;
      }
    }

    return Response.json(
      {
        error: {
          err_code: errorCode,
          message: errorMessage,
          message_cn: "翻译失败",
          message_en: "Failed to translate text",
          message_ja: "翻訳に失敗しました",
          type: "TRANSLATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
