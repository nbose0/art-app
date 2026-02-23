import { create } from "zustand";
import type { SessionState, Museum, Artwork } from "@/lib/types";
import { DEFAULT_SESSION_STATE } from "@/lib/types";

interface AppStore extends SessionState {
  // Local-only state (not synced)
  isHost: boolean;
  isConnected: boolean;
  sessionCode: string | null;
  hoveredMuseumId: string | null;
  lightboxArtwork: Artwork | null;

  // Actions
  syncState: (state: SessionState) => void;
  setTimerSecondsLeft: (seconds: number) => void;
  setIsHost: (isHost: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  setSessionCode: (code: string | null) => void;
  setHoveredMuseumId: (id: string | null) => void;
  setLightboxArtwork: (artwork: Artwork | null) => void;
  setParticipantCount: (count: number) => void;
  setArtworks: (selected: Artwork[], all: Artwork[]) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  ...DEFAULT_SESSION_STATE,

  // Local-only defaults
  isHost: false,
  isConnected: false,
  sessionCode: null,
  hoveredMuseumId: null,
  lightboxArtwork: null,

  syncState: (state) => set({ ...state }),

  setTimerSecondsLeft: (seconds) => set({ timerSecondsLeft: seconds }),

  setIsHost: (isHost) => set({ isHost }),

  setIsConnected: (connected) => set({ isConnected: connected }),

  setSessionCode: (code) => set({ sessionCode: code }),

  setHoveredMuseumId: (id) => set({ hoveredMuseumId: id }),

  setLightboxArtwork: (artwork) => set({ lightboxArtwork: artwork }),

  setParticipantCount: (count) => set({ participantCount: count }),

  setArtworks: (selected, all) =>
    set({ selectedArtworks: selected, fetchedArtworks: all }),

  reset: () =>
    set({
      ...DEFAULT_SESSION_STATE,
      isHost: false,
      isConnected: false,
      sessionCode: null,
      hoveredMuseumId: null,
      lightboxArtwork: null,
    }),
}));
