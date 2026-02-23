"use client";

import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/stores/appStore";

export default function Lightbox() {
  const artwork = useAppStore((s) => s.lightboxArtwork);
  const setLightboxArtwork = useAppStore((s) => s.setLightboxArtwork);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-8"
          onClick={() => setLightboxArtwork(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-white">
                {artwork.title}
              </p>
              <p className="text-xs text-white/70">{artwork.artist}</p>
            </div>
            <button
              onClick={() => setLightboxArtwork(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-lg font-bold hover:bg-white/80 transition-colors"
            >
              &times;
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
