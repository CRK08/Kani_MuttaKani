import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

export function SpotlightFrame({ photo, title, story, storyTamil, voiceSrc, onTap, hideHeading, expanded: expandedProp }) {
  const [isTouch, setIsTouch] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = expandedProp !== undefined ? expandedProp : localExpanded;

  const soundRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Triggered when voice notes fail to load/play - simulates narration with a gentle warm pad chord
  const playFallbackSynth = () => {
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

      // Gentle vocal-like hum chord progression
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(290, ctx.currentTime + 1.2);
      osc.frequency.linearRampToValueAtTime(270, ctx.currentTime + 2.5);
      osc.frequency.linearRampToValueAtTime(310, ctx.currentTime + 4.0);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

      osc.start();
      osc.stop(ctx.currentTime + 4.5);

      synthRef.current = {
        stop: () => {
          try {
            osc.stop();
            ctx.close();
          } catch (e) {}
        }
      };
    } catch (e) {
      console.warn("Synth fallback failed", e);
    }
  };

  useEffect(() => {
    // When expanded, play the voice note immediately
    if (isExpanded && voiceSrc) {
      soundRef.current = new Howl({
        src: [voiceSrc],
        html5: true,
        volume: 0.85,
        onloaderror: () => {
          console.warn(`Voice source failed to load: ${voiceSrc}. Using synth fallback.`);
        },
        onplayerror: () => {
          playFallbackSynth();
        }
      });

      try {
        soundRef.current.play();
        // If it fails to play due to being unloaded/unsupported
        if (soundRef.current.state() === 'unloaded') {
          playFallbackSynth();
        }
      } catch (e) {
        playFallbackSynth();
      }
    } else {
      // Clean up audio when collapsed
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [isExpanded, voiceSrc]);

  const cleanupAudio = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
    }
  };

  const handleTap = () => {
    const nextState = !isExpanded;
    if (expandedProp === undefined) {
      setLocalExpanded(nextState);
    }
    if (onTap) onTap(nextState);
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Blurred background glow behind the card (hidden on touchscreens for butter-smooth mobile FPS) */}
      {!isTouch && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          filter: 'blur(28px)',
          transform: isExpanded ? 'scale(1.16)' : 'scale(1.05)',
          opacity: isExpanded ? 0.55 : 0.28,
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          pointerEvents: 'none'
        }}>
          <img
            src={photo}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 4
            }}
          />
        </div>
      )}

      {/* Main card */}
      <motion.div
        onClick={handleTap}
        animate={isExpanded ? { scale: 1.03 } : { scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: 'fit-content',
          maxWidth: 'var(--photo-width)',
          backgroundColor: '#0a0906',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: isExpanded 
            ? '0 10px 30px rgba(201, 168, 76, 0.2)' 
            : '0 4px 20px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Dark overlay on photo that fades out when expanded */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <img
            src={photo}
            alt={title}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '70svh',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <motion.div
            animate={{ opacity: isExpanded ? 0 : 0.65 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Caption bar visible when collapsed */}
        {!isExpanded && !hideHeading && (
          <div style={{ 
            padding: '12px 16px', 
            textAlign: 'center', 
            borderTop: '1px solid rgba(201, 168, 76, 0.1)' 
          }}>
            <h3 style={{
              fontFamily: 'Cormorant Garamond',
              fontWeight: 400,
              fontSize: 18,
              color: 'var(--color-gold-soft)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              {title}
            </h3>
          </div>
        )}
      </motion.div>

      {/* Story Panel slides up below (no voice player button rendered) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              width: 'var(--photo-width)',
              overflow: 'hidden',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 8px',
              zIndex: 1
            }}
          >
            {!hideHeading && (
              <h3 style={{
                fontFamily: 'Cormorant Garamond',
                fontWeight: 400,
                fontSize: 22,
                color: 'var(--color-gold)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: 12
              }}>
                {title}
              </h3>
            )}

            {story && (
              <p style={{
                fontFamily: 'Cormorant Garamond',
                fontStyle: 'italic',
                fontSize: 17,
                color: 'var(--color-cream)',
                lineHeight: 1.5,
                maxWidth: '90%'
              }}>
                {story}
              </p>
            )}

            <p style={{
              fontFamily: 'Noto Serif Tamil',
              fontSize: 14,
              color: 'var(--color-cream)',
              lineHeight: 1.6,
              marginTop: story ? 10 : 0,
              maxWidth: '90%'
            }}>
              {storyTamil}
            </p>


            {voiceSrc && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{
                  fontFamily: 'Cormorant Garamond',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: 'var(--color-gold-soft)',
                  marginTop: 15,
                  letterSpacing: '1px'
                }}
              >
                Playing narration...
              </motion.div>
            )}
            
            <div style={{ 
              width: 30, 
              height: 1, 
              backgroundColor: 'rgba(201,168,76,0.2)', 
              marginTop: 20,
              marginBottom: 8
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SpotlightFrame;
