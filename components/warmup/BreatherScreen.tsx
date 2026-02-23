"use client";

import { motion } from "motion/react";

const messages = [
  "Nice one! Take a breath...",
  "Great work! Shake out those hands...",
  "Beautiful! Quick breather...",
  "Wonderful! Rest those fingers...",
  "Lovely! Deep breath...",
];

interface BreatherScreenProps {
  roundJustCompleted: number;
}

export default function BreatherScreen({
  roundJustCompleted,
}: BreatherScreenProps) {
  const message = messages[roundJustCompleted % messages.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="h-24 w-24 rounded-full bg-primary/20"
      />
      <p className="text-xl font-medium text-muted">{message}</p>
    </motion.div>
  );
}
