
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { ToolsSidebar } from '@/components/layout/tools-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full bg-muted/40">
      <LeftSidebar />
      <div className="flex flex-1 flex-col sm:pl-20 lg:pl-64 lg:[&[data-collapsed=true]]:pl-20 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 lg:pr-[calc(5rem+1px)]">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>
      </div>
      <ToolsSidebar />
      <RightSidebar />
    </div>
  );
}
