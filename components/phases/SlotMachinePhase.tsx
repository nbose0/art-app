"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import ArtworkSlotMachine from "@/components/museum/ArtworkSlotMachine";
import SelectedArtworks from "@/components/museum/SelectedArtworks";
import TimerEndCelebration from "@/components/shared/TimerEndCelebration";
import type { HostAction } from "@/lib/partyMessages";

interface SlotMachinePhaseProps {
  sendAction: (action: HostAction) => void;
}

export default function SlotMachinePhase({
  sendAction,
}: SlotMachinePhaseProps) {
  const [slotComplete, setSlotComplete] = useState(false);
  const fetchedArtworks = useAppStore((s) => s.fetchedArtworks);
  const selectedArtworks = useAppStore((s) => s.selectedArtworks);
  const isHost = useAppStore((s) => s.isHost);

  const handleSlotComplete = () => {
    setSlotComplete(true);
  };

  const handleStartDrawing = () => {
    sendAction({ type: "start-drawing" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8">
      <TimerEndCelebration trigger={slotComplete} />

      {!slotComplete ? (
        <ArtworkSlotMachine
          allArtworks={fetchedArtworks}
          selectedArtworks={selectedArtworks}
          onComplete={handleSlotComplete}
        />
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Your Drawing References
            </h2>
            <p className="mt-2 text-muted">
              These artworks will guide your drawing session
            </p>
          </div>
          <SelectedArtworks
            artworks={selectedArtworks}
            isHost={isHost}
            onStartDrawing={handleStartDrawing}
          />
        </div>
      )}
    </div>
  );
}
