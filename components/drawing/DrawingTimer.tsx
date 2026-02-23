"use client";

import Timer from "@/components/shared/Timer";
import { useAppStore } from "@/stores/appStore";

export default function DrawingTimer() {
  const secondsLeft = useAppStore((s) => s.timerSecondsLeft);
  const totalSeconds = useAppStore((s) => s.timerTotalSeconds);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Timer secondsLeft={secondsLeft} totalSeconds={totalSeconds} size="sm" />
    </div>
  );
}
