
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Play, Pause, RotateCcw, Plus, Trash2, History } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

type Timer = {
  id: number;
  initialDuration: number;
  remaining: number;
  isActive: boolean;
  label: string;
};

const useTimerStore = () => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [recents, setRecents] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // audioRef.current = new Audio('/audio/timer-end.mp3');
        try {
            const storedRecents = localStorage.getItem("recentTimers");
            if (storedRecents) {
                setRecents(JSON.parse(storedRecents));
            }
        } catch (error) {
            console.error("Could not load recent timers from localStorage", error);
        }
    }, []);

    const addRecent = (duration: number) => {
        setRecents(prev => {
            const newRecents = [duration, ...prev.filter(d => d !== duration)].slice(0, 5);
             try {
                localStorage.setItem("recentTimers", JSON.stringify(newRecents));
            } catch (error) {
                console.error("Could not save recent timers to localStorage", error);
            }
            return newRecents;
        })
    }

    const addTimer = (duration: number, label: string) => {
        const newTimer: Timer = {
            id: Date.now(),
            initialDuration: duration,
            remaining: duration,
            isActive: true,
            label: label || `Timer ${timers.length + 1}`,
        };
        setTimers(prev => [newTimer, ...prev]);
        addRecent(duration);
    };
    
    const toggleTimer = (id: number) => {
        setTimers(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    };

    const resetTimer = (id: number) => {
        setTimers(prev => prev.map(t => t.id === id ? { ...t, remaining: t.initialDuration, isActive: false } : t));
    };
    
    const removeTimer = (id: number) => {
        setTimers(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => prev.map(t => {
                if (t.isActive && t.remaining > 0) {
                    return { ...t, remaining: t.remaining - 1 };
                } else if (t.isActive && t.remaining === 0) {
                    // audioRef.current?.play();
                    toast({ title: "Timer Finished!", description: t.label });
                    return { ...t, isActive: false };
                }
                return t;
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [toast]);

    return { timers, addTimer, toggleTimer, resetTimer, removeTimer, recents };
};

function TimerComponent({ timer, onToggle, onReset, onRemove }: { timer: Timer, onToggle: (id: number) => void, onReset: (id: number) => void, onRemove: (id: number) => void }) {
    const progress = (timer.initialDuration - timer.remaining) / timer.initialDuration * 100;
    const endTime = new Date(Date.now() + timer.remaining * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
        <Card className="w-full">
            <CardContent className="p-4 flex flex-col items-center gap-4">
                <div className="w-full flex justify-between items-center">
                    <span className="font-semibold">{timer.label}</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(timer.id)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                </div>
                <div className="text-5xl font-mono font-bold tracking-tighter">
                    {formatTime(timer.remaining)}
                </div>
                <div className="w-full">
                    <Progress value={progress} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatTime(timer.initialDuration)}</span>
                        <span>Ends at {endTime}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => onToggle(timer.id)} size="lg" className="rounded-full w-16 h-16">
                        {timer.isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button onClick={() => onReset(timer.id)} size="lg" variant="outline" className="rounded-full w-16 h-16">
                        <RotateCcw className="w-6 h-6" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function NewTimerForm({ onAddTimer }: { onAddTimer: (duration: number, label: string) => void }) {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [label, setLabel] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds > 0) {
            onAddTimer(totalSeconds, label);
            setHours(0); setMinutes(25); setSeconds(0); setLabel("");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="flex gap-2">
                <Input type="number" placeholder="HH" min="0" max="23" value={hours} onChange={e => setHours(Number(e.target.value))} className="text-center" />
                <Input type="number" placeholder="MM" min="0" max="59" value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="text-center" />
                <Input type="number" placeholder="SS" min="0" max="59" value={seconds} onChange={e => setSeconds(Number(e.target.value))} className="text-center" />
            </div>
            <Input type="text" placeholder="Timer Label (optional)" value={label} onChange={e => setLabel(e.target.value)} />
            <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Start New Timer
            </Button>
        </form>
    )
}


export function MultiTimer() {
    const { timers, addTimer, toggleTimer, resetTimer, removeTimer, recents } = useTimerStore();
    const presets = [5 * 60, 15 * 60, 25 * 60];

    return (
        <div className="mt-4 space-y-4 h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <NewTimerForm onAddTimer={addTimer} />

            <div className="space-y-2">
                <h4 className="font-semibold text-sm">Presets</h4>
                <div className="flex gap-2">
                    {presets.map(p => (
                        <Button key={p} variant="outline" size="sm" onClick={() => addTimer(p, `${p / 60} Minute Timer`)}>
                            {p/60} min
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                 <h4 className="font-semibold text-sm">Recents</h4>
                {recents.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                        {recents.map(r => (
                            <Button key={r} variant="outline" size="sm" onClick={() => addTimer(r, `${formatTime(r)} Timer`)}>
                                {formatTime(r)}
                            </Button>
                        ))}
                    </div>
                ) : <p className="text-xs text-muted-foreground">No recent timers.</p>}
            </div>

            <div className="space-y-4">
                {timers.map(timer => (
                    <TimerComponent key={timer.id} timer={timer} onToggle={toggleTimer} onReset={resetTimer} onRemove={removeTimer} />
                ))}
            </div>

             {timers.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p>No active timers.</p>
                    <p className="text-xs">Create a new timer to get started.</p>
                </div>
            )}
        </div>
    );
}
