import type { Artwork, SessionState } from "./types";

// Messages from host → PartyKit server
export type HostAction =
  | { type: "start-warmup"; roundDurationSeconds?: number }
  | { type: "advance-round" } // server auto-advances, but host can skip
  | { type: "continue-to-museums" }
  | { type: "select-museum"; museumId: string }
  | { type: "submit-artworks"; museumId: string; artworks: Artwork[] }
  | { type: "random-museum" }
  | { type: "start-drawing" }
  | { type: "set-timer"; seconds: number }
  | { type: "pause-timer" }
  | { type: "resume-timer" }
  | { type: "back-to-museums" };

// Messages from PartyKit server → all clients
export type ServerMessage =
  | { type: "state-sync"; state: SessionState }
  | { type: "timer-tick"; secondsLeft: number }
  | { type: "phase-change"; phase: SessionState["phase"] }
  | {
      type: "round-update";
      round: number;
      roundState: SessionState["roundState"];
      timerSecondsLeft: number;
      timerTotalSeconds: number;
    }
  | { type: "artworks-loaded"; artworks: Artwork[] }
  | { type: "artworks-selected"; selected: Artwork[]; all: Artwork[] }
  | { type: "participant-count"; count: number }
  | { type: "role-assigned"; isHost: boolean; sessionCode: string }
  | { type: "error"; message: string };
