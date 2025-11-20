

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ActiveTool = {
  id: string;
  payload?: any;
}

type ToolsSidebarContextType = {
  isOpen: boolean;
  activeTool: ActiveTool | null;
  toggleSidebar: (forceOpen?: boolean) => void;
  setActiveTool: (tool: ActiveTool | null) => void;
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
  const [activeTool, setActiveToolState] = useState<ActiveTool | null>(null);

  const toggleSidebar = useCallback((forceOpen?: boolean) => {
    setIsOpen(prev => forceOpen !== undefined ? forceOpen : !prev);
  }, []);

  const setActiveTool = useCallback((tool: ActiveTool | null) => {
    setActiveToolState(tool);
    if (tool === null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
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
