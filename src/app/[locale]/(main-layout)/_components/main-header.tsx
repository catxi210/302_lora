"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  className?: string;
  menu?: React.ReactNode;
}

export default function MainHeader({ className, menu }: MainHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-14 items-center">
        <div className="flex h-full shrink-0 items-center gap-4 px-4">
          <SidebarTrigger className="shrink-0" />
        </div>
        {menu && (
          <div className="scrollbar-none h-full flex-1 overflow-x-auto">
            <div className="flex h-full min-w-full items-center px-4">
              {menu}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
