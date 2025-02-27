"use client";

import * as React from "react";
import { LoraCard } from "./lora-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { type LoraItem } from "@/data/loras";
import { useInView } from "react-intersection-observer";

interface LoraGridProps {
  items: LoraItem[];
  onItemClick?: (item: LoraItem) => void;
  onItemEdit?: (item: LoraItem) => void;
  className?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  highlightedLoraId?: string | null;
  loraRef?: React.RefObject<HTMLDivElement>;
}

export function LoraGrid({
  items,
  onItemClick,
  onItemEdit,
  className,
  isLoading,
  hasMore,
  onLoadMore,
  highlightedLoraId,
  loraRef,
}: LoraGridProps) {
  const t = useTranslations("loras");
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore?.();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  if (items.length === 0 && !isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "min-h-[400px] w-full",
          "text-muted-foreground",
          "rounded-lg border-2 border-dashed border-muted",
          className
        )}
      >
        <p className="text-lg font-medium">{t("noResults")}</p>
        <p className="mt-2 text-sm">{t("tryDifferentCategory")}</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div
        className={cn(
          "columns-1 gap-6",
          "@[600px]:columns-2",
          "@[900px]:columns-3",
          "@[1200px]:columns-4",
          className
        )}
      >
        {items.map((item, index) => {
          const { url, guidance, ...cardProps } = item;
          const isHighlighted = highlightedLoraId === item.id;

          return (
            <LoraCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
              onEdit={() => onItemEdit?.(item)}
              ref={isHighlighted ? loraRef : undefined}
              isHighlighted={isHighlighted}
              className="group/card-wrapper mb-6 break-inside-avoid hover:z-10"
            />
          );
        })}
      </div>

      {/* Loading indicator */}
      {(isLoading || hasMore) && (
        <div
          ref={loadMoreRef}
          className={cn(
            "mt-8 flex flex-col items-center justify-center py-4",
            "text-muted-foreground"
          )}
        >
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-4 text-sm">{t("loading")}</p>
        </div>
      )}
    </div>
  );
}
