import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';

export function VoicePlayer({ src, label }) {
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      html5: true,
      onloaderror: () => {
        console.warn(`Audio source "${src}" failed to load. Synthesizer fallback enabled.`);
      },
      onplayerror: (id, err) => {
        console.warn(`Playback error for "${src}". Synthesizer fallback triggered.`, err);
        playFallback();
      }
    });

    soundRef.current.on('end', () => setPlaying(false));

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [src]);

  const playFallback = () => {
    if (synthRef.current) synthRef.current.stop();
    
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      // Gentle soft vocal hum simulation
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 1);
      osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 2);
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 3.5);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
      
      osc.start();
      osc.stop(ctx.currentTime + 4);
      
      const timeout = setTimeout(() => {
        setPlaying(false);
        ctx.close();
      }, 4000);
      
      synthRef.current = {
        stop: () => {
          clearTimeout(timeout);
          try {
            osc.stop();
            ctx.close();
          } catch(e){}
        }
      };
    } catch(e) {
      setPlaying(false);
    }
  };

  const toggle = () => {
    if (playing) {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      } else {
        soundRef.current.pause();
      }
      setPlaying(false);
    } else {
      setPlaying(true);
      
      // If sound loaded successfully, play it. Otherwise, use synthesizer.
      if (soundRef.current && soundRef.current.state() === 'loaded') {
        try {
          soundRef.current.play();
        } catch (e) {
          playFallback();
        }
      } else {
        // Attempt play, which triggers onplayerror -> playFallback if unavailable
        try {
          soundRef.current.play();
          // If it didn't throw and is in loading state, wait. But if it's unloaded, play synth
          if (soundRef.current.state() === 'unloaded') {
            playFallback();
          }
        } catch (e) {
          playFallback();
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {label && (
        <span style={{
          fontFamily: 'Cormorant Garamond',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--color-cream-dim)',
          letterSpacing: '1px'
        }}>
          {label}
        </span>
      )}
      <motion.button
        onClick={toggle}
        animate={{
          boxShadow: playing ? '0 0 0 10px rgba(201, 168, 76, 0.25)' : '0 0 0 0px rgba(201, 168, 76, 0)',
          scale: playing ? 1.05 : 1
        }}
        transition={{
          boxShadow: { duration: 0.8, repeat: playing ? Infinity : 0, repeatType: 'reverse', ease: 'easeInOut' },
          scale: { duration: 0.2 }
        }}
        style={{
          background: 'transparent',
          border: '1px solid var(--color-gold)',
          borderRadius: '50%',
          width: 52,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-gold)',
          fontSize: 18,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'inset 0 0 8px rgba(201,168,76,0.1)'
        }}
      >
        {playing ? '⏸' : '▶'}
      </motion.button>
    </div>
  );
}

export default VoicePlayer;
