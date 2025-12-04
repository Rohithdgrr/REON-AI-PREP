
'use client';

import { useEffect } from "react";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This code runs only on the client, after the initial render.
    // It helps prevent some browser extensions (like Grammarly) from
    // injecting scripts and causing hydration errors.
    document.body.setAttribute('data-gramm', 'false');
    document.body.setAttribute('data-gramm_editor', 'false');
    document.body.setAttribute('data-enable-grammarly', 'false');
    
    // Explicitly add this attribute on the client to avoid hydration mismatch warnings
    // caused by browser extensions manipulating the DOM.
    document.body.setAttribute('suppressHydrationWarning', 'true');

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
