
'use client';
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { ToolsSidebar } from "@/components/layout/tools-sidebar";
import { ToolsSidebarProvider } from "@/hooks/use-tools-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToolsSidebarProvider>
      <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
        <LeftSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
        </div>
        <ToolsSidebar />
        <RightSidebar />
      </div>
    </ToolsSidebarProvider>
  );
}
