"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function SimpleStopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Update every 10ms for smooth display
      }, 10);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval!);
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setTime(0);
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor((time / 60000) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const milliseconds = (time % 1000).toString().padStart(3, '0').slice(0, 2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <Card className="mt-4 border-0 shadow-none">
        <CardContent className="p-4 space-y-4 flex flex-col items-center">
            <div className="text-8xl font-mono font-bold tracking-tighter">
                {formatTime()}
            </div>
            <div className="flex gap-4">
                <Button onClick={toggle} size="lg" className="rounded-full w-20 h-20">
                    {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
                <Button onClick={reset} size="lg" variant="outline" className="rounded-full w-20 h-20">
                    <RotateCcw className="w-8 h-8" />
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
