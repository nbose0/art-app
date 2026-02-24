// Web Audio API sound synthesis for timer events
// No external audio files needed — all sounds are generated programmatically

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function resumeAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine"
): void {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/** Ascending two-note chime — played when timer starts */
export function playTimerStart(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.12, 0.2);
  playTone(ctx, 659.25, now + 0.13, 0.15, 0.2);
}

/** Soft single tone — 30 seconds remaining (warmup) */
export function playWarning30s(): void {
  const ctx = getAudioContext();
  playTone(ctx, 880, ctx.currentTime, 0.2, 0.15);
}

/** Two quick pulses — 10 seconds remaining (warmup) */
export function playWarning10s(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  playTone(ctx, 1046.5, now, 0.1, 0.15, "triangle");
  playTone(ctx, 1046.5, now + 0.18, 0.1, 0.15, "triangle");
}

/** Countdown tick with rising pitch — 5, 4, 3, 2, 1 */
export function playCountdownTick(secondsLeft: number): void {
  const ctx = getAudioContext();
  const freq = 600 + (5 - secondsLeft) * 100;
  playTone(ctx, freq, ctx.currentTime, 0.08, 0.18);
}

/** Three-note ascending arpeggio — timer complete */
export function playTimerEnd(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.15, 0.2);
  playTone(ctx, 659.25, now + 0.15, 0.15, 0.22);
  playTone(ctx, 783.99, now + 0.3, 0.25, 0.25);
}

/** Gentle bell — drawing phase milestone (10min, 5min, 1min) */
export function playDrawingMilestone(): void {
  const ctx = getAudioContext();
  playTone(ctx, 1174.66, ctx.currentTime, 0.4, 0.12);
}
