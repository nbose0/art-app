"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "@/stores/appStore";
import { useSession } from "@/hooks/useSession";
import HomeScreen from "@/components/phases/HomeScreen";
import WarmUpPhase from "@/components/phases/WarmUpPhase";
import MuseumSelectionPhase from "@/components/phases/MuseumSelectionPhase";
import DrawingPhase from "@/components/phases/DrawingPhase";
import WarmUpComplete from "@/components/warmup/WarmUpComplete";
import SlotMachinePhase from "@/components/phases/SlotMachinePhase";

export default function Home() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const { sendAction } = useSession(roomId);
  const phase = useAppStore((s) => s.phase);

  const connectToRoom = (id: string) => {
    setRoomId(id);
  };

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {phase === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <HomeScreen
              onCreateSession={connectToRoom}
              onJoinSession={connectToRoom}
              sendAction={sendAction}
            />
          </motion.div>
        )}

        {phase === "warmup" && (
          <motion.div
            key="warmup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <WarmUpPhase sendAction={sendAction} />
          </motion.div>
        )}

        {phase === "warmup-complete" && (
          <motion.div
            key="warmup-complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <WarmUpComplete sendAction={sendAction} />
          </motion.div>
        )}

        {phase === "museum-selection" && (
          <motion.div
            key="museum"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <MuseumSelectionPhase sendAction={sendAction} />
          </motion.div>
        )}

        {phase === "slot-machine" && (
          <motion.div
            key="slot-machine"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SlotMachinePhase sendAction={sendAction} />
          </motion.div>
        )}

        {phase === "drawing" && (
          <motion.div
            key="drawing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DrawingPhase sendAction={sendAction} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
