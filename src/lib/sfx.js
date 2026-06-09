// Pure Web Audio sound effects — no audio files. Sounds:
//   • playTypeKey — soft, short click for each letter as the intro types out
//   • playPop     — quick pop when the photo lands
//
// Browsers only unlock audio on a real activation gesture (click / key /
// touch — NOT scroll), so call unlockAudio() from one before playing.

let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

// Returns the context, nudging it awake if needed (sounds scheduled now still
// play once it finishes resuming).
function ready() {
  const c = getCtx();
  if (!c) return null;
  if (c.state !== "running") c.resume().catch(() => {});
  return c;
}

// Mono white-noise buffer. `shape(i, len)` optionally sculpts amplitude.
function noiseBuffer(c, seconds, shape) {
  const len = Math.max(1, Math.floor(c.sampleRate * seconds));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * (shape ? shape(i, len) : 1);
  }
  return buf;
}

// Unlock audio inside a user gesture: resume + prime with a silent buffer
// (priming is required on Safari/iOS — resuming alone leaves it muted).
export function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  try {
    const s = c.createBufferSource();
    s.buffer = c.createBuffer(1, 1, c.sampleRate);
    s.connect(c.destination);
    s.start(0);
  } catch {
    /* ignore */
  }
}

// Soft typewriter key — a very short, quiet click played once per letter as
// the intro text types out. A tiny band-passed noise "tick" with a fast decay
// (the key strike) plus a faint low thunk (the key bottoming out). Kept light
// so a whole paragraph of them reads as gentle typing, not a rattle. A small
// pitch jitter via `seed` keeps consecutive keys from sounding identical.
export function playTypeKey(seed = 0) {
  const c = ready();
  if (!c) return;
  const now = c.currentTime;
  const dur = 0.03;
  const detune = ((seed * 53) % 7) - 3; // -3..+3, cheap per-key variation

  // key strike — short filtered noise click
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2500 + detune * 90;
  bp.Q.value = 0.9;
  const g = c.createGain();
  g.gain.setValueAtTime(0.05, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(now);
  src.stop(now + dur);

  // faint low thunk — gives the click a little body
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180 + detune * 6, now);
  const og = c.createGain();
  og.gain.setValueAtTime(0.03, now);
  og.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
  osc.connect(og).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.03);
}

// Quick pop — a fast pitch-dropping blip plus a tiny high "tick" transient.
export function playPop() {
  const c = ready();
  if (!c) return;
  const now = c.currentTime;

  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(820, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, now);
  og.gain.exponentialRampToValueAtTime(0.5, now + 0.006);
  og.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  osc.connect(og).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.14);

  const tick = c.createBufferSource();
  tick.buffer = noiseBuffer(c, 0.03);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1500;
  const tg = c.createGain();
  tg.gain.setValueAtTime(0.3, now);
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  tick.connect(hp).connect(tg).connect(c.destination);
  tick.start(now);
  tick.stop(now + 0.03);
}
