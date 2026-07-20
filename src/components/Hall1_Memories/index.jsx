import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMuseumStore } from '../../store/museumStore';
import { photos } from '../../data/photos';
import { SpotlightFrame } from '../shared/SpotlightFrame';
import { DustParticles } from '../shared/DustParticles';

// A wrapper to animate in individual spotlight frames when they enter viewport
function AnimatedFrameWrapper({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      {children}
    </motion.div>
  );
}

export function Hall1_Memories({ onComplete }) {
  const setHall = useMuseumStore((state) => state.setHall);
  const filteredPhotos = photos.filter((p) => p.hall === 1);
  const [activePhotoId, setActivePhotoId] = useState(null);

  useEffect(() => {
    // Set active hall to 1 to fade BGM to 0.35
    setHall(1);
  }, [setHall]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100svh',
      backgroundColor: '#0d0b08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0',
      position: 'relative'
    }}>
      <DustParticles density="low" />

      {/* Hall 1 Top Ornament */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 50, zIndex: 2 }}>
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
          Hall I — Memories
        </h2>
      </div>

      {/* Stacked Photos List */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 80,
        zIndex: 2
      }}>
        {filteredPhotos.map((p, idx) => (
          <AnimatedFrameWrapper key={p.id} delay={0.15}>
            <SpotlightFrame
              photo={p.src}
              title={p.title}
              story={null}
              storyTamil={p.storyTamil}
              voiceSrc={null}
              hideHeading={true}
              expanded={activePhotoId === p.id}
              onTap={(isExpanding) => {
                setActivePhotoId(isExpanding ? p.id : null);
              }}
            />
          </AnimatedFrameWrapper>
        ))}
      </div>

      {/* Hall 1 Bottom Ornament & Proceed Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 80,
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
          <span>Proceed to Letters</span>
          <span className="font-tamil" style={{ fontSize: 10, letterSpacing: 1, textTransform: 'none', color: 'var(--color-gold-soft)', opacity: 0.8 }}>
            கடிதங்கள் பகுதிக்குச் செல்க
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export default Hall1_Memories;
