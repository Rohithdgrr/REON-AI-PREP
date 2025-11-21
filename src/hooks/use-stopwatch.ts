
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.<small class="text-3xl">${milliseconds.toString().padStart(2, '0')}</small>`;
};

type Lap = {
  lapNumber: number;
  lapTime: string;
  overallTime: string;
  type: 'normal' | 'best' | 'worst';
};

export const useStopwatch = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const frameRequestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;

    const animate = () => {
      setElapsedTime(Date.now() - (startTimeRef.current ?? 0));
      frameRequestRef.current = requestAnimationFrame(animate);
    };
    frameRequestRef.current = requestAnimationFrame(animate);
  }, [isRunning, elapsedTime]);

  const stop = useCallback(() => {
    if (!isRunning || frameRequestRef.current === null) return;
    cancelAnimationFrame(frameRequestRef.current);
    frameRequestRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
    setLaps([]);
  }, [stop]);

  const lap = useCallback(() => {
    if (!isRunning) return;
    setLaps(prevLaps => [...prevLaps, elapsedTime]);
  }, [isRunning, elapsedTime]);

  const formattedLaps: Lap[] = useMemo(() => {
    const lapDiffs = laps.map((lapTime, i) => {
        const previousLapTime = i > 0 ? laps[i - 1] : 0;
        return lapTime - previousLapTime;
    });

    if (lapDiffs.length <= 1) {
        return laps.map((lapTime, i) => ({
            lapNumber: i + 1,
            lapTime: formatTime(lapDiffs[i]),
            overallTime: formatTime(lapTime),
            type: 'normal',
        })).reverse();
    }
    
    const minLap = Math.min(...lapDiffs);
    const maxLap = Math.max(...lapDiffs);

    return laps.map((lapTime, i) => {
        const diff = lapDiffs[i];
        let type: Lap['type'] = 'normal';
        if (diff === minLap) type = 'best';
        if (diff === maxLap) type = 'worst';
        
        return {
            lapNumber: i + 1,
            lapTime: formatTime(diff),
            overallTime: formatTime(lapTime),
            type: type,
        };
    }).reverse();
  }, [laps]);
  
  const stats = useMemo(() => {
     const lapDiffs = laps.map((lapTime, i) => i > 0 ? lapTime - laps[i-1] : lapTime);
     if (laps.length === 0) {
        return { lapCount: '0', bestLap: '-', worstLap: '-' };
     }
     const best = Math.min(...lapDiffs);
     const worst = Math.max(...lapDiffs);
     return {
        lapCount: String(laps.length),
        bestLap: formatTime(best),
        worstLap: formatTime(worst),
     }
  }, [laps]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? stop() : start();
      } else if (e.key.toLowerCase() === 'l' && isRunning) {
        lap();
      } else if (e.key.toLowerCase() === 'r' && (elapsedTime > 0 || laps.length > 0)) {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [isRunning, start, stop, lap, reset, elapsedTime, laps]);

  return {
    time: formatTime(elapsedTime),
    isRunning,
    laps: formattedLaps,
    stats,
    start,
    stop,
    reset,
    lap,
  };
};
