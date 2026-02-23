"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import type { Artwork } from "@/lib/types";

interface ArtworkSlotMachineProps {
  allArtworks: Artwork[];
  selectedArtworks: Artwork[];
  onComplete: () => void;
}

const ITEM_HEIGHT = 160;
const VISIBLE_ITEMS = 1;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const REPEATS = 4;

export default function ArtworkSlotMachine({
  allArtworks,
  selectedArtworks,
  onComplete,
}: ArtworkSlotMachineProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [slotsComplete, setSlotsComplete] = useState(0);

  // Build the strip for each slot: repeat all artworks, then place the winner at the end
  const strips = useMemo(() => {
    return selectedArtworks.map((winner) => {
      const others = allArtworks.filter((a) => a.id !== winner.id);
      const strip: Artwork[] = [];
      for (let r = 0; r < REPEATS; r++) {
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        strip.push(...shuffled);
      }
      // Place winner at the end
      strip.push(winner);
      return strip;
    });
  }, [allArtworks, selectedArtworks]);

  useEffect(() => {
    if (slotsComplete >= 5) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [slotsComplete, onComplete]);

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold text-foreground">
        {isAnimating ? "Selecting your references..." : "Your references!"}
      </h2>

      <div className="flex gap-4 flex-wrap justify-center">
        {strips.map((strip, slotIndex) => (
          <SlotColumn
            key={slotIndex}
            strip={strip}
            delay={slotIndex * 0.4}
            duration={2 + slotIndex * 0.5}
            onStop={() => setSlotsComplete((prev) => prev + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function SlotColumn({
  strip,
  delay,
  duration,
  onStop,
}: {
  strip: Artwork[];
  delay: number;
  duration: number;
  onStop: () => void;
}) {
  const totalHeight = strip.length * ITEM_HEIGHT;
  const targetY = -(totalHeight - VIEWPORT_HEIGHT);

  return (
    <div
      className="slot-viewport rounded-xl border-2 border-border bg-surface"
      style={{ height: VIEWPORT_HEIGHT, width: 140 }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: targetY }}
        transition={{
          delay,
          duration,
          ease: [0.15, 0.85, 0.35, 1.0],
        }}
        onAnimationComplete={onStop}
      >
        {strip.map((artwork, i) => (
          <div
            key={`${artwork.id}-${i}`}
            style={{ height: ITEM_HEIGHT }}
            className="flex items-center justify-center p-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.thumbnailUrl}
              alt={artwork.title}
              className="h-full w-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
