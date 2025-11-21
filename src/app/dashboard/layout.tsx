
'use client';

import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { ToolsSidebar } from '@/components/layout/tools-sidebar';
import withAuth from '@/components/with-auth';

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full bg-muted/40">
      <LeftSidebar />
      <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-20">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 sm:p-6 lg:p-8 lg:pb-8">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>
      </div>
      <ToolsSidebar />
      <RightSidebar />
    </div>
  );
}

export default withAuth(DashboardLayout);
