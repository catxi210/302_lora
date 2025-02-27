"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SaveIcon, RefreshCw, Download } from "lucide-react";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { format } from "date-fns";
import type { HistoryRecord } from "@/stores/slices/history_store";
import { Separator } from "@/components/ui/separator";
import { useAtom, useSetAtom } from "jotai";
import { loadGenerateParams } from "@/stores/slices/generate_store";
import { loras } from "@/data/loras";
import { useRouter } from "@/i18n/routing";
import { customLorasAtom } from "@/stores/slices/lora_store";
import { motion } from "framer-motion";

interface HistoryDetailProps {
  record: HistoryRecord;
  open: boolean;
  onClose: () => void;
  onRegenerate?: (record: HistoryRecord) => void;
}

export function HistoryDetail({
  record,
  open,
  onClose,
  onRegenerate,
}: HistoryDetailProps) {
  const t = useTranslations("history");
  const lorasT = useTranslations("loras");
  const { handleDownload } = useMonitorMessage();
  const handleLoadParams = useSetAtom(loadGenerateParams);
  const router = useRouter();
  const [customLoras] = useAtom(customLorasAtom);

  // Find the full LoRA item from both built-in and custom LoRAs
  const builtInLora = loras.find((l) => l.id === record.lora.id);
  const customLora = customLoras.items.find((l) => l.id === record.lora.id);
  const lora = builtInLora || customLora;
  if (!lora) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle>{t("details.title")}</DialogTitle>
        </DialogHeader>

        {/* Content wrapper */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 sm:flex-row sm:gap-6 sm:p-6 sm:pt-0">
          {/* Left side - Image */}
          <div className="w-full shrink-0 space-y-3 sm:w-1/2">
            <div className="group relative overflow-hidden rounded-xl bg-muted/30">
              <img
                src={record.imageUrl}
                alt={record.prompt}
                className="w-full group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-500"
              />
              <div className="absolute right-3 top-3 z-10 flex translate-y-1 gap-1.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                  }}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-background/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-background hover:shadow-xl"
                    onClick={() =>
                      handleDownload(
                        record.imageUrl,
                        `generated-${record.id}.png`
                      )
                    }
                  >
                    <SaveIcon className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right side - Info */}
          <div className="w-full space-y-4 sm:w-1/2 sm:space-y-6">
            {/* LoRA Info */}
            <div className="group space-y-4 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50 sm:p-4">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* LoRA Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
                  <img
                    src={lora.imageUrl}
                    alt={lora.name}
                    className="h-full w-full object-cover group-hover:scale-110 motion-safe:transition-transform motion-safe:duration-500"
                  />
                </div>

                {/* LoRA Details */}
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <div>
                    <h4 className="text-base font-medium sm:text-lg">
                      {lora.name}
                    </h4>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {t("details.category")}:{" "}
                      <span className="text-primary">
                        {lorasT(`categories.${lora.category}`)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-muted/50 p-2.5 text-xs sm:p-3 sm:text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {lorasT("card.trigger_words")}:
                  </span>{" "}
                  <span className="font-medium">{lora.prompt}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {lorasT("card.weight")}:
                  </span>{" "}
                  <span className="font-medium">{lora.weight || 0.85}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {lorasT("card.description")}:
                  </span>{" "}
                  <span className="font-medium">{lora.description}</span>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base font-medium sm:text-lg">
                {t("details.parameters")}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground sm:mb-1.5 sm:text-sm">
                      {t("details.prompt")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.prompt}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground sm:mb-1.5 sm:text-sm">
                      {t("details.negativePrompt")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.negativePrompt}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {t("details.width")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.parameters.width}px
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {t("details.height")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.parameters.height}px
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {t("details.steps")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.parameters.steps}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {t("details.guidance")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.parameters.guidance}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {t("details.loraScale")}
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {record.parameters.loraScale}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex justify-end gap-2 border-t bg-muted/50 px-4 py-3 sm:px-6 sm:py-4">
          <Button
            variant="outline"
            size="sm"
            className="sm:text-sm"
            onClick={() => {
              handleLoadParams({
                prompt: record.prompt,
                negativePrompt: record.negativePrompt,
                parameters: record.parameters,
                lora,
              });
              router.push("/generate");
              onClose();
            }}
          >
            <Download className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            {t("details.loadParams")}
          </Button>
          {onRegenerate && (
            <Button
              size="sm"
              className="sm:text-sm"
              onClick={() => onRegenerate(record)}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              {t("details.regenerate")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
