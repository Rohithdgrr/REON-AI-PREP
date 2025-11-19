
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useStopwatch } from "@/hooks/use-stopwatch";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-semibold" dangerouslySetInnerHTML={{ __html: value }} />
  </div>
);

export function SimpleStopwatch() {
  const {
    displayTime,
    isRunning,
    laps,
    stats,
    start,
    pause,
    reset,
    lap,
  } = useStopwatch();

  return (
    <div className="flex flex-col h-full items-center text-center pt-4">
       <Card className="w-full">
            <CardContent className="p-4 flex flex-col items-center gap-4">
                <div
                    className="text-7xl font-mono font-bold tracking-tighter w-full"
                    dangerouslySetInnerHTML={{ __html: displayTime }}
                />
                
                <div className="flex gap-4">
                    <Button 
                        id="lapBtn" 
                        onClick={lap} 
                        disabled={!isRunning} 
                        size="lg" 
                        variant="outline" 
                        className="rounded-full w-20 h-20"
                    >
                        <Flag className="w-8 h-8" />
                    </Button>
                    <Button 
                        id="startBtn" 
                        onClick={isRunning ? pause : start}
                        size="lg"
                        className={cn(
                            "w-20 h-20 rounded-full text-lg shadow-lg", 
                            isRunning ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-primary text-primary-foreground"
                        )}
                    >
                        {isRunning ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8" />}
                    </Button>
                </div>
            </CardContent>
        </Card>

      <Card className="w-full mt-4">
        <CardHeader className="p-2 flex flex-row items-center justify-between">
           <div className="grid grid-cols-3 gap-2 text-center w-full">
             <Stat label="Laps" value={stats.lapCount} />
             <Stat label="Best" value={stats.bestLap} />
             <Stat label="Worst" value={stats.worstLap} />
           </div>
           <Button id="resetBtn" onClick={reset} disabled={laps.length === 0 && !isRunning} size="sm" variant="ghost" className="absolute right-1 top-1 text-muted-foreground hover:text-destructive">
                <RotateCcw className="h-4 w-4"/>
           </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-48 border-t">
            {laps.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Press 'Lap' to record splits.
                </div>
            ) : (
                <div className="p-2">
                {laps.map((lapItem, index) => (
                    <div key={index} className={cn("flex justify-between items-center p-2 rounded-md text-sm font-mono", lapItem.type === 'best' && 'bg-green-500/10 text-green-800 dark:text-green-300', lapItem.type === 'worst' && 'bg-red-500/10 text-red-800 dark:text-red-400')}>
                        <span>Lap {lapItem.lapNumber}</span>
                        <span dangerouslySetInnerHTML={{ __html: lapItem.lapTime }} />
                        <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: lapItem.overallTime }} />
                    </div>
                ))}
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="text-xs text-muted-foreground mt-4">
          Shortcuts: Space = Start/Pause • L = Lap • R = Reset
      </div>
    </div>
  );
}
