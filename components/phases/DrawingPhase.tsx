"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import DrawingTimer from "@/components/drawing/DrawingTimer";
import ReferencePanel from "@/components/drawing/ReferencePanel";
import Lightbox from "@/components/drawing/Lightbox";
import TimerEndCelebration from "@/components/shared/TimerEndCelebration";
import type { HostAction } from "@/lib/partyMessages";

interface DrawingPhaseProps {
  sendAction: (action: HostAction) => void;
}

export default function DrawingPhase({ sendAction }: DrawingPhaseProps) {
  const selectedArtworks = useAppStore((s) => s.selectedArtworks);
  const timerSecondsLeft = useAppStore((s) => s.timerSecondsLeft);
  const isHost = useAppStore((s) => s.isHost);
  const timerRunning = useAppStore((s) => s.timerRunning);

  const isTimerDone = timerSecondsLeft <= 0 && !timerRunning;

  return (
    <div className="min-h-screen px-4 py-8">
      <DrawingTimer />
      <Lightbox />
      <TimerEndCelebration trigger={isTimerDone} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h2 className="text-3xl font-bold text-foreground">
            {isTimerDone ? "Time's up! Great work!" : "Time to draw!"}
          </h2>
          <p className="text-muted">
            {isTimerDone
              ? "Hope you had a wonderful session!"
              : "Use these artworks as inspiration for your drawing"}
          </p>

          {/* Host controls */}
          {isHost && (
            <div className="flex justify-center gap-3 pt-2">
              {!isTimerDone && (
                timerRunning ? (
                  <button
                    onClick={() => sendAction({ type: "pause-timer" })}
                    className="rounded-xl bg-surface-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-border transition-colors"
                  >
                    Pause Timer
                  </button>
                ) : (
                  <button
                    onClick={() => sendAction({ type: "resume-timer" })}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                  >
                    Resume Timer
                  </button>
                )
              )}
              <button
                onClick={() => sendAction({ type: "back-to-museums" })}
                className="rounded-xl bg-surface-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-border transition-colors"
              >
                Back to Museums
              </button>
            </div>
          )}
        </div>

        {/* Reference artworks */}
        <ReferencePanel artworks={selectedArtworks} />
      </div>
    </div>
  );
}
