
'use client';

import { useEffect } from "react";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  return <>{children}</>;
}
