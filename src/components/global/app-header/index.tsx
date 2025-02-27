"use client";
import { cn } from "@/lib/utils";
import { isOutsideDeployMode } from "@/utils/302";
import { isAuthPath } from "@/utils/path";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolInfo } from "./tool-info";
import ChatToggler from "./chat-toggler";

type HeaderProps = {
  className?: string;
  vertical?: boolean;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, vertical }, ref) => {
    const pathname = usePathname();
    return (
      <header className={cn("transition-transform duration-300", className)}>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 p-2",
            "transition-transform duration-300 ease-in-out",
            vertical ? "flex-col" : "flex-row justify-end",
            className
          )}
        >
          {!isAuthPath(pathname) && !isOutsideDeployMode() && <ToolInfo />}
          <ChatToggler />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
    );
  }
);

Header.displayName = "AppHeader";

export default Header;
