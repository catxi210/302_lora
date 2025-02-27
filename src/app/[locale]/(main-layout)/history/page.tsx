"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import {
  sortedHistoryRecordsAtom,
  clearHistory,
  deleteHistoryRecord,
  type HistoryRecord,
} from "@/stores/slices/history_store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ImageIcon,
  InfoIcon,
  Loader2,
  Maximize2Icon,
  RotateCcw,
  SaveIcon,
  Trash2,
} from "lucide-react";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { format } from "date-fns";
import { HistoryDetail } from "./_components/history-detail";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const t = useTranslations("history");
  const [records] = useAtom(sortedHistoryRecordsAtom);
  const handleClearHistory = useSetAtom(clearHistory);
  const handleDeleteRecord = useSetAtom(deleteHistoryRecord);
  const { handleDownload } = useMonitorMessage();
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(
    null
  );
  const [selectedRecord, setSelectedRecord] =
    React.useState<HistoryRecord | null>(null);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-1 flex-col overflow-auto",
        "bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background",
        "relative isolate"
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/10 to-primary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[1800px]">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearHistory}
              disabled={records.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.clearAll")}
            </Button>
          </div>

          {/* Records grid */}
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-card p-8 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">{t("noRecords")}</p>
            </div>
          ) : (
            <div className="@container">
              <div
                className={cn(
                  "columns-1 gap-6",
                  "@[600px]:columns-2",
                  "@[900px]:columns-3",
                  "@[1200px]:columns-4"
                )}
              >
                {records.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 break-inside-avoid"
                  >
                    <Card
                      className={cn(
                        "group/card overflow-hidden",
                        "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300",
                        "hover:scale-[1.02] hover:border-primary hover:shadow-lg",
                        "active:scale-[0.98]"
                      )}
                    >
                      {/* Image preview */}
                      <div className="relative w-full overflow-hidden">
                        <motion.img
                          src={record.imageUrl}
                          alt={record.prompt}
                          className={cn(
                            "w-full",
                            "motion-safe:transition-all motion-safe:duration-500",
                            "scale-100 group-hover/card:scale-110"
                          )}
                        />
                        <div className="absolute right-3 top-3 z-10 flex translate-y-1 gap-1.5 opacity-0 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
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
                                setSelectedImageUrl(record.imageUrl)
                              }
                            >
                              <Maximize2Icon className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
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
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              <span className="sr-only">
                                {t("actions.delete")}
                              </span>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
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
                              onClick={() => setSelectedRecord(record)}
                            >
                              <span className="sr-only">
                                {t("actions.details")}
                              </span>
                              <InfoIcon className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      {/* Info */}
                      <motion.div
                        className={cn(
                          "space-y-2 p-4",
                          "motion-safe:transition-[transform,opacity] motion-safe:duration-300",
                          "group-hover/card:scale-[0.98] group-hover/card:opacity-90"
                        )}
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="h-8 w-8 rounded-lg bg-cover bg-center bg-no-repeat"
                            style={{
                              backgroundImage: `url(${record.lora.imageUrl})`,
                            }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {record.lora.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(record.timestamp, "yyyy-MM-dd HH:mm:ss")}
                            </p>
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {record.prompt}
                        </p>
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Details Dialog */}
      {selectedRecord && (
        <HistoryDetail
          record={selectedRecord}
          open={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Lightbox */}
      {selectedImageUrl && (
        <LightGallery
          onInit={(ref) => {
            ref?.instance?.openGallery?.(0);
          }}
          onBeforeClose={() => {
            setSelectedImageUrl(null);
          }}
          plugins={[lgZoom, lgThumbnail]}
          speed={500}
          elementClassNames="hidden"
        >
          <a href={selectedImageUrl} data-src={selectedImageUrl}>
            <img src={selectedImageUrl} alt="Generated" className="hidden" />
          </a>
        </LightGallery>
      )}
    </div>
  );
}
