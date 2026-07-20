import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/museumStore';
import { DustParticles } from '../shared/DustParticles';
import hall2Letter from '../../assets/handwriting/Hall 2/Hall 2 Letter.jpg';

// Sub-component to handle the linear sweep write reveal
function LetterReveal({ imageSrc, startReveal }) {
  return (
    <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={startReveal ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ overflow: 'hidden' }}
      >
        <img
          src={imageSrc}
          style={{ width: '100%', borderRadius: 4, display: 'block' }}
          alt="handwritten letter"
        />
      </motion.div>

      {/* Writing cursor that moves left to right */}
      {startReveal && (
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 2,
            background: 'rgba(201, 168, 76, 0.7)',
            pointerEvents: 'none',
            boxShadow: '0 0 8px var(--color-gold)'
          }}
        />
      )}
    </div>
  );
}

// Sub-component for individual floating ambient words
function FloatingWord({ word, index }) {
  const duration = 8 + (index * 1.5) % 5;
  const startX = -40 + (index * 45) % 90;
  const startY = 10 + (index * 25) % 60;
  
  return (
    <motion.span
      className={index % 2 === 0 ? "" : "font-tamil"}
      animate={{
        x: [startX, startX + 15, startX - 15, startX],
        y: [startY, startY - 25, startY + 15, startY],
        rotate: [0, 4, -4, 0],
        opacity: [0.03, 0.12, 0.12, 0.03]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        fontFamily: index % 2 === 0 ? 'Cormorant Garamond' : 'Noto Serif Tamil',
        fontSize: 12,
        color: 'var(--color-gold)',
        pointerEvents: 'none',
        left: `${20 + (index * 18) % 60}%`,
        top: `${10 + (index * 15) % 70}%`,
      }}
    >
      {word}
    </motion.span>
  );
}

export function Hall2_Letters({ onComplete }) {
  const setHall = useMuseumStore((state) => state.setHall);
  const [opened, setOpened] = useState(false);
  const [startReveal, setStartReveal] = useState(false);

  useEffect(() => {
    setHall(2);
  }, [setHall]);

  const handleOpenLetter = () => {
    if (opened) return;
    setOpened(true);

    // Delay letter reveal start slightly for visual smoothness
    setTimeout(() => {
      setStartReveal(true);
    }, 400);
  };

  const ambientWords = ['அன்பு', 'Strength', 'பொறுமை', 'Kindness', 'வழிகாட்டல்', 'Grace', 'நம்பிக்கை', 'Devotion'];

  return (
    <div style={{
      width: '100%',
      minHeight: '100svh',
      backgroundColor: '#100d07',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <DustParticles density="low" />

      {/* Revisit button (scrolls with page, hidden after opened) */}
      {!opened && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 999
        }}>
          <motion.button
            onClick={() => setHall(1)}
            whileHover={{ scale: 1.15, color: 'var(--color-gold)' }}
            whileTap={{ scale: 0.90 }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gold-soft)',
              fontSize: 20,
              cursor: 'pointer',
              outline: 'none',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              opacity: 0.75
            }}
          >
            ←
          </motion.button>
        </div>
      )}

      {/* Ambient Words Layer (visible after opening) */}
      {opened && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {ambientWords.map((word, idx) => (
            <FloatingWord key={idx} word={word} index={idx} />
          ))}
        </div>
      )}

      {/* Hall Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, zIndex: 2 }}>
        <div style={{ width: 60, height: 1, backgroundColor: 'var(--color-gold-dim)', marginBottom: 12 }} />
        <h2 style={{
          fontFamily: 'Cormorant Garamond',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--color-gold-dim)',
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontWeight: 400
        }}>
          Hall II — Letters
        </h2>
      </div>

      {/* Intro Text */}
      <p style={{
        fontFamily: 'Cormorant Garamond',
        fontStyle: 'italic',
        fontSize: 16,
        color: 'var(--color-cream-dim)',
        textAlign: 'center',
        padding: '0 32px',
        marginBottom: 40,
        lineHeight: 1.5,
        zIndex: 2,
        maxWidth: 450
      }}>
        "Some things are easier written than spoken."
      </p>

      {/* Blurred background copy of the letter behind the display case */}
      <div style={{
        position: 'absolute',
        top: 180,
        width: 'var(--photo-width)',
        height: 380,
        zIndex: 1,
        filter: 'blur(32px)',
        transform: opened ? 'scale(1.1)' : 'scale(0.95)',
        opacity: opened ? 0.45 : 0.15,
        transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
        pointerEvents: 'none'
      }}>
        <img
          src={hall2Letter}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
        />
      </div>

      {/* Glass Display Case */}
      <motion.div
        onClick={handleOpenLetter}
        animate={{
          boxShadow: opened 
            ? 'inset 0 0 40px rgba(201,168,76,0.15), 0 10px 40px rgba(201,168,76,0.1)' 
            : 'inset 0 0 20px rgba(201,168,76,0.03), 0 4px 20px rgba(0,0,0,0.3)',
          borderColor: opened ? 'rgba(201, 168, 76, 0.5)' : 'rgba(201, 168, 76, 0.2)'
        }}
        transition={{ duration: 0.8 }}
        style={{
          width: 'var(--photo-width)',
          backgroundColor: 'rgba(16, 13, 7, 0.75)', // slightly darker backdrop to overlay blur nicely
          border: '1px solid',
          borderRadius: 4,
          padding: '24px 16px',
          cursor: opened ? 'default' : 'pointer',
          zIndex: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}
      >
        {/* Spotlighting gradient inside case */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 80%)',
          pointerEvents: 'none',
          borderRadius: 4
        }} />

        <div style={{ 
          width: '100%', 
          filter: opened ? 'none' : 'blur(6px)', 
          transition: 'filter 1.5s ease-out' 
        }}>
          <LetterReveal 
            imageSrc={hall2Letter} 
            startReveal={startReveal} 
          />
        </div>

        <AnimatePresence>
          {!opened && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(16, 13, 7, 0.4)',
                borderRadius: 4
              }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'Cormorant Garamond',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: 'var(--color-gold-soft)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(201,168,76,0.3)',
                  padding: '8px 16px',
                  borderRadius: 2,
                  backgroundColor: 'rgba(16, 13, 7, 0.8)'
                }}
              >
                Tap to open
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>



      {/* Proceed Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 60,
        zIndex: 2,
        width: '100%'
      }}>
        <div style={{ width: 60, height: 1, backgroundColor: 'var(--color-gold-dim)', marginBottom: 30 }} />
        
        <motion.button
          onClick={onComplete}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-gold)',
            padding: '14px 28px',
            borderRadius: 2,
            color: 'var(--color-gold)',
            fontFamily: 'Cormorant Garamond',
            fontSize: 13,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 0 10px rgba(201,168,76,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>Proceed to Future</span>
          <span className="font-tamil" style={{ fontSize: 10, letterSpacing: 1, textTransform: 'none', color: 'var(--color-gold-soft)', opacity: 0.8 }}>
            வருங்காலம் பகுதிக்குச் செல்க
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export default Hall2_Letters;
