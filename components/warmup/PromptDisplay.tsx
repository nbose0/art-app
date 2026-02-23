"use client";

import { motion } from "motion/react";
import type { DrawingPrompt } from "@/lib/types";

interface PromptDisplayProps {
  prompt: DrawingPrompt;
}

export default function PromptDisplay({ prompt }: PromptDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg text-center text-3xl font-bold text-foreground md:text-4xl"
      >
        {prompt.text}
      </motion.h2>
    </motion.div>
  );
}
