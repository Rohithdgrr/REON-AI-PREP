
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToolsSidebarContextType = {
  isOpen: boolean;
  activeTool: string | null;
  toggleSidebar: (forceOpen?: boolean) => void;
  setActiveTool: (tool: string | null) => void;
};

const ToolsSidebarContext = createContext<ToolsSidebarContextType | undefined>(undefined);

export function useToolsSidebar() {
  const context = useContext(ToolsSidebarContext);
  if (!context) {
    throw new Error('useToolsSidebar must be used within a ToolsSidebarProvider');
  }
  return context;
}

export function ToolsSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveToolState] = useState<string | null>(null);

  const toggleSidebar = useCallback((forceOpen?: boolean) => {
    setIsOpen(prev => forceOpen !== undefined ? forceOpen : !prev);
  }, []);

  const setActiveTool = useCallback((toolId: string | null) => {
    setActiveToolState(currentTool => {
      // If the same tool is clicked again, toggle the sidebar
      if (currentTool === toolId && toolId !== null) {
        setIsOpen(prev => !prev);
        return currentTool;
      }
      // If a new tool is selected, open the sidebar
      if (toolId !== null) {
        setIsOpen(true);
      }
      return toolId;
    });
  }, []);

  const value = {
    isOpen,
    activeTool,
    toggleSidebar,
    setActiveTool,
  };

  return (
    <ToolsSidebarContext.Provider value={value}>
      {children}
    </ToolsSidebarContext.Provider>
  );
}
