"use client";

import { env } from "@/env";
import useAuth from "@/hooks/auth";
import { usePathname, useRouter } from "@/i18n/routing";
import { appConfigAtom } from "@/stores";
import { createScopedLogger } from "@/utils";
import { isOutsideDeployMode } from "@/utils/302";
import { isAuthPath, needAuth } from "@/utils/path";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

const logger = createScopedLogger("AppAuth");

const AppAuth = () => {
  const router = useRouter();
  const { onAuth, isAuthValid } = useAuth();
  const setConfig = useSetAtom(appConfigAtom);

  const pathname = usePathname();

  useEffect(() => {
    if (isOutsideDeployMode()) {
      // Update app configuration from the store with result
      setConfig((prev) => ({ ...prev, apiKey: env.NEXT_PUBLIC_302_API_KEY! }));
      if (isAuthPath(pathname)) {
        router.replace("/");
      }
      return;
    }

    logger.debug("needAuth:", needAuth(pathname), "isAuthValid:", isAuthValid);
    // Auto auth for match router only if auth is not valid
    if (needAuth(pathname) && !isAuthValid) {
      onAuth();
    }
  }, [onAuth, router, setConfig, pathname, isAuthValid]);

  return null;
};

export default AppAuth;
