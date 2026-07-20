import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { useMuseumStore } from './store/museumStore';
import { Entrance } from './components/Entrance';
import Hall1_Memories from './components/Hall1_Memories';
import Hall2_Letters from './components/Hall2_Letters';
import Hall3_Future from './components/Hall3_Future';
import FinalHall from './components/FinalHall';

export function App() {
  const currentHall = useMuseumStore((state) => state.currentHall);
  const setHall = useMuseumStore((state) => state.setHall);

  useEffect(() => {
    // 1. Initialize Lenis scroll for a premium cinematic inertia feel
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Lock context menus and default select highlights to protect immersion
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    
    // 3. Prevent scroll jumping on back/forward reloads
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    return () => {
      lenis.destroy();
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const renderHall = () => {
    switch (currentHall) {
      case 0:
        return (
          <motion.div
            key="entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Entrance onEnter={() => setHall(1)} />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="hall1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Hall1_Memories onComplete={() => setHall(2)} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="hall2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Hall2_Letters onComplete={() => setHall(3)} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="hall3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Hall3_Future onComplete={() => setHall(4)} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <FinalHall />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100svh', 
      backgroundColor: '#0a0906',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <AnimatePresence mode="wait">
        {renderHall()}
      </AnimatePresence>
    </div>
  );
}

export default App;
