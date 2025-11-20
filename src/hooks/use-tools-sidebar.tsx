
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ActiveTool = {
  id: string;
  payload?: any;
}

type ToolsSidebarContextType = {
  isOpen: boolean;
  activeTool: ActiveTool | null;
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
  const [activeTool, setActiveToolState] = useState<ActiveTool | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(activeTool !== null);
  }, [activeTool]);

  const setActiveTool = useCallback((tool: ActiveTool | null) => {
    setActiveToolState(tool);
  }, []);

  const value = {
    isOpen,
    activeTool,
    setActiveTool,
  };

  return (
    <ToolsSidebarContext.Provider value={value}>
      {children}
    </ToolsSidebarContext.Provider>
  );
}
