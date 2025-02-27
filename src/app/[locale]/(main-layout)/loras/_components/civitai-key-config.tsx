"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { configLoraStateAtom } from "@/stores/slices/config_lora_store";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CivitaiKeyConfig() {
  const t = useTranslations("loras");
  const [config, setConfig] = useAtom(configLoraStateAtom);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="password"
          value={config.civitaiKey}
          onChange={(e) => setConfig({ civitaiKey: e.target.value })}
          placeholder={t("config.civitaiKeyPlaceholder")}
          className="pr-8"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircledIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("config.civitaiKeyTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
