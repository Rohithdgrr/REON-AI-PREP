'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { ToolsSidebar } from '@/components/layout/tools-sidebar';
import withAuth from '@/components/with-auth';
import { cn } from '@/lib/utils';

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full bg-muted/40">
      <LeftSidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
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
