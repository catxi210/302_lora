"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { type CategoryId } from "./_components/category-tabs";
import { LoraGrid } from "./_components/lora-grid";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { type LoraItem } from "@/data/loras";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentCategoryAtom,
  displayedItemsAtom,
  hasMoreItemsAtom,
  loadMoreItems,
  resetPage,
  customLorasAtom,
} from "@/stores/slices/lora_store";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddLoraDialog } from "./_components/add-lora-dialog";
import { useConfig } from "@/hooks/use-remote-config";
import { useToast } from "@/hooks/global/use-toast";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("loras");

export default function LorasPage() {
  const t = useTranslations("loras");
  const searchParams = useSearchParams();
  // Get current category from URL and sync with atom
  const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
  const router = useRouter();
  const categoryFromUrl =
    (searchParams.get("category") as CategoryId) || "style";
  const highlightId = searchParams.get("highlight");
  const handleResetPage = useSetAtom(resetPage);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingLora, setEditingLora] = React.useState<LoraItem | undefined>();
  const [highlightedLora, setHighlightedLora] = React.useState<string | null>(
    highlightId
  );
  const [customLoras, setCustomLoras] = useAtom(customLorasAtom);
  const { fetchConfig, isReady } = useConfig();
  const { toast } = useToast();
  const [isLoadingRemoteConfig, setIsLoadingRemoteConfig] =
    React.useState(false);

  // Get items from store
  const displayedItems = useAtomValue(displayedItemsAtom);
  const hasMore = useAtomValue(hasMoreItemsAtom);
  const handleLoadMore = useSetAtom(loadMoreItems);

  // Reference to the highlighted LoRA element
  const highlightedLoraRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (categoryFromUrl !== currentCategory) {
      setCurrentCategory(categoryFromUrl);
      handleResetPage();
    }

    // Reset highlighted LoRA when URL changes
    setHighlightedLora(highlightId);
  }, [
    categoryFromUrl,
    currentCategory,
    setCurrentCategory,
    handleResetPage,
    highlightId,
  ]);

  React.useEffect(() => {
    const fetchRemoteConfig = async () => {
      if (!isReady) return;

      try {
        setIsLoadingRemoteConfig(true);
        const configData = await fetchConfig();

        if (configData.config && configData.config.customLoras) {
          logger.info(
            "Received remote custom LoRAs:",
            configData.config.customLoras
          );

          const remoteItems = configData.config.customLoras.items || [];

          setCustomLoras({
            items: remoteItems,
          });

          logger.info("Using remote custom LoRAs:", remoteItems);
        }
      } catch (error) {
        logger.error("Failed to fetch remote custom LoRAs:", error);
        toast({
          title: t("fetchRemoteError"),
          description: t("fetchRemoteErrorDescription"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingRemoteConfig(false);
      }
    };

    fetchRemoteConfig();
  }, [fetchConfig, isReady, setCustomLoras, t]);

  // Scroll to highlighted LoRA when it becomes visible
  React.useEffect(() => {
    if (highlightedLora && highlightedLoraRef.current) {
      // Scroll the highlighted LoRA into view with smooth behavior
      setTimeout(() => {
        highlightedLoraRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Remove highlight after 3 seconds
        const timer = setTimeout(() => {
          setHighlightedLora(null);
        }, 3000);

        return () => clearTimeout(timer);
      }, 300);
    }
  }, [highlightedLora, displayedItems]);

  const handleLoraClick = React.useCallback(
    (item: LoraItem) => {
      logger.info("Selected Lora:", item.name, "Prompt:", item.prompt);
      router.push(`/generate?lora=${item.id}`);
    },
    [router]
  );

  const handleLoraEdit = React.useCallback((item: LoraItem) => {
    setEditingLora(item);
    setShowAddDialog(true);
  }, []);

  const handleDialogClose = React.useCallback(() => {
    setShowAddDialog(false);
    setEditingLora(undefined);
  }, []);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col",
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

      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto h-full max-w-[1800px] space-y-6">
          {/* Custom category header */}
          {currentCategory === "custom" && (
            <div className="flex items-center justify-between gap-4">
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.addLora")}
              </Button>
            </div>
          )}

          <LoraGrid
            items={displayedItems}
            onItemClick={handleLoraClick}
            onItemEdit={handleLoraEdit}
            isLoading={isLoadingRemoteConfig}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            highlightedLoraId={highlightedLora}
            loraRef={highlightedLoraRef}
            className={cn(
              "min-h-[200px]",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8"
            )}
          />
        </div>
      </main>

      {/* Add/Edit LoRA dialog */}
      <AddLoraDialog
        open={showAddDialog}
        onClose={handleDialogClose}
        editingLora={editingLora}
      />
    </div>
  );
}
