"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/global/use-copy-to-clipboard";
import { useToast } from "@/hooks/global/use-toast";
import { type LoraItem } from "@/data/loras";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentCategoryAtom,
  deleteCustomLora,
  customLorasAtom,
} from "@/stores/slices/lora_store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Trash2, Edit, Maximize2 } from "lucide-react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { useConfig } from "@/hooks/use-remote-config";
import { createScopedLogger } from "@/utils";

const logger = createScopedLogger("LoraCard");

interface LoraCardProps {
  item: LoraItem;
  onClick?: (item: LoraItem) => void;
  onEdit?: (item: LoraItem) => void;
  className?: string;
  isHighlighted?: boolean;
}

// Convert to forwardRef to allow ref passing
export const LoraCard = React.forwardRef<HTMLDivElement, LoraCardProps>(
  ({ item, onClick, onEdit, className, isHighlighted }, ref) => {
    const t = useTranslations("loras");
    const { toast } = useToast();
    const currentCategory = useAtomValue(currentCategoryAtom);
    const handleDeleteLora = useSetAtom(deleteCustomLora);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = React.useState<
      string | null
    >(null);
    const customLoras = useAtomValue(customLorasAtom);
    const { fetchConfig, updateConfigValues, isReady } = useConfig();
    const [isSyncing, setIsSyncing] = React.useState(false);

    // Move useCopyToClipboard to component level
    const { handleCopy } = useCopyToClipboard({
      text: item.prompt || "",
      copyMessage: t("card.copy_success"),
    });

    const handleDelete = React.useCallback(async () => {
      handleDeleteLora(item.id);
      toast({
        description: t("card.delete_success"),
      });
      setShowDeleteDialog(false);

      if (isReady) {
        try {
          setIsSyncing(true);
          toast({
            title: t("addDialog.syncing"),
            description: t("addDialog.syncingDescription"),
          });

          const configData = await fetchConfig();

          const updatedItems = customLoras.items.filter(
            (lora) => lora.id !== item.id
          );

          await updateConfigValues(
            { customLoras: { items: updatedItems } },
            configData.version
          );

          logger.info("LoRA deletion synced to remote server successfully");
          toast({
            title: t("addDialog.syncSuccess"),
            description: t("card.deleteSyncSuccess"),
          });
        } catch (error) {
          logger.error("Failed to sync LoRA deletion to remote server:", error);
          toast({
            title: t("addDialog.syncError"),
            description: t("card.deleteSyncError"),
            variant: "destructive",
          });
        } finally {
          setIsSyncing(false);
        }
      }
    }, [
      handleDeleteLora,
      item.id,
      t,
      toast,
      isReady,
      fetchConfig,
      updateConfigValues,
      customLoras.items,
    ]);

    return (
      <>
        <Card
          ref={ref}
          className={cn(
            "group relative overflow-hidden",
            "motion-safe:transition-all motion-safe:duration-300",
            "hover:scale-[1.02] hover:border-primary hover:shadow-lg",
            "active:scale-[0.98]",
            isHighlighted && [
              "scale-[1.02] border-primary shadow-lg ring-4 ring-primary/50",
              "motion-safe:animate-[pulse_2s_ease-in-out_3]",
            ],
            className
          )}
        >
          <div
            className={cn(
              "absolute right-2 top-2 z-20 flex gap-1.5",
              "motion-safe:transition-all motion-safe:duration-300",
              "scale-75 opacity-0",
              "group-hover:scale-100 group-hover:opacity-100"
            )}
          >
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full",
                "bg-background/95 shadow-lg backdrop-blur-sm",
                "transition-all duration-200",
                "hover:bg-background hover:shadow-xl"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageUrl(item.imageUrl);
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>

            {currentCategory === "custom" && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-full",
                    "bg-background/95 shadow-lg backdrop-blur-sm",
                    "transition-all duration-200",
                    "hover:bg-background hover:shadow-xl"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-full",
                    "bg-background/95 shadow-lg backdrop-blur-sm",
                    "transition-all duration-200",
                    "hover:bg-destructive/90 hover:text-white hover:shadow-xl"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>

          {/* Image Container */}
          <div
            className="relative aspect-square cursor-pointer overflow-hidden bg-muted/30"
            onClick={() => onClick?.(item)}
          >
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="motion-safe:animate-[pulse_2s_ease-in-out_infinite]">
                <Skeleton className="h-full w-full" />
              </div>
            )}

            {/* Image */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className={cn(
                "h-full w-full object-cover",
                "motion-safe:transition-all motion-safe:duration-500",
                "scale-100 group-hover:scale-110",
                !imageLoaded && "invisible opacity-0",
                imageLoaded && "visible opacity-100"
              )}
              style={{
                transition: imageLoaded
                  ? "opacity 0.3s ease-in-out, transform 0.5s ease-in-out"
                  : "none",
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Info */}
          <CardContent
            className={cn(
              "space-y-3 p-4",
              "motion-safe:transition-[transform,opacity] motion-safe:duration-300",
              "group-hover:scale-[0.98] group-hover:opacity-90"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-medium leading-none tracking-tight">
                {item.name}
              </h3>
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>

            {/* Details */}
            <div className="space-y-2 text-sm">
              {/* Trigger Words */}
              {item.prompt && (
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-muted-foreground">
                    {t("card.trigger_words")}:
                  </span>
                  <div className="group/copy relative min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-auto w-full justify-start p-0 text-left font-normal",
                        "motion-safe:transition-colors motion-safe:duration-300",
                        "hover:bg-transparent hover:text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate">{item.prompt}</span>
                        <Copy
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            "motion-safe:transition-all motion-safe:duration-300",
                            "scale-75 opacity-0",
                            "group-hover/copy:scale-100 group-hover/copy:opacity-100"
                          )}
                        />
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Weight */}
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-muted-foreground">
                  {t("card.weight")}:
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium">{item.weight}</span>
                  {item.guidance && (
                    <span className="text-muted-foreground">
                      ({item.guidance})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("card.delete_confirm_title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("card.delete_confirm_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("card.delete_cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("card.delete_confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              <img src={selectedImageUrl} alt={item.name} className="hidden" />
            </a>
          </LightGallery>
        )}
      </>
    );
  }
);

LoraCard.displayName = "LoraCard";
