"use client";

import { useAppStore } from "@/stores/appStore";
import { warmUpPrompts } from "@/lib/prompts";
import PromptDisplay from "@/components/warmup/PromptDisplay";
import RoundIndicator from "@/components/warmup/RoundIndicator";
import BreatherScreen from "@/components/warmup/BreatherScreen";
import Timer from "@/components/shared/Timer";
import type { HostAction } from "@/lib/partyMessages";
import { AnimatePresence, motion } from "motion/react";

interface WarmUpPhaseProps {
  sendAction: (action: HostAction) => void;
}

export default function WarmUpPhase({ sendAction }: WarmUpPhaseProps) {
  const currentRound = useAppStore((s) => s.currentRound);
  const roundState = useAppStore((s) => s.roundState);
  const shuffledPromptIndices = useAppStore((s) => s.shuffledPromptIndices);
  const timerSecondsLeft = useAppStore((s) => s.timerSecondsLeft);
  const timerTotalSeconds = useAppStore((s) => s.timerTotalSeconds);
  const warmUpConfig = useAppStore((s) => s.warmUpConfig);
  const isHost = useAppStore((s) => s.isHost);

  const promptIndex = shuffledPromptIndices[currentRound] ?? 0;
  const currentPrompt = warmUpPrompts[promptIndex];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      {/* Round indicator at top */}
      <RoundIndicator
        currentRound={currentRound}
        totalRounds={warmUpConfig.totalRounds}
      />

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {roundState === "breather" ? (
          <motion.div
            key={`breather-${currentRound}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BreatherScreen roundJustCompleted={currentRound} />
          </motion.div>
        ) : (
          <motion.div
            key={`round-${currentRound}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-10"
          >
            {/* Prompt */}
            {currentPrompt && <PromptDisplay prompt={currentPrompt} />}

            {/* Timer — only visible once counting down */}
            {roundState === "counting-down" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.3 }}
              >
                <Timer
                  secondsLeft={timerSecondsLeft}
                  totalSeconds={timerTotalSeconds}
                  size="lg"
                />
              </motion.div>
            )}

            {/* Waiting indicator before timer starts */}
            {roundState === "showing-prompt" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted text-sm"
              >
                Get ready...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Host skip button */}
      {isHost && roundState === "counting-down" && (
        <button
          onClick={() => sendAction({ type: "advance-round" })}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Skip round
        </button>
      )}
    </div>
  );
}
