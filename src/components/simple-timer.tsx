"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function SimpleTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (!isActive && seconds === 0 && minutes === 0) {
      clearInterval(interval!);
    } else if (isActive && minutes === 0 && seconds === 0) {
        // Optional: Play a sound or show a notification
        setIsActive(false);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds, minutes]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setMinutes(25);
    setSeconds(0);
    setIsActive(false);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setMinutes(value);
      setSeconds(0);
      setIsActive(false);
    }
  };
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <Card className="mt-4 border-0 shadow-none">
        <CardContent className="p-4 space-y-4 flex flex-col items-center">
            <div className="text-8xl font-mono font-bold tracking-tighter">
                <span>{formatTime(minutes)}</span>
                <span>:</span>
                <span>{formatTime(seconds)}</span>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="minutes" className="text-sm font-medium">Set Minutes:</label>
                <Input
                    id="minutes"
                    type="number"
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="w-20"
                    min="0"
                />
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
