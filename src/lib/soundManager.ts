// Simple sound system using Web Audio API for game sounds

type SoundType = 'win' | 'lose' | 'click' | 'cashout' | 'levelup' | 'start';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.3;

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('sound-enabled') !== 'false';
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-enabled', enabled.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Create different sound frequencies and patterns
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1.0) {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      const adjustedVolume = this.masterVolume * volume;
      gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // Play chord (multiple frequencies)
  private playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 1.0) {
    frequencies.forEach(freq => this.playTone(freq, duration, type, volume * 0.5));
  }

  play(sound: SoundType) {
    if (!this.enabled) return;

    switch (sound) {
      case 'win':
        // Happy ascending chord
        setTimeout(() => this.playChord([523.25, 659.25, 783.99], 0.3, 'sine', 0.8), 0);
        setTimeout(() => this.playChord([659.25, 783.99, 1046.50], 0.4, 'sine', 0.6), 150);
        break;

      case 'lose':
        // Sad descending tone
        this.playTone(392, 0.1, 'triangle', 0.6);
        setTimeout(() => this.playTone(349.23, 0.1, 'triangle', 0.6), 100);
        setTimeout(() => this.playTone(293.66, 0.3, 'triangle', 0.7), 200);
        break;

      case 'click':
        // Short click sound
        this.playTone(800, 0.05, 'square', 0.3);
        break;

      case 'cashout':
        // Cash register sound
        this.playTone(1046.50, 0.1, 'sine', 0.7);
        setTimeout(() => this.playTone(1318.51, 0.2, 'sine', 0.8), 50);
        break;

      case 'levelup':
        // Level up fanfare
        this.playChord([523.25, 659.25, 783.99], 0.2, 'sine', 0.6);
        setTimeout(() => this.playChord([659.25, 783.99, 987.77], 0.2, 'sine', 0.7), 150);
        setTimeout(() => this.playChord([783.99, 987.77, 1174.66], 0.3, 'sine', 0.8), 300);
        break;

      case 'start':
        // Game start sound
        this.playTone(440, 0.1, 'square', 0.5);
        setTimeout(() => this.playTone(554.37, 0.15, 'square', 0.6), 100);
        break;

      default:
        break;
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();
