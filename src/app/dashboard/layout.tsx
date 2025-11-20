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
    <div className="flex min-h-screen w-full">
      <LeftSidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl">{children}</main>
      </div>
      <ToolsSidebar />
      <RightSidebar />
    </div>
  );
}
