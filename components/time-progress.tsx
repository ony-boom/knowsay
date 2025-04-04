"use client";
import { memo } from "react";
import { Clock } from "lucide-react";
import { motion } from "motion/react";

export const TimeProgress = memo(
  ({ timeLeft, totalTime }: TimeProgressProps) => {
    const percentageLeft = Math.max(
      0,
      Math.min(100, (timeLeft / totalTime) * 100),
    );
    const displayTime = Math.ceil(timeLeft);

    return (
      <div className="bg-card relative w-20 overflow-hidden rounded-md border px-1">
        <motion.div
          layout
          initial={{ width: `${percentageLeft}%` }}
          animate={{ width: `${percentageLeft}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="bg-primary absolute inset-0 z-0 h-full"
        />
        <div className="relative z-10 flex items-center gap-2 p-[6px] text-white mix-blend-difference">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">{displayTime}s</span>
        </div>
      </div>
    );
  },
);

interface TimeProgressProps {
  timeLeft: number;
  totalTime: number;
  warningThreshold?: number;
  dangerThreshold?: number;
}

TimeProgress.displayName = "TimeProgress";
