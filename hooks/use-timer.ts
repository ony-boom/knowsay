"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const isDone = timeLeft <= 0;

  const reset = useCallback(
    (newTime = initialTime) => {
      setTimeLeft(newTime);
      setIsRunning(false);
    },
    [initialTime],
  );

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!isDone && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        timerRef.current = null;
      }, 1000);
      setIsRunning(true);
    }
  }, [isDone]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      if (!isDone && !timerRef.current) {
        timerRef.current = setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1);
          timerRef.current = null;
        }, 1000);
      }
    }
  }, [isDone, isRunning]);

  useEffect(() => {
    if (isRunning && !isDone) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        timerRef.current = null;
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isDone, isRunning]);

  return {
    timeLeft,
    isDone,
    reset,
    pause,
    resume,
    start,
    isRunning,
    isPaused: !isRunning && !isDone,
  };
}
