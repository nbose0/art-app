export type AppPhase =
  | "home"
  | "warmup"
  | "warmup-complete"
  | "museum-selection"
  | "slot-machine"
  | "drawing";

export type WarmUpRoundState = "showing-prompt" | "counting-down" | "breather";

export interface DrawingPrompt {
  text: string;
  emoji: string;
}

export interface Museum {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  image: string;
  websiteUrl: string;
  description: string;
  apiSource: "met" | "artic" | "cleveland" | "rijks";
  apiParams?: Record<string, string | number>;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  date: string;
  imageUrl: string;
  thumbnailUrl: string;
  medium: string;
  sourceMuseum: string;
  sourceUrl: string;
}

export interface WarmUpConfig {
  roundDurationSeconds: number;
  totalRounds: number;
}

export interface SessionState {
  phase: AppPhase;
  // Warm-up
  currentRound: number;
  roundState: WarmUpRoundState;
  shuffledPromptIndices: number[];
  warmUpConfig: WarmUpConfig;
  timerSecondsLeft: number;
  timerTotalSeconds: number;
  timerRunning: boolean;
  // Museum selection
  selectedMuseumId: string | null;
  fetchedArtworks: Artwork[];
  selectedArtworks: Artwork[];
  // Session
  participantCount: number;
  hostId: string | null;
}

export const DEFAULT_SESSION_STATE: SessionState = {
  phase: "home",
  currentRound: 0,
  roundState: "showing-prompt",
  shuffledPromptIndices: [],
  warmUpConfig: { roundDurationSeconds: 75, totalRounds: 5 },
  timerSecondsLeft: 0,
  timerTotalSeconds: 0,
  timerRunning: false,
  selectedMuseumId: null,
  fetchedArtworks: [],
  selectedArtworks: [],
  participantCount: 0,
  hostId: null,
};
