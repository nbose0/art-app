"use client";

import { motion } from "motion/react";
import { useAppStore } from "@/stores/appStore";
import TimerEndCelebration from "@/components/shared/TimerEndCelebration";
import type { HostAction } from "@/lib/partyMessages";

interface WarmUpCompleteProps {
  sendAction: (action: HostAction) => void;
}

export default function WarmUpComplete({ sendAction }: WarmUpCompleteProps) {
  const isHost = useAppStore((s) => s.isHost);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <TimerEndCelebration trigger={true} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
          className="text-6xl"
        >
          🎨
        </motion.p>
        <h2 className="text-4xl font-bold text-foreground">
          You&apos;re all warmed up!
        </h2>
        <p className="text-lg text-muted max-w-md mx-auto">
          Great job! Now let&apos;s find some beautiful art to inspire your
          drawing session.
        </p>
        {isHost && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => sendAction({ type: "continue-to-museums" })}
            className="rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Explore Museums
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
