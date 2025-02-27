"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const categories = [
  { id: "style", icon: "🎨" },
  { id: "character", icon: "👤" },
  { id: "tool", icon: "🔧" },
  { id: "landscape", icon: "🌄" },
  // { id: "architecture", icon: "🏛️" },
  { id: "animal", icon: "🐾" },
  { id: "custom", icon: "✨" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export function CategoryTabs() {
  const t = useTranslations("loras");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current category from URL or default to "style"
  const currentCategory =
    (searchParams.get("category") as CategoryId) || "style";

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      // Create new URLSearchParams object
      const params = new URLSearchParams(searchParams);
      // Update category parameter
      params.set("category", newValue);
      // Update URL with new search params
      // @ts-expect-error - Next.js type issue with router.replace
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Mobile dropdown menu
  const MobileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            {categories.find((cat) => cat.id === currentCategory)?.icon}
            {t(`categories.${currentCategory}`)}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-[--radix-dropdown-menu-trigger-width]"
      >
        <DropdownMenuRadioGroup
          value={currentCategory}
          onValueChange={handleValueChange}
        >
          {categories.map(({ id, icon }) => (
            <DropdownMenuRadioItem key={id} value={id} className="gap-2">
              <span>{icon}</span>
              <span>{t(`categories.${id}`)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Desktop tabs
  const DesktopTabs = () => (
    <Tabs
      value={currentCategory}
      onValueChange={handleValueChange}
      className="h-full"
    >
      <TabsList className="no-scrollbar h-full w-full max-w-none justify-start gap-0 rounded-none border-none bg-transparent p-0 px-2">
        {categories.map(({ id, icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              "group relative h-full gap-2 rounded-none border-b-2 border-transparent px-4",
              "data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary",
              "hover:bg-muted/50 hover:text-primary",
              "motion-safe:transition-all motion-safe:duration-300"
            )}
          >
            <span className="text-base">{icon}</span>
            <span className="relative text-sm font-medium">
              {t(`categories.${id}`)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  return (
    <div className="h-full w-full @container">
      <div className="flex h-full items-center @[700px]:hidden">
        <MobileMenu />
      </div>
      <div className="hidden h-full @[700px]:block">
        <DesktopTabs />
      </div>
    </div>
  );
}
