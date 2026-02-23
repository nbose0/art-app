"use client";

import { motion } from "motion/react";
import type { Artwork } from "@/lib/types";

interface SelectedArtworksProps {
  artworks: Artwork[];
  isHost: boolean;
  onStartDrawing: () => void;
}

export default function SelectedArtworks({
  artworks,
  isHost,
  onStartDrawing,
}: SelectedArtworksProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {artworks.map((artwork, i) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl overflow-hidden bg-surface shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.thumbnailUrl}
              alt={artwork.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-medium text-foreground truncate">
                {artwork.title}
              </p>
              <p className="text-xs text-muted truncate">{artwork.artist}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {isHost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={onStartDrawing}
            className="rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Start Drawing!
          </button>
        </motion.div>
      )}
    </div>
  );
}
