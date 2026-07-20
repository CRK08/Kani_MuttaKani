import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useMuseumStore } from '../../store/museumStore';
import { DustParticles } from '../shared/DustParticles';

export function Entrance({ onEnter }) {
  const [step, setStep] = useState(0);
  const [entering, setEntering] = useState(false);
  const startBGM = useMuseumStore((state) => state.startBGM);



  useEffect(() => {
    // Attempt to start BGM immediately on mount
    startBGM();

    // Preload heavy museum assets in the background immediately on mount
    const imageUrls = [
      'photos/museum_exterior.png',
      ...Array.from({ length: 16 }, (_, i) => `photos/Kani/${i + 1}.jpg`)
    ];
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    const audioUrls = [];
    audioUrls.forEach((url) => {
      fetch(url).catch(() => {});
    });

    // 0: empty
    // 1: Line 1 fades in (2s -> 5.5s)
    // 2: Line 2 fades in (6s -> 9.5s)
    // 3: Name fades in (10s -> 14s)
    // 4: Museum photo & Enter dot fade in (15s+)
    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => setStep(2), 6000);
    const t3 = setTimeout(() => setStep(3), 10000);
    const t4 = setTimeout(() => setStep(4), 15000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [startBGM]);

  // Trigger BGM programmatically as soon as the name "KANIMOZHI" appears
  useEffect(() => {
    if (step === 3) {
      startBGM();
    }
  }, [step, startBGM]);

  // Global user interaction listener to bypass browser audio autoplay restrictions
  useEffect(() => {
    const playOnInteraction = () => {
      startBGM();
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
      window.removeEventListener('mousedown', playOnInteraction);
      window.removeEventListener('pointerdown', playOnInteraction);
      window.removeEventListener('keydown', playOnInteraction);
    };

    window.addEventListener('click', playOnInteraction);
    window.addEventListener('touchstart', playOnInteraction);
    window.addEventListener('mousedown', playOnInteraction);
    window.addEventListener('pointerdown', playOnInteraction);
    window.addEventListener('keydown', playOnInteraction);

    return () => {
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
      window.removeEventListener('mousedown', playOnInteraction);
      window.removeEventListener('pointerdown', playOnInteraction);
      window.removeEventListener('keydown', playOnInteraction);
    };
  }, [startBGM]);

  const handleEnterClick = () => {
    if (entering) return;
    setEntering(true);

    // Make sure BGM is playing
    startBGM();

    // Navigate to Hall 1 after 3s
    setTimeout(() => {
      onEnter();
    }, 3000);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'var(--hall-height)',
      backgroundColor: 'var(--color-black)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      zIndex: 1
    }}>
      <DustParticles density="low" />

      {/* Screen flash on enter transition */}
      <AnimatePresence>
        {entering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#0a0906',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        
        {/* Line 1: Every museum preserves something precious. */}
        {step === 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              times: [0, 0.45, 0.8, 1],
              duration: 3.5,
              ease: 'easeInOut'
            }}
            style={{
              fontFamily: 'Cormorant Garamond',
              fontStyle: 'italic',
              fontSize: 17,
              color: 'var(--color-cream)',
              textAlign: 'center',
              lineHeight: 1.6,
              position: 'absolute'
            }}
          >
            "Every museum preserves something precious."
          </motion.p>
        )}

        {/* Line 2: இந்த ஒன்று நினைவுகளை காக்கிறது. */}
        {step === 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              times: [0, 0.45, 0.8, 1],
              duration: 3.5,
              ease: 'easeInOut'
            }}
            className="font-tamil"
            style={{
              fontSize: 17,
              color: 'var(--color-cream)',
              textAlign: 'center',
              lineHeight: 1.8,
              position: 'absolute'
            }}
          >
            "இந்த ஒன்று நினைவுகளை காக்கிறது."
          </motion.p>
        )}

        {/* Line 3: KANIMOZHI */}
        {step === 3 && (
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '4px' }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              letterSpacing: ['4px', '8px', '8px', '12px']
            }}
            transition={{
              times: [0, 0.35, 0.75, 1],
              duration: 4.5,
              ease: 'easeInOut'
            }}
            style={{
              fontFamily: 'Cormorant Garamond',
              fontWeight: 300,
              fontSize: 38,
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              textAlign: 'center',
              position: 'absolute'
            }}
          >
            KANIMOZHI
          </motion.h1>
        )}

        {/* Line 4: Full screen image & Enter dot */}
        {step === 4 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* Museum Exterior Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ duration: 3.0, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(photos/museum_exterior.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, transparent 20%, #0a0906 100%)',
              pointerEvents: 'none'
            }} />

            {/* Enter Button Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '15%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 3
              }}
              onClick={handleEnterClick}
            >
              {/* Pulsing Gold Dot */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 0 0px rgba(201, 168, 76, 0.4)',
                    '0 0 0 12px rgba(201, 168, 76, 0)',
                    '0 0 0 0px rgba(201, 168, 76, 0)'
                  ]
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold)',
                  marginBottom: 12
                }}
              />

              {/* Enter text */}
              <span style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 12,
                color: 'var(--color-gold-dim)',
                letterSpacing: 4,
                textTransform: 'uppercase',
                fontWeight: 500
              }}>
                enter
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Entrance;
