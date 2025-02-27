import ky, { HTTPError } from "ky";
import { emitter } from "@/utils/mitt";
import { store, languageAtom, appConfigAtom } from "@/stores";
import { langToCountry } from "@/utils/302";

interface TranslateParams {
  text: string;
  model?: string;
}

interface TranslateResult {
  text: string;
}

export const translate = async ({
  text,
  model = "gpt-4o",
}: TranslateParams): Promise<TranslateResult> => {
  try {
    const { apiKey } = store.get(appConfigAtom);
    const res = await ky.post("/api/trans", {
      timeout: 60000,
      json: {
        text,
        model,
        apiKey,
      },
    });
    return res.json<TranslateResult>();
  } catch (error) {
    if (error instanceof Error) {
      const uiLanguage = store.get(languageAtom);

      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();
          if (errorData.error && uiLanguage) {
            const countryCode = langToCountry(uiLanguage);
            const messageKey =
              countryCode === "en" ? "message" : `message_${countryCode}`;
            const message =
              errorData.error[messageKey] || errorData.error.message;
            emitter.emit("ToastError", {
              code: errorData.error.err_code || error.response.status,
              message,
            });
          }
        } catch {
          emitter.emit("ToastError", {
            code: error.response.status,
            message: error.message,
          });
        }
      } else {
        emitter.emit("ToastError", {
          code: 500,
          message: error.message,
        });
      }
    }
    throw error;
  }
};
