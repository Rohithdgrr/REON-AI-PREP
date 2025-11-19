
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const formatTime = (ms: number) => {
  const date = new Date(ms);
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const millis = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
  return `${minutes}:${seconds}.<small>${millis}</small>`;
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
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lapTimesRaw, setLapTimesRaw] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  
  const update = useCallback(() => {
    setElapsedTime(Date.now() - startTimeRef.current);
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
    timerRef.current = setInterval(update, 10);
  }, [elapsedTime, isRunning, update]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    setLapTimesRaw([]);
  }, []);

  const lap = useCallback(() => {
    if (!isRunning) return;

    setLapTimesRaw(prevRawTimes => {
        const newLapTimes = [...prevRawTimes, elapsedTime];
        const lapDiffs = newLapTimes.map((time, index) => {
            return index === 0 ? time : time - newLapTimes[index - 1];
        });
        
        const validDiffs = lapDiffs.filter(d => d > 0);
        const minDiff = validDiffs.length > 1 ? Math.min(...validDiffs) : 0;
        const maxDiff = validDiffs.length > 1 ? Math.max(...validDiffs) : 0;

        const newLaps = newLapTimes.map((overall, index) => {
            const lapTime = lapDiffs[index];
            let type: Lap['type'] = 'normal';

            if (validDiffs.length > 1) {
                if (lapTime === minDiff) type = 'best';
                if (lapTime === maxDiff) type = 'worst';
            }

            return {
                lapNumber: index + 1,
                lapTime: formatTime(lapTime),
                overallTime: formatTime(overall),
                type,
            };
        }).reverse();
        
        setLaps(newLaps);
        return newLapTimes;
    });
}, [isRunning, elapsedTime]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? pause() : start();
      } else if (e.key.toLowerCase() === 'l' && isRunning) {
        lap();
      } else if (e.key.toLowerCase() === 'r' && (elapsedTime > 0 || laps.length > 0)) {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, start, pause, lap, reset, elapsedTime, laps]);
  
  const getStats = () => {
    const lapDiffs = lapTimesRaw.map((time, index) => index === 0 ? time : time - (lapTimesRaw[index-1] || 0));
    const validDiffs = lapDiffs.filter(d => d > 0);
    const minDiff = validDiffs.length > 0 ? Math.min(...validDiffs) : 0;
    const maxDiff = validDiffs.length > 0 ? Math.max(...validDiffs) : 0;
    
    return {
        lapCount: String(laps.length),
        bestLap: minDiff > 0 ? formatTime(minDiff) : '-',
        worstLap: maxDiff > 0 ? formatTime(maxDiff) : '-',
    }
  }


  return {
    displayTime: formatTime(elapsedTime),
    isRunning,
    laps,
    stats: getStats(),
    start,
    pause,
    reset,
    lap,
  };
};
