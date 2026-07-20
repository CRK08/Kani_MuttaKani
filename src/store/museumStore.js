import { create } from 'zustand';
import { Howl } from 'howler';

// Check window to reuse BGM instance across Vite hot-reloads to avoid audio leaks/exhaustion
let bgm;
if (typeof window !== 'undefined') {
  if (window.__bgmInstance) {
    bgm = window.__bgmInstance;
  } else {
    bgm = new Howl({
      src: ['audio/bgm.mp3'],
      loop: true,
      volume: 0.25,
      preload: true,
      html5: false, // Disable HTML5 audio to enable seamless Web Audio API looping
      onloaderror: (id, err) => {
        console.warn("BGM failed to load. Using fallback audio.", err);
      }
    });
    window.__bgmInstance = bgm;
  }
} else {
  bgm = null;
}

const hallVolumes = {
  0: 0.25,   // Entrance — audible
  1: 0.25,   // Memories — constant
  2: 0.25,   // Letters — constant
  3: 0.25,   // Future — constant
  4: 0.25,   // Final — constant
};

let fadeInterval = null;

function fadeToVolume(target, duration = 2000) {
  // Clear any existing fades
  if (fadeInterval) clearInterval(fadeInterval);
  
  // If BGM failed to load or isn't playing, we just return
  if (!bgm || bgm.state() === 'unloaded') return;

  const start = bgm.volume();
  const steps = 40;
  const stepTime = duration / steps;
  const delta = (target - start) / steps;
  let i = 0;
  
  fadeInterval = setInterval(() => {
    i++;
    const nextVol = Math.max(0, Math.min(1, start + delta * i));
    bgm.volume(nextVol);
    if (i >= steps) {
      clearInterval(fadeInterval);
    }
  }, stepTime);
}

export const useMuseumStore = create((set, get) => ({
  currentHall: 0,
  bgmStarted: false,

  startBGM: () => {
    if (!bgm.playing()) {
      try {
        bgm.play();
        set({ bgmStarted: true });
        console.log("BGM started successfully.");
      } catch (e) {
        console.error("Failed to play BGM:", e);
      }
    }
  },

  setHall: (hall) => {
    set({ currentHall: hall });
    fadeToVolume(hallVolumes[hall]);
    console.log(`Transitioned to Hall ${hall}. BGM volume fading to ${hallVolumes[hall]}`);
  },

  fadeOutBGM: () => {
    // Keep BGM playing continuously
    console.log("BGM configured to loop indefinitely.");
  },
}));
