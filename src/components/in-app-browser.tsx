"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Home, RefreshCw, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function InAppBrowser() {
  const [url, setUrl] = useState("https://www.google.com/search?q=latest+government+job+notifications");
  const [history, setHistory] = useState([url]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const navigate = (direction: "back" | "forward") => {
    let newIndex = historyIndex;
    if (direction === "back" && historyIndex > 0) {
      newIndex = historyIndex - 1;
    }
    if (direction === "forward" && historyIndex < history.length - 1) {
      newIndex = historyIndex + 1;
    }
    setHistoryIndex(newIndex);
    setUrl(history[newIndex]);
  };
  
  const currentUrl = history[historyIndex];
  
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "Invalid URL";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("back")} disabled={historyIndex === 0}>
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate("forward")} disabled={historyIndex === history.length - 1}>
          <ArrowRight />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => document.querySelector<HTMLIFrameElement>("#browser-iframe")?.contentWindow?.location.reload()}>
          <RefreshCw />
        </Button>
        <form onSubmit={handleUrlSubmit} className="flex-1 relative">
            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-8"
                placeholder="https://..."
            />
            <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">{getHostname(currentUrl)}</span>
        </form>
      </div>
      <iframe
        id="browser-iframe"
        src={currentUrl}
        className="flex-1 w-full border-0"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        title="In-App Browser"
      />
    </div>
  );
}
