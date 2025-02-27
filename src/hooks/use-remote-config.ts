import { useCallback } from "react";
import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores";
import { getConfig, updateConfig } from "@/services/remote-config";
import { env } from "@/env";

export const useConfig = () => {
  const [appConfig] = useAtom(appConfigAtom);
  const dynamicHostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const hostname = env.NEXT_PUBLIC_DEV_HOST_NAME || dynamicHostname;
  // const hostname = "y6ez-translate";

  const fetchConfig = useCallback(async () => {
    if (!hostname || !appConfig?.apiKey) {
      throw new Error("Missing required parameters: hostname or apiKey");
    }

    return getConfig(hostname, appConfig.apiKey);
  }, [hostname, appConfig?.apiKey]);

  const updateConfigValues = useCallback(
    async (values: Record<string, any>, currentVersion: string) => {
      if (!hostname || !appConfig?.apiKey) {
        throw new Error("Missing required parameters: hostname or apiKey");
      }

      return updateConfig(hostname, appConfig.apiKey, values, currentVersion);
    },
    [hostname, appConfig?.apiKey]
  );

  return {
    fetchConfig,
    updateConfigValues,
    isReady: Boolean(hostname && appConfig?.apiKey),
  };
};
