
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useStopwatch } from "@/hooks/use-stopwatch";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col h-full items-center text-center py-4">
      <div
        className="text-7xl md:text-8xl font-mono font-bold tracking-tighter text-primary"
        dangerouslySetInnerHTML={{ __html: displayTime }}
      />
      
      <div className="flex gap-4 my-6">
        <Button 
          id="startBtn" 
          onClick={isRunning ? pause : start}
          size="lg"
          className={cn(
            "w-24 h-24 rounded-full text-lg shadow-lg", 
            isRunning ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          {isRunning ? 'Pause' : (displayTime.startsWith('00:00') ? 'Start' : 'Resume')}
        </Button>
        <Button id="lapBtn" onClick={lap} disabled={!isRunning} size="lg" className="w-24 h-24 rounded-full text-lg">Lap</Button>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
           <div className="grid grid-cols-3 gap-4 text-center w-full">
             <Stat label="Laps" value={stats.lapCount} />
             <Stat label="Best" value={stats.bestLap} />
             <Stat label="Worst" value={stats.worstLap} />
           </div>
           <Button id="resetBtn" onClick={reset} disabled={laps.length === 0 && !isRunning} size="sm" variant="destructive" className="absolute right-2 top-2">Reset</Button>
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
