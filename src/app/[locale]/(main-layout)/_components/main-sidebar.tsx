"use client";

import * as React from "react";
import { List, Pencil, ImageIcon, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import HomeHeader from "@/components/home/header";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import AppHeader from "@/components/global/app-header";
// Menu items
const items = [
  {
    titleKey: "lora_list",
    path: "loras",
    icon: List,
  },
  {
    titleKey: "train_lora",
    path: "train",
    icon: Pencil,
  },
  {
    titleKey: "generate_image",
    path: "generate",
    icon: ImageIcon,
  },
  {
    titleKey: "history",
    path: "history",
    icon: History,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const t = useTranslations("sidebar");
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  // Find active item index
  const activeItemIndex = items.findIndex((item) =>
    pathname.startsWith(`/${item.path}`)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <HomeHeader className="mb-4 mt-6 h-6" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-4 text-sm font-medium text-muted-foreground/70">
            {t("group.features")}
          </SidebarGroupLabel>
          <SidebarMenu
            className={cn("relative", state === "collapsed" ? "px-0" : "px-3")}
          >
            {state !== "collapsed" && (
              <>
                <motion.div
                  className="absolute inset-x-0 h-11 rounded-lg bg-sidebar-accent"
                  initial={false}
                  animate={{
                    y: `calc(${activeItemIndex} * (44px + 6px))`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
                <motion.div
                  className="absolute left-0 h-7 w-1 rounded-full bg-sidebar-accent-foreground"
                  initial={false}
                  animate={{
                    y: `calc(${activeItemIndex} * (44px + 6px) + 8px)`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              </>
            )}
            <div
              className={cn(
                "flex flex-col",
                state === "collapsed" ? "gap-2" : "gap-1.5"
              )}
            >
              {items.map((item, index) => {
                const href = {
                  pathname: `/${item.path}`,
                };
                const isActive = pathname.startsWith(href.pathname);
                const title = t(`menu.${item.titleKey}`);
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      tooltip={title}
                      className={cn(
                        "relative h-11 w-full rounded-lg transition-colors duration-200",
                        state === "collapsed"
                          ? "hover:bg-sidebar-accent/5 py-1"
                          : "hover:bg-sidebar-accent/10 dark:hover:bg-sidebar-accent/20"
                      )}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link href={href}>
                        <div
                          className={cn(
                            "relative flex h-full w-full items-center",
                            state === "collapsed"
                              ? "justify-center"
                              : "gap-3 px-3"
                          )}
                        >
                          <div className="flex h-6 w-6 items-center justify-center">
                            <item.icon
                              className={cn(
                                "h-[18px] w-[18px] transition-colors duration-200",
                                isActive
                                  ? "text-sidebar-accent-foreground"
                                  : "text-muted-foreground/70 group-hover:text-muted-foreground"
                              )}
                            />
                          </div>
                          {state !== "collapsed" && (
                            <span
                              className={cn(
                                "text-sm font-medium tracking-tight transition-colors duration-200",
                                isActive
                                  ? "text-sidebar-accent-foreground"
                                  : "text-muted-foreground/70 group-hover:text-muted-foreground"
                              )}
                            >
                              {title}
                            </span>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppHeader vertical={state === "collapsed"} />
      </SidebarFooter>
    </Sidebar>
  );
}
