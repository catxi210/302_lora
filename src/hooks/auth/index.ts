"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SignInFormType, SignInSchema } from "@/components/forms/auth/schema";
import {
  CHINA_REGION,
  FALSE_STRING,
  SHARE_CODE_REMEMBER_KEY,
  SHARE_CODE_STORE_KEY,
  SHARE_CODE_URL_PARAM,
  TRUE_STRING,
} from "@/constants";
import { env } from "@/env";
import { useRouter } from "@/i18n/routing";
import { login } from "@/services/auth";
import { store } from "@/stores";
import { appConfigAtom } from "@/stores/slices/config_store";
import { authStateAtom } from "@/stores/slices/auth_store";
import { logger } from "@/utils";
import { isAuthPath, removeParams } from "@/utils/path";
import { useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

const useAuth = () => {
  const [isPending, setIsPending] = useState(false);
  const params = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const setConfig = useSetAtom(appConfigAtom);
  const [authState, setAuthState] = useAtom(authStateAtom);

  const isAuthValid = useMemo(() => {
    if (!authState.isAuthenticated || !authState.lastAuthTime) {
      return false;
    }
    const timeSinceLastAuth = Date.now() - authState.lastAuthTime;
    return timeSinceLastAuth < authState.expirationTime;
  }, [authState]);

  // Initialize form handling with react-hook-form and Zod resolver
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignInFormType>({
    defaultValues: {
      code: "", // Default code to empty string
      remember: true, // Default remember to true
    },
    resolver: zodResolver(SignInSchema),
  });

  // Retrieve values from query param or local storage only when params change
  useEffect(() => {
    const queryCode = params.get(SHARE_CODE_URL_PARAM) || "";
    const sessionCode = store.get(appConfigAtom)?.shareCode || "";
    const storedCode = localStorage.getItem(SHARE_CODE_STORE_KEY) || "";
    const storeRemember = localStorage.getItem(SHARE_CODE_REMEMBER_KEY) || "";

    // Reset remember
    if (storeRemember === FALSE_STRING) {
      setValue("remember", false);
    }

    // Reset code
    if (queryCode || sessionCode || storedCode) {
      setValue("code", queryCode || sessionCode || storedCode);
    }
  }, [params, setValue]);

  // Function to handle authentication
  const performAuth = useCallback(
    async ({ code, remember }: SignInFormType) => {
      try {
        setIsPending(true);

        // If auth is still valid, skip the API call
        if (isAuthValid) {
          logger.debug("Using cached auth state");
          return;
        }

        // Call login function to validate the code
        const result = await login(code);

        logger.debug("Login result:", result);

        // Update app configuration from the store with result
        setConfig((prev) => ({
          ...prev,
          apiKey: result.data?.apiKey,
          modelName: result.data?.modelName,
          isChina: result.data?.region === CHINA_REGION,
          toolInfo: result.data?.info,
          shareCode: result.data?.code,
          hideBrand: result.data?.hideBrand,
        }));

        // Update auth state
        setAuthState({
          isAuthenticated: true,
          lastAuthTime: Date.now(),
          expirationTime: authState.expirationTime,
        });

        // Store or remove auth code based on remember flag
        if (remember) {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, TRUE_STRING);
          localStorage.setItem(SHARE_CODE_STORE_KEY, code);
        } else {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, FALSE_STRING);
          sessionStorage.setItem(SHARE_CODE_STORE_KEY, code);
          localStorage.setItem(SHARE_CODE_STORE_KEY, "");
        }

        // Redirect to the home page if on auth page
        if (isAuthPath(pathname)) {
          replace("/");
        } else {
          removeParams(pathname);
        }
      } catch (error: unknown) {
        // Reset auth state on error
        setAuthState({
          isAuthenticated: false,
          lastAuthTime: null,
          expirationTime: authState.expirationTime,
        });

        // Handle error by navigating to auth and setting error state
        replace(env.NEXT_PUBLIC_AUTH_PATH);
        if (error instanceof Error) {
          setError("code", {
            type: "server",
            message: t(error.message),
          });
        }
      } finally {
        setIsPending(false);
      }
    },
    [
      t,
      setError,
      pathname,
      replace,
      setConfig,
      authState,
      setAuthState,
      isAuthValid,
    ]
  );

  // Callback for form submission
  const onSubmit = useCallback(
    async (data: SignInFormType) => {
      await performAuth(data);
    },
    [performAuth]
  );

  const onAuth = useCallback(() => {
    // If auth is still valid, no need to resubmit
    if (isAuthValid) {
      logger.debug("Using cached auth state, skipping auth check");
      return;
    }
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit, isAuthValid]);

  return {
    isPending,
    setValue,
    onAuth,
    watch,
    register,
    errors,
    isAuthValid,
  };
};

export default useAuth;
