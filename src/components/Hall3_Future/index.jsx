import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useMuseumStore } from '../../store/museumStore';
import { DustParticles } from '../shared/DustParticles';

// Sub-component for empty future frames
function FutureFrame({ title, originalTitle, message, messageTamil, onOpened, isOpen }) {
  const handleTap = () => {
    onOpened();
  };

  return (
    <motion.div
      onClick={handleTap}
      animate={{
        borderColor: isOpen ? 'var(--color-gold)' : 'rgba(201, 168, 76, 0.4)',
        boxShadow: isOpen
          ? '0 8px 30px rgba(201, 168, 76, 0.12), inset 0 0 20px rgba(201,168,76,0.05)'
          : '0 4px 12px rgba(0,0,0,0.4), inset 0 0 0px rgba(0,0,0,0)'
      }}
      transition={{ duration: 0.6 }}
      style={{
        width: 'var(--photo-width)',
        height: 180,
        backgroundColor: '#0a090c',
        border: '1px solid',
        borderRadius: 4,
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px), 
                          linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center',
        zIndex: 2
      }}
    >
      {/* Upper light beam */}
      <div style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 2,
        height: 60,
        background: `linear-gradient(to bottom, transparent, ${isOpen ? 'var(--color-gold)' : 'var(--color-gold-dim)'})`,
        pointerEvents: 'none'
      }} />

      {/* Spotlight cone */}
      <div style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 120,
        background: `radial-gradient(ellipse at 50% 0%, ${isOpen ? 'rgba(201, 168, 76, 0.25)' : 'rgba(201, 168, 76, 0.1)'} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {!isOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <h3 className="font-tamil" style={{
            fontSize: 15,
            fontWeight: 400,
            color: 'var(--color-gold-soft)',
            letterSpacing: 1,
            textAlign: 'center'
          }}>
            {title}
          </h3>
          <span style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 10,
            fontStyle: 'italic',
            color: 'var(--color-gold-dim)',
            marginTop: 10,
            letterSpacing: 1
          }}>
            Tap to write
          </span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 10
          }}
        >
          <p className="font-tamil" style={{
            fontSize: 13,
            color: 'var(--color-cream)',
            lineHeight: 1.6
          }}>
            "{messageTamil}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function Hall3_Future({ onComplete }) {
  const setHall = useMuseumStore((state) => state.setHall);
  const [activeFrameIdx, setActiveFrameIdx] = useState(null);
  const [hasOpenedFrames, setHasOpenedFrames] = useState({ 0: false, 1: false, 2: false });

  const allOpened = hasOpenedFrames[0] && hasOpenedFrames[1] && hasOpenedFrames[2];

  useEffect(() => {
    setHall(3);
  }, [setHall]);

  const handleFrameOpen = (index) => {
    setActiveFrameIdx(activeFrameIdx === index ? null : index);
    setHasOpenedFrames(prev => ({ ...prev, [index]: true }));
  };

  const framesData = [
    {
      title: "வருங்கால சாதனை",
      messageTamil: "இங்க இன்னும் எதுவும் எழுதல... ஏன்னா, உன்னோட மிகப் பெரிய சாதனைக்கு இன்னும் இடம் விட்டு வச்சிருக்கேன். அந்த நாள் தூரத்துல இல்ல. 🌸"
    },
    {
      title: "இன்னும் எட்டப்படாத கனவு",
      messageTamil: "சில கனவுகள் சீக்கிரம் நனவாகாது... அதனால அவை சிறியதாயும் மாறாது. ஒருநாள்... நீ அடைய நினைத்த வானத்தைத் தொட்டபோது, காத்திருந்த ஒவ்வொரு நாளும் அழகாகத் தோன்றும். ❤️"
    },
    {
      title: "இன்னும் எழுதப்படும் கதை",
      messageTamil: "இதுவரை நீ கடந்துவந்த ஒவ்வொரு அத்தியாயமும் அழகுதான்... ஆனா, இனிமேல் நீ எழுதப் போற அத்தியாயங்கள்தான் பேரழகு. உன்னோட சிறந்த கதை... இன்னும் தொடங்கவே இல்ல. ❤️"
    }
  ];
  return (
    <div style={{
      width: '100%',
      minHeight: '100svh',
      backgroundColor: '#0d1018',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <DustParticles density="medium" color="#a0b4d4" />

      {/* Revisit button (scrolls with page, hidden after all opened) */}
      {!allOpened && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 999
        }}>
          <motion.button
            onClick={() => setHall(2)}
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

      {/* Hall Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, zIndex: 2 }}>
        <div style={{ width: 60, height: 1, backgroundColor: 'rgba(160, 180, 212, 0.4)', marginBottom: 12 }} />
        <h2 style={{
          fontFamily: 'Cormorant Garamond',
          fontStyle: 'italic',
          fontSize: 13,
          color: '#a0b4d4',
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontWeight: 400
        }}>
          Hall III — Future
        </h2>
      </div>

      {/* Intro Text */}
      <div style={{
        textAlign: 'center',
        padding: '0 32px',
        marginBottom: 50,
        zIndex: 2,
        maxWidth: 450,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <p className="font-tamil" style={{
          fontSize: 13,
          color: 'rgba(160, 180, 212, 0.65)',
          lineHeight: 1.7
        }}>
          "சில சட்டகங்கள் காலியாக இருக்கின்றன. ஏனென்றால், அந்தக் கதை இன்னும் எழுதப்படுகிறது."
        </p>
      </div>

      {/* Stacked Empty Frames */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 60,
        width: '100%',
        marginBottom: 50
      }}>
        {/* Growing vertical line */}
        <div style={{
          position: 'absolute',
          top: 90,
          bottom: 90,
          width: 1,
          backgroundColor: 'rgba(201, 168, 76, 0.15)',
          zIndex: 1
        }} />

        <motion.div
          initial={{ height: 0 }}
          animate={allOpened ? { height: 'calc(100% - 180px)' } : { height: 0 }}
          transition={{ duration: 2.0, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 90,
            width: 1.5,
            background: 'linear-gradient(to bottom, var(--color-gold-dim), var(--color-gold), var(--color-gold-dim))',
            zIndex: 1,
            pointerEvents: 'none',
            boxShadow: '0 0 4px var(--color-gold)'
          }}
        />

        {framesData.map((f, idx) => (
          <FutureFrame
            key={idx}
            originalTitle={f.originalTitle}
            title={f.title}
            message={f.message}
            messageTamil={f.messageTamil}
            isOpen={activeFrameIdx === idx}
            onOpened={() => handleFrameOpen(idx)}
          />
        ))}
      </div>

      {/* Horizontal line */}
      {allOpened && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
            marginTop: 10,
            marginBottom: 30,
            zIndex: 2
          }}
        />
      )}


      {/* Proceed Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 40,
        zIndex: 2,
        width: '100%'
      }}>
        <div style={{ width: 60, height: 1, backgroundColor: 'rgba(160, 180, 212, 0.4)', marginBottom: 30 }} />

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
          <span>Proceed to Final Hall</span>
          <span className="font-tamil" style={{ fontSize: 10, letterSpacing: 1, textTransform: 'none', color: 'var(--color-gold-soft)', opacity: 0.8 }}>
            முடிவு பகுதிக்குச் செல்க
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export default Hall3_Future;
