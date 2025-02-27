"use client";

import AppLogo from "@/components/global/app-logo";
import { useIsHideBrand } from "@/hooks/global/use-is-hide-brand";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface HomeHeaderProps {
  className?: string;
}

export default function HomeHeader({ className }: HomeHeaderProps) {
  const t = useTranslations();
  const { state } = useSidebar();
  const isHideBrand = useIsHideBrand();

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 transition-all duration-200",
        state === "collapsed" ? "justify-center" : "px-4",
        className
      )}
    >
      {isHideBrand ? null : (
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl",
            "bg-primary/10 text-primary",
            "transition-all duration-300 hover:bg-primary/15",
            "shadow-sm shadow-primary/5"
          )}
        >
          <AppLogo
            size="mini"
            height={24}
            width={24}
            className={cn(
              "transition-all duration-300",
              state === "collapsed" && "scale-110"
            )}
          />
        </div>
      )}
      {state === "expanded" && (
        <h1 className="min-w-0 flex-shrink overflow-hidden text-lg font-bold tracking-tight text-primary transition-all duration-300 animate-in fade-in slide-in-from-left-8">
          {t("home.header.title")}
        </h1>
      )}
    </div>
  );
}
