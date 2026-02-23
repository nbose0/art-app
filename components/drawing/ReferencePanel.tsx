"use client";

import { motion } from "motion/react";
import type { Artwork } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";

interface ReferencePanelProps {
  artworks: Artwork[];
}

export default function ReferencePanel({ artworks }: ReferencePanelProps) {
  const setLightboxArtwork = useAppStore((s) => s.setLightboxArtwork);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {artworks.map((artwork, i) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group rounded-2xl overflow-hidden bg-surface shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="aspect-square w-full object-cover"
          />
          <div className="p-3 space-y-1">
            <p className="text-sm font-medium text-foreground leading-tight">
              {artwork.title}
            </p>
            <p className="text-xs text-muted">{artwork.artist}</p>
            {artwork.date && (
              <p className="text-xs text-muted">{artwork.date}</p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setLightboxArtwork(artwork)}
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
              >
                View Full Screen
              </button>
              <a
                href={artwork.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                Source
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
