"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/appStore";
import {
  playTimerStart,
  playWarning30s,
  playWarning10s,
  playCountdownTick,
  playTimerEnd,
  playDrawingMilestone,
} from "@/lib/sounds";

type TimerSoundPhase = "warmup" | "drawing";

const WARMUP_THRESHOLDS: Record<number, () => void> = {
  30: playWarning30s,
  10: playWarning10s,
  5: () => playCountdownTick(5),
  4: () => playCountdownTick(4),
  3: () => playCountdownTick(3),
  2: () => playCountdownTick(2),
  1: () => playCountdownTick(1),
  0: playTimerEnd,
};

const DRAWING_THRESHOLDS: Record<number, () => void> = {
  [10 * 60]: playDrawingMilestone,
  [5 * 60]: playDrawingMilestone,
  [1 * 60]: playDrawingMilestone,
  0: playTimerEnd,
};

export function useTimerSounds(phase: TimerSoundPhase): void {
  const timerSecondsLeft = useAppStore((s) => s.timerSecondsLeft);
  const timerRunning = useAppStore((s) => s.timerRunning);
  const currentRound = useAppStore((s) => s.currentRound);

  const playedThresholdsRef = useRef<Set<number>>(new Set());
  const wasRunningRef = useRef(false);
  const lastRoundRef = useRef(currentRound);

  useEffect(() => {
    // Reset thresholds on round change (warmup)
    if (currentRound !== lastRoundRef.current) {
      playedThresholdsRef.current.clear();
      lastRoundRef.current = currentRound;
    }

    // Detect timer start (false → true edge)
    if (timerRunning && !wasRunningRef.current) {
      playTimerStart();
      playedThresholdsRef.current.clear();
    }
    wasRunningRef.current = timerRunning;

    // Only play threshold sounds while timer is active (or just hit 0)
    if (!timerRunning && timerSecondsLeft !== 0) return;

    const thresholds =
      phase === "warmup" ? WARMUP_THRESHOLDS : DRAWING_THRESHOLDS;
    const soundFn = thresholds[timerSecondsLeft];

    if (soundFn && !playedThresholdsRef.current.has(timerSecondsLeft)) {
      playedThresholdsRef.current.add(timerSecondsLeft);
      soundFn();
    }
  }, [timerSecondsLeft, timerRunning, currentRound, phase]);
}
