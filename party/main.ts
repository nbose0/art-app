import type * as Party from "partykit/server";
import type { HostAction, ServerMessage } from "../lib/partyMessages";
import type {
  SessionState,
  WarmUpRoundState,
  Artwork,
} from "../lib/types";
import { DEFAULT_SESSION_STATE } from "../lib/types";
import { shufflePrompts } from "../lib/prompts";
import { museums } from "../lib/museums";

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DRAW-${code}`;
}

export default class DrawTogetherServer implements Party.Server {
  state: SessionState;
  hostConnectionId: string | null = null;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  breatherTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(public room: Party.Room) {
    this.state = { ...DEFAULT_SESSION_STATE };
  }

  async onStart() {
    const saved = await this.room.storage.get<SessionState>("state");
    if (saved) {
      this.state = saved;
    }
    const savedHost = await this.room.storage.get<string>("hostConnectionId");
    if (savedHost) {
      this.hostConnectionId = savedHost;
    }
  }

  async saveState() {
    await this.room.storage.put("state", this.state);
  }

  broadcast(message: ServerMessage) {
    this.room.broadcast(JSON.stringify(message));
  }

  sendTo(conn: Party.Connection, message: ServerMessage) {
    conn.send(JSON.stringify(message));
  }

  updateParticipantCount() {
    let count = 0;
    for (const _conn of this.room.getConnections()) {
      count++;
    }
    this.state.participantCount = count;
    this.broadcast({ type: "participant-count", count });
  }

  async onConnect(conn: Party.Connection) {
    const isHost = this.hostConnectionId === null;

    if (isHost) {
      this.hostConnectionId = conn.id;
      this.state.hostId = conn.id;
      await this.room.storage.put("hostConnectionId", conn.id);
    }

    // Send role assignment
    this.sendTo(conn, {
      type: "role-assigned",
      isHost,
      sessionCode: this.room.id,
    });

    // Send current state
    this.sendTo(conn, { type: "state-sync", state: this.state });

    this.updateParticipantCount();
    await this.saveState();
  }

  async onClose(_conn: Party.Connection) {
    this.updateParticipantCount();

    // If host disconnects, pause the timer
    if (_conn.id === this.hostConnectionId) {
      this.stopTimer();
    }
    await this.saveState();
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    const text = typeof message === "string" ? message : new TextDecoder().decode(message);
    let action: HostAction;
    try {
      action = JSON.parse(text) as HostAction;
    } catch {
      this.sendTo(sender, { type: "error", message: "Invalid message format" });
      return;
    }

    // Only host can perform actions
    if (sender.id !== this.hostConnectionId) {
      this.sendTo(sender, { type: "error", message: "Only the host can perform actions" });
      return;
    }

    switch (action.type) {
      case "start-warmup":
        await this.handleStartWarmup(action.roundDurationSeconds);
        break;
      case "advance-round":
        await this.handleAdvanceRound();
        break;
      case "continue-to-museums":
        this.state.phase = "museum-selection";
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "select-museum":
        // Just broadcast the loading state — host fetches artworks client-side
        this.state.selectedMuseumId = action.museumId;
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "submit-artworks":
        // Host fetched artworks client-side, now we select 5 and broadcast
        await this.handleSubmitArtworks(action.museumId, action.artworks);
        break;
      case "random-museum": {
        const randomMuseum = museums[Math.floor(Math.random() * museums.length)];
        this.state.selectedMuseumId = randomMuseum.id;
        // Broadcast so client knows which museum was picked and can fetch
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      }
      case "start-drawing":
        this.state.phase = "drawing";
        this.state.timerTotalSeconds = 45 * 60;
        this.state.timerSecondsLeft = 45 * 60;
        this.state.timerRunning = true;
        this.startTimer();
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "set-timer":
        this.state.timerTotalSeconds = action.seconds;
        this.state.timerSecondsLeft = action.seconds;
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "pause-timer":
        this.state.timerRunning = false;
        this.stopTimer();
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "resume-timer":
        this.state.timerRunning = true;
        this.startTimer();
        this.broadcast({ type: "state-sync", state: this.state });
        break;
      case "back-to-museums":
        this.stopTimer();
        this.state.phase = "museum-selection";
        this.state.selectedMuseumId = null;
        this.state.fetchedArtworks = [];
        this.state.selectedArtworks = [];
        this.state.timerRunning = false;
        this.state.timerSecondsLeft = 0;
        this.state.timerTotalSeconds = 0;
        this.broadcast({ type: "state-sync", state: this.state });
        break;
    }

    await this.saveState();
  }

  async handleStartWarmup(roundDuration?: number) {
    const duration = roundDuration ?? this.state.warmUpConfig.roundDurationSeconds;
    this.state.warmUpConfig.roundDurationSeconds = duration;
    this.state.phase = "warmup";
    this.state.currentRound = 0;
    this.state.shuffledPromptIndices = shufflePrompts();
    this.state.roundState = "showing-prompt";
    this.state.timerTotalSeconds = duration;
    this.state.timerSecondsLeft = duration;
    this.state.timerRunning = false;

    this.broadcast({ type: "state-sync", state: this.state });

    // After 1 second delay, start the timer
    setTimeout(() => {
      this.state.roundState = "counting-down";
      this.state.timerRunning = true;
      this.startTimer();
      this.broadcast({
        type: "round-update",
        round: this.state.currentRound,
        roundState: this.state.roundState,
        timerSecondsLeft: this.state.timerSecondsLeft,
        timerTotalSeconds: this.state.timerTotalSeconds,
      });
    }, 1000);
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (!this.state.timerRunning || this.state.timerSecondsLeft <= 0) {
        this.stopTimer();
        return;
      }

      this.state.timerSecondsLeft--;
      this.broadcast({
        type: "timer-tick",
        secondsLeft: this.state.timerSecondsLeft,
      });

      if (this.state.timerSecondsLeft <= 0) {
        this.state.timerRunning = false;
        this.stopTimer();
        this.onTimerEnd();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onTimerEnd() {
    if (this.state.phase === "warmup") {
      // Timer ended for a warm-up round
      this.state.roundState = "breather";
      this.broadcast({ type: "state-sync", state: this.state });

      // After breather (4 seconds), advance to next round or complete
      this.breatherTimeout = setTimeout(() => {
        const nextRound = this.state.currentRound + 1;
        if (nextRound >= this.state.warmUpConfig.totalRounds) {
          // Warm-up is complete
          this.state.phase = "warmup-complete";
          this.broadcast({ type: "state-sync", state: this.state });
        } else {
          // Start next round
          this.state.currentRound = nextRound;
          this.state.roundState = "showing-prompt";
          this.state.timerSecondsLeft = this.state.warmUpConfig.roundDurationSeconds;
          this.state.timerTotalSeconds = this.state.warmUpConfig.roundDurationSeconds;
          this.state.timerRunning = false;
          this.broadcast({ type: "state-sync", state: this.state });

          // After 1 second, start timer
          setTimeout(() => {
            this.state.roundState = "counting-down";
            this.state.timerRunning = true;
            this.startTimer();
            this.broadcast({
              type: "round-update",
              round: this.state.currentRound,
              roundState: this.state.roundState,
              timerSecondsLeft: this.state.timerSecondsLeft,
              timerTotalSeconds: this.state.timerTotalSeconds,
            });
          }, 1000);
        }
      }, 4000);
    } else if (this.state.phase === "drawing") {
      // Drawing time is up
      this.broadcast({ type: "state-sync", state: this.state });
    }
  }

  async handleAdvanceRound() {
    // Skip to breather/next round immediately
    this.stopTimer();
    if (this.breatherTimeout) {
      clearTimeout(this.breatherTimeout);
      this.breatherTimeout = null;
    }

    const nextRound = this.state.currentRound + 1;
    if (nextRound >= this.state.warmUpConfig.totalRounds) {
      this.state.phase = "warmup-complete";
      this.broadcast({ type: "state-sync", state: this.state });
    } else {
      this.state.currentRound = nextRound;
      this.state.roundState = "showing-prompt";
      this.state.timerSecondsLeft = this.state.warmUpConfig.roundDurationSeconds;
      this.state.timerTotalSeconds = this.state.warmUpConfig.roundDurationSeconds;
      this.state.timerRunning = false;
      this.broadcast({ type: "state-sync", state: this.state });

      setTimeout(() => {
        this.state.roundState = "counting-down";
        this.state.timerRunning = true;
        this.startTimer();
        this.broadcast({
          type: "round-update",
          round: this.state.currentRound,
          roundState: this.state.roundState,
          timerSecondsLeft: this.state.timerSecondsLeft,
          timerTotalSeconds: this.state.timerTotalSeconds,
        });
      }, 1000);
    }
  }

  async handleSubmitArtworks(museumId: string, artworks: Artwork[]) {
    this.state.selectedMuseumId = museumId;
    this.state.fetchedArtworks = artworks;

    // Randomly select 5 artworks
    const shuffled = [...artworks].sort(() => Math.random() - 0.5);
    this.state.selectedArtworks = shuffled.slice(0, 5);

    this.state.phase = "slot-machine";
    this.broadcast({
      type: "artworks-selected",
      selected: this.state.selectedArtworks,
      all: this.state.fetchedArtworks,
    });
    this.broadcast({ type: "state-sync", state: this.state });

    await this.saveState();
  }
}
