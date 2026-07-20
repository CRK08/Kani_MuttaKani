import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/museumStore';
import { DustParticles } from '../shared/DustParticles';
import signatureSvg from '../../assets/handwriting/signature.svg?raw';

import h4Page1 from '../../assets/handwriting/Hall 4/Hall 4 Letter 1.1.jpg';
import h4Page2 from '../../assets/handwriting/Hall 4/Hall 4 Letter 1.2.jpg';
import h4Page3 from '../../assets/handwriting/Hall 4/Hall 4 Letter 1.3.jpg';
import h4Page4 from '../../assets/handwriting/Hall 4/Hall 4 Letter 1.4.jpg';

const h4Slides = [h4Page1, h4Page2, h4Page3, h4Page4];

// Continuous Falling Fragments Sub-component (Sinking into the Center in spiral circular paths)
function FallingFragments() {
  const photoPool = Array.from({ length: 16 }, (_, i) => `photos/Kani/${i + 1}.jpg`);

  const createFragment = (id) => {
    const keyframesCount = 15;
    const xKeyframes = [];
    const yKeyframes = [];
    const rotateKeyframes = [];
    const scaleKeyframes = [];
    const opacityKeyframes = [];

    // Distribute starting position along a circular border outer perimeter (75vw / 75vh distance)
    const startAngle = Math.random() * Math.PI * 2;
    const spiralTurns = (1.5 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1) * Math.PI; // Spiral rotation
    const initialRotation = Math.random() * 360;

    for (let i = 0; i <= keyframesCount; i++) {
      const t = i / keyframesCount; // progress from 0 to 1
      const angle = startAngle + spiralTurns * t;
      // Exponential decay to center (0,0) to accelerate as it falls into the void
      const radiusX = 85 * Math.pow(1 - t, 1.2);
      const radiusY = 85 * Math.pow(1 - t, 1.2);
      
      xKeyframes.push(`${Math.cos(angle) * radiusX}vw`);
      yKeyframes.push(`${Math.sin(angle) * radiusY}vh`);
      rotateKeyframes.push(initialRotation + t * 360 * (spiralTurns > 0 ? 1 : -1));
      
      // Scale from 0.55 up to 0.85, then shrink to 0
      let scale = 0.55;
      if (t < 0.3) {
        scale = 0.55 + 0.3 * (t / 0.3);
      } else {
        scale = 0.85 * Math.pow(1 - (t - 0.3) / 0.7, 1.5);
      }
      scaleKeyframes.push(scale);

      // Opacity: quick fade in, sustain, and fade out at the center void
      let opacity = 0;
      if (t < 0.15) {
        opacity = (t / 0.15) * 0.75;
      } else if (t > 0.7) {
        opacity = 0.75 * (1 - (t - 0.7) / 0.3);
      } else {
        opacity = 0.75;
      }
      opacityKeyframes.push(opacity);
    }

    return {
      id,
      src: photoPool[id % photoPool.length],
      x: xKeyframes,
      y: yKeyframes,
      rotate: rotateKeyframes,
      scale: scaleKeyframes,
      opacity: opacityKeyframes,
      duration: 7.0 + Math.random() * 4.0,
      key: Math.random()
    };
  };

  const [fragments, setFragments] = useState(() => 
    Array.from({ length: 8 }, (_, i) => createFragment(i))
  );

  const handleComplete = (id) => {
    setFragments(prev => prev.map(f => f.id === id ? createFragment(id) : f));
  };

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {fragments.map(f => (
        <motion.div
          key={f.key}
          initial={{
            x: f.x[0],
            y: f.y[0],
            opacity: f.opacity[0],
            rotate: f.rotate[0],
            scale: f.scale[0]
          }}
          animate={{
            x: f.x,
            y: f.y,
            opacity: f.opacity,
            scale: f.scale,
            rotate: f.rotate
          }}
          transition={{
            duration: f.duration,
            ease: 'linear'
          }}
          onAnimationComplete={() => handleComplete(f.id)}
          style={{
            position: 'absolute',
            width: 60,
            height: 80,
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#000',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}
        >
          <img src={f.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      ))}
    </div>
  );
}

// Scattered Blurred Photo Collage Background Sub-component
function BlurredPhotoCollage() {
  const images = [
    { src: 'photos/Kani/5.jpg', top: '10%', left: '-5%', rot: -15, scale: 1.35, blur: 14, opacity: 0.22 },
    { src: 'photos/Kani/6.jpg', bottom: '8%', right: '-8%', rot: 22, scale: 1.45, blur: 16, opacity: 0.18 },
    { src: 'photos/Kani/7.jpg', top: '-5%', right: '-5%', rot: 12, scale: 1.25, blur: 12, opacity: 0.18 },
    { src: 'photos/Kani/8.jpg', bottom: '15%', left: '-8%', rot: -24, scale: 1.5, blur: 15, opacity: 0.22 }
  ];

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {images.map((img, idx) => (
        <motion.img
          key={idx}
          src={img.src}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: img.opacity }}
          transition={{ duration: 2.0, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: img.top,
            bottom: img.bottom,
            left: img.left,
            right: img.right,
            width: 200,
            height: 270,
            objectFit: 'cover',
            transform: `rotate(${img.rot}deg) scale(${img.scale})`,
            filter: `blur(${img.blur}px)`,
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
}

// Signature SVG path tracing
function SignatureReveal({ onComplete, forceComplete = false }) {
  const [startReveal, setStartReveal] = useState(forceComplete);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Extract the single path d attribute and bounds
  const strokeData = useMemo(() => {
    const dMatch = signatureSvg.match(/d="([^"]+)"/);
    if (!dMatch) return { d: '', viewBox: '0 0 1254 1254', width: 1254, height: 1254, minX: 0, minY: 0 };

    const d = dMatch[1];
    
    // Stack-safe coordinates bounds parser
    const numRegex = /[-+]?\d*\.?\d+/g;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let count = 0;
    
    let numbers = [];
    let match;
    while ((match = numRegex.exec(d)) !== null) {
      numbers.push(parseFloat(match[0]));
    }
    
    for (let i = 0; i < numbers.length - 1; i += 2) {
      const x = numbers[i];
      const y = numbers[i+1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      count++;
    }

    if (count === 0) {
      return { d, viewBox: '0 0 1254 1254', width: 1254, height: 1254, minX: 0, minY: 0 };
    }

    const pad = 15;
    const width = maxX - minX;
    const height = maxY - minY;
    
    return {
      d,
      minX,
      minY,
      width,
      height,
      viewBox: `${minX - pad} ${minY - pad} ${width + pad * 2} ${height + pad * 2}`
    };
  }, []);

  useEffect(() => {
    if (forceComplete) return;

    const timer = setTimeout(() => {
      setStartReveal(true);
      
      const completeTimer = setTimeout(() => {
        onCompleteRef.current?.();
      }, 5500); // 5.5s reveal duration

      return () => clearTimeout(completeTimer);
    }, 200);

    return () => clearTimeout(timer);
  }, [forceComplete]);

  if (!strokeData.d) {
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '25vw', maxWidth: 85, margin: '15px auto 0 auto', zIndex: 4 }}>
      <svg viewBox={strokeData.viewBox} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <clipPath id="sig-clip">
            <motion.rect
              x={strokeData.minX - 5}
              y={strokeData.minY - 5}
              height={strokeData.height + 10}
              initial={forceComplete ? { width: strokeData.width + 10 } : { width: 0 }}
              animate={startReveal ? { width: strokeData.width + 10 } : {}}
              transition={{
                duration: 5.5, // 5.5 seconds to draw
                ease: 'easeInOut'
              }}
            />
          </clipPath>
        </defs>
        
        <path
          d={strokeData.d}
          fill="#c9a84c"
          stroke="none"
          fillRule="evenodd"
          clipPath="url(#sig-clip)"
        />
      </svg>
    </div>
  );
}

export function FinalHall() {
  const setHall = useMuseumStore((state) => state.setHall);
  
  // Phases: 'falling' -> 'orb' -> 'transitioning-to-letter' -> 'letter-closed' -> 'letter-reveal' -> 'letter-view'
  const [phase, setPhase] = useState('falling');
  const [isOrbTapped, setIsOrbTapped] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [signatureTriggered, setSignatureTriggered] = useState(false);
  const [showNib, setShowNib] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    setHall(4);

    const timer = setTimeout(() => {
      setPhase('orb');
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [setHall]);

  const handleOrbTap = () => {
    if (isOrbTapped) return;
    setIsOrbTapped(true);
    setPhase('transitioning-to-letter');

    setTimeout(() => {
      setPhase('letter-closed');
    }, 1500);
  };

  const handleOpenLetter = () => {
    if (phase !== 'letter-closed') return;
    setPhase('letter-reveal');
  };

  const handleLetterRevealComplete = () => {
    setPhase('letter-view');
  };

  const handleSignatureComplete = () => {
    // Signature completes, experience stays active
  };

  useEffect(() => {
    if (phase === 'letter-reveal') {
      const timer = setTimeout(() => {
        handleLetterRevealComplete();
      }, 4600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Watch for slide changes. When user manually goes to the 4th slide (index 3), trigger the signature reveal process
  useEffect(() => {
    if (phase === 'letter-view' && currentSlide === 3 && !signatureTriggered) {
      setSignatureTriggered(true);
      setShowNib(true);
      setTimeout(() => {
        setShowNib(false);
        setShowSignature(true);
      }, 1200);
    }
  }, [phase, currentSlide, signatureTriggered]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    const swipeDistance = info.offset.x;
    
    if (swipeDistance < -swipeThreshold) {
      // Swiped left -> next page
      if (currentSlide < h4Slides.length - 1) {
        setSlideDirection(1);
        setCurrentSlide(prev => prev + 1);
      }
    } else if (swipeDistance > swipeThreshold) {
      // Swiped right -> prev page
      if (currentSlide > 0) {
        setSlideDirection(-1);
        setCurrentSlide(prev => prev - 1);
      }
    }
  };

  const showScatteredBackground = phase !== 'falling' && phase !== 'orb' && phase !== 'transitioning-to-letter';
  return (
    <div style={{
      width: '100%',
      minHeight: '100svh',
      backgroundColor: '#080706',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '24px 0'
    }}>
      <DustParticles density="medium" />

      {/* Revisit button (hidden after orb is opened/tapped) */}
      {['falling', 'orb'].includes(phase) && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 999
        }}>
          <motion.button
            onClick={() => setHall(3)}
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

      {/* Phase 1: Photos converging/sinking into the center from circular outer bounds */}
      {phase === 'falling' && <FallingFragments />}

      {/* Phase 3+: Scattered Blurred Photos Collage Background */}
      {showScatteredBackground && <BlurredPhotoCollage />}

      <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* Phase 2: Tap to Open Orb */}
        {phase === 'orb' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={handleOrbTap}
          >
            {/* Glowing Orb */}
            <motion.div
              animate={{
                scale: [1.0, 1.08, 1.0],
                boxShadow: [
                  '0 0 30px rgba(201, 168, 76, 0.35)',
                  '0 0 50px rgba(201, 168, 76, 0.55)',
                  '0 0 30px rgba(201, 168, 76, 0.35)'
                ]
              }}
              transition={{
                duration: 3.0,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201, 168, 76, 0.45) 0%, transparent 70%)',
                marginBottom: 16
              }}
            />

            <span style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 11,
              color: '#7a5f2a',
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}>
              Tap to open
            </span>
          </motion.div>
        )}

        {/* Phase 2b: Orb Tapped Transition */}
        {phase === 'transitioning-to-letter' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 14,
              color: 'var(--color-cream-dim)',
              textAlign: 'center'
            }}
          >
            Opening the chest of time...
          </motion.div>
        )}

        {/* Phases 4+: The Letter Card and Signature View */}
        {['letter-closed', 'letter-reveal', 'letter-view', 'nib-animation', 'signature-reveal'].includes(phase) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            {/* Persistent Letter Container (Prevents Flickers/Re-mounts) */}
            <div style={{ 
              position: 'relative', 
              width: 'var(--photo-width)', 
              margin: '0 auto', 
              zIndex: 3 
            }}>
              
              {/* Letter Backdrop Blur */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.1)',
                width: '100%',
                height: '100%',
                zIndex: -1,
                filter: 'blur(32px)',
                opacity: 0.4,
                pointerEvents: 'none'
              }}>
                <img src={h4Slides[currentSlide]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
              </div>

              {/* Glass Display Case frame style matching Hall 2 */}
              <motion.div
                onClick={handleOpenLetter}
                style={{
                  width: 'var(--photo-width)',
                  backgroundColor: 'rgba(16, 13, 7, 0.75)',
                  border: '1px solid rgba(201, 168, 76, 0.5)',
                  borderRadius: 4,
                  padding: '24px 16px',
                  zIndex: 2,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  cursor: phase === 'letter-closed' ? 'pointer' : (phase === 'letter-view' ? 'grab' : 'default'),
                  boxShadow: phase === 'letter-closed'
                    ? 'inset 0 0 20px rgba(201,168,76,0.03), 0 4px 20px rgba(0,0,0,0.3)'
                    : 'inset 0 0 40px rgba(201,168,76,0.15), 0 10px 40px rgba(201,168,76,0.1)'
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

                {/* Sliding Letter Images with mouse drag and touch swipe support */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  overflow: 'hidden', 
                  borderRadius: 4,
                  aspectRatio: '3/4.2', // Fixed aspect ratio prevents layout shift/jump when sliding
                  filter: phase === 'letter-closed' ? 'blur(6px)' : 'none',
                  transition: 'filter 1.5s ease-out'
                }}>
                  <AnimatePresence initial={false} custom={slideDirection}>
                    <motion.img
                      key={currentSlide}
                      src={h4Slides[currentSlide]}
                      custom={slideDirection}
                      draggable={false}
                      drag={phase === 'letter-view' ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.5}
                      onDragEnd={handleDragEnd}
                      initial={phase === 'letter-reveal' ? { clipPath: 'circle(0% at 50% 50%)', scale: 0.90, rotate: -3 } : { clipPath: 'circle(120% at 50% 50%)', scale: 1, rotate: 0 }}
                      animate={phase === 'letter-reveal' ? { clipPath: 'circle(120% at 50% 50%)', scale: 1, rotate: 0 } : {}}
                      transition={{
                        clipPath: { duration: 4.5, ease: 'easeOut' },
                        scale: { duration: 4.5, ease: 'easeOut' },
                        rotate: { duration: 4.5, ease: 'easeOut' }
                      }}
                      variants={{
                        enter: (dir) => ({
                          x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
                          opacity: 0
                        }),
                        center: {
                          x: 0,
                          opacity: 1
                        },
                        exit: (dir) => ({
                          x: dir < 0 ? '100%' : dir > 0 ? '-100%' : 0,
                          opacity: 0
                        })
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 4
                      }}
                      alt={`final letter page ${currentSlide + 1}`}
                    />
                  </AnimatePresence>

                  {/* Tap to open overlay (identical to Hall 2) */}
                  <AnimatePresence>
                    {phase === 'letter-closed' && (
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
                          borderRadius: 4,
                          zIndex: 10
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
                </div>
              </motion.div>
            </div>

            {/* Pagination dots indicators */}
            {['letter-reveal', 'letter-view'].includes(phase) && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                {h4Slides.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: idx === currentSlide ? 'var(--color-gold)' : 'rgba(201, 168, 76, 0.25)',
                      transition: 'background-color 0.3s ease',
                      boxShadow: idx === currentSlide ? '0 0 8px var(--color-gold)' : 'none'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Phase 4b: Pen nib dot indicator */}
            {showNib && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
                transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold)',
                  boxShadow: '0 0 10px var(--color-gold)',
                  marginTop: 20
                }}
              />
            )}

            {/* Signature Tracing */}
            {showSignature && (
              <div style={{ width: '100%', marginTop: 12 }}>
                <SignatureReveal 
                  onComplete={handleSignatureComplete} 
                  forceComplete={false} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FinalHall;
