"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/stores/appStore";
import { museums } from "@/lib/museums";
import MuseumCard from "@/components/museum/MuseumCard";
import type { HostAction } from "@/lib/partyMessages";
import type { Museum, Artwork } from "@/lib/types";

const MuseumMap = dynamic(() => import("@/components/museum/MuseumMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full animate-pulse rounded-2xl bg-surface-alt" />
  ),
});

interface MuseumSelectionPhaseProps {
  sendAction: (action: HostAction) => void;
}

export default function MuseumSelectionPhase({
  sendAction,
}: MuseumSelectionPhaseProps) {
  const isHost = useAppStore((s) => s.isHost);
  const hoveredMuseumId = useAppStore((s) => s.hoveredMuseumId);
  const setHoveredMuseumId = useAppStore((s) => s.setHoveredMuseumId);
  const selectedMuseumId = useAppStore((s) => s.selectedMuseumId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When a museum is selected (either by click or random), the host fetches artworks
  const fetchAndSubmitArtworks = useCallback(
    async (museumId: string) => {
      if (!isHost) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/museums/${museumId}/artworks`);
        if (!res.ok) throw new Error(`Failed to load artworks (${res.status})`);
        const artworks: Artwork[] = await res.json();
        if (artworks.length === 0) throw new Error("No artworks found for this museum");
        sendAction({ type: "submit-artworks", museumId, artworks });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load artworks");
        setIsLoading(false);
      }
    },
    [isHost, sendAction]
  );

  // React to selectedMuseumId changes (from random-museum or select-museum)
  useEffect(() => {
    if (selectedMuseumId && isHost && !isLoading) {
      fetchAndSubmitArtworks(selectedMuseumId);
    }
  }, [selectedMuseumId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMuseumClick = (museum: Museum) => {
    if (!isHost || isLoading) return;
    sendAction({ type: "select-museum", museumId: museum.id });
    fetchAndSubmitArtworks(museum.id);
  };

  const handleRandomMuseum = () => {
    if (isLoading) return;
    const randomMuseum = museums[Math.floor(Math.random() * museums.length)];
    sendAction({ type: "select-museum", museumId: randomMuseum.id });
    fetchAndSubmitArtworks(randomMuseum.id);
  };

  const handleMuseumHover = (museum: Museum | null) => {
    setHoveredMuseumId(museum?.id ?? null);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Choose a Museum
        </h2>
        <p className="text-muted">
          {isHost
            ? "Pick a museum to find your drawing references"
            : "The host is choosing a museum..."}
        </p>
      </div>

      {/* Map */}
      <div className="h-[350px] rounded-2xl overflow-hidden shadow-lg">
        <MuseumMap
          museums={museums}
          focusedMuseumId={hoveredMuseumId}
          onMuseumClick={isHost ? handleMuseumClick : undefined}
        />
      </div>

      {/* Random museum button (host only) */}
      {isHost && (
        <div className="text-center">
          <button
            onClick={handleRandomMuseum}
            disabled={isLoading}
            className="rounded-2xl bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Pick a random museum for me!"}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading artworks...
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center">
          <p className="text-sm text-danger">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(false);
            }}
            className="mt-2 text-sm text-primary hover:text-primary-hover"
          >
            Try again
          </button>
        </div>
      )}

      {/* Museum grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {museums.map((museum) => (
          <MuseumCard
            key={museum.id}
            museum={museum}
            isHost={isHost}
            onHover={handleMuseumHover}
            onClick={handleMuseumClick}
          />
        ))}
      </div>
    </div>
  );
}
