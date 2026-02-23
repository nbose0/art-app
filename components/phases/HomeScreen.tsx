"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAppStore } from "@/stores/appStore";
import type { HostAction } from "@/lib/partyMessages";

interface HomeScreenProps {
  onCreateSession: (roomId: string) => void;
  onJoinSession: (roomId: string) => void;
  sendAction: (action: HostAction) => void;
}

export default function HomeScreen({
  onCreateSession,
  onJoinSession,
  sendAction,
}: HomeScreenProps) {
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [roundDuration, setRoundDuration] = useState(75);

  const isConnected = useAppStore((s) => s.isConnected);
  const isHost = useAppStore((s) => s.isHost);
  const sessionCode = useAppStore((s) => s.sessionCode);
  const participantCount = useAppStore((s) => s.participantCount);

  const handleCreate = () => {
    // Generate a random room ID for PartyKit
    const roomId = `draw-${Math.random().toString(36).slice(2, 8)}`;
    setIsCreating(true);
    onCreateSession(roomId);
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    // Extract room ID from session code if needed
    onJoinSession(joinCode.trim().toLowerCase());
  };

  const handleStartWarmUp = () => {
    sendAction({ type: "start-warmup", roundDurationSeconds: roundDuration });
  };

  // Connected state — show session lobby
  if (isConnected && sessionCode) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Draw Together
            </h1>
            <p className="mt-2 text-muted">
              {isHost
                ? "Share this code with your friends!"
                : "Waiting for the host to start..."}
            </p>
          </div>

          {/* Session code display */}
          <div className="rounded-2xl bg-surface-alt p-6">
            <p className="text-sm font-medium text-muted uppercase tracking-wider">
              Session Code
            </p>
            <p className="mt-2 text-3xl font-mono font-bold text-primary tracking-widest">
              {sessionCode}
            </p>
            <p className="mt-3 text-sm text-muted">
              {participantCount} {participantCount === 1 ? "person" : "people"}{" "}
              connected
            </p>
          </div>

          {/* Host controls */}
          {isHost && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-surface-alt p-4">
                <label className="block text-sm font-medium text-muted mb-2">
                  Round Duration: {roundDuration}s
                </label>
                <input
                  type="range"
                  min={60}
                  max={90}
                  value={roundDuration}
                  onChange={(e) => setRoundDuration(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>60s</span>
                  <span>90s</span>
                </div>
              </div>

              <button
                onClick={handleStartWarmUp}
                className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Start Warm-Up
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Initial state — create or join
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div>
          <motion.h1
            className="text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Draw Together
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A virtual drawing get-together with warm-ups, museum inspiration,
            and timed drawing sessions.
          </motion.p>
        </div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Create session */}
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create a Session"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Join session */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter session code..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-center font-mono text-lg tracking-wider placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleJoin}
              disabled={!joinCode.trim()}
              className="rounded-2xl bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              Join
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
