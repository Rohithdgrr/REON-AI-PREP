
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useStopwatch } from "@/hooks/use-stopwatch";
import { cn } from "@/lib/utils";

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
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
        className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-primary"
        dangerouslySetInnerHTML={{ __html: displayTime }}
      />
      
      <div className="flex gap-4 my-6">
        <Button 
          id="startBtn" 
          onClick={isRunning ? pause : start}
          size="lg"
          className={cn(
            "w-24 h-24 rounded-full text-lg", 
            isRunning ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          {isRunning ? 'Pause' : (displayTime.startsWith('00:00') ? 'Start' : 'Resume')}
        </Button>
        <Button id="lapBtn" onClick={lap} disabled={!isRunning} size="lg" className="w-24 h-24 rounded-full text-lg">Lap</Button>
        <Button id="resetBtn" onClick={reset} disabled={laps.length === 0 && !isRunning} size="lg" variant="destructive" className="w-24 h-24 rounded-full text-lg">Reset</Button>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4">
           <div className="grid grid-cols-3 gap-4 text-center">
             <Stat label="Laps" value={stats.lapCount} />
             <Stat label="Best" value={stats.bestLap} />
             <Stat label="Worst" value={stats.worstLap} />
           </div>
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
                    <div key={index} className={cn("flex justify-between items-center p-2 rounded-md text-sm", lapItem.type === 'best' && 'bg-green-500/10', lapItem.type === 'worst' && 'bg-red-500/10')}>
                        <span>Lap {lapItem.lapNumber}</span>
                        <span className="font-mono" dangerouslySetInnerHTML={{ __html: lapItem.lapTime }} />
                        <span className="font-mono text-muted-foreground" dangerouslySetInnerHTML={{ __html: lapItem.overallTime }} />
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
