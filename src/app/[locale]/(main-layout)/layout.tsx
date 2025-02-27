import AppFooter from "@/components/global/app-footer";
import { AppSidebar } from "./_components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">{children}</div>
          <AppFooter />
        </main>
      </div>
    </SidebarProvider>
  );
}
