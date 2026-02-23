"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface TimerEndCelebrationProps {
  trigger: boolean;
}

export default function TimerEndCelebration({
  trigger,
}: TimerEndCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#6366f1", "#f59e0b", "#22c55e", "#ec4899", "#8b5cf6"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return null;
}
