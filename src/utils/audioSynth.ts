// Lightweight Web Audio API atmospheric groove generator for vertical video playback
class ReelAudioEngine {
  private ctx: AudioContext | null = null;
  private intervalId: number | null = null;
  private isMuted = true;
  private step = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  public setMuted(muted: boolean, videoIndex = 0) {
    this.isMuted = muted;
    if (muted) {
      this.stopLoop();
    } else {
      this.startLoop(videoIndex);
    }
  }

  public startLoop(videoIndex = 0) {
    if (this.isMuted) return;
    this.stopLoop();
    const ctx = this.getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const scales = [
      [130.81, 155.56, 196.0, 233.08], // C minor 7
      [146.83, 174.61, 220.0, 261.63], // D minor 7
      [110.0, 130.81, 164.81, 196.0],  // A minor 7
      [123.47, 146.83, 185.0, 220.0],  // B minor 7
    ];
    const palette = scales[videoIndex % scales.length];

    const playTick = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      const freq = palette[this.step % palette.length];
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(620, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.055, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
      this.step += 1;
    };

    playTick();
    this.intervalId = window.setInterval(playTick, 460);
  }

  public stopLoop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const reelAudio = new ReelAudioEngine();
