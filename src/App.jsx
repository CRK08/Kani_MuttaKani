import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { useMuseumStore } from './store/museumStore';
import { Entrance } from './components/Entrance';

// Lazy loading other halls to optimize performance
const Hall1_Memories = lazy(() => import('./components/Hall1_Memories'));
const Hall2_Letters = lazy(() => import('./components/Hall2_Letters'));
const Hall3_Future = lazy(() => import('./components/Hall3_Future'));
const FinalHall = lazy(() => import('./components/FinalHall'));

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
            <Suspense fallback={null}>
              <Hall1_Memories onComplete={() => setHall(2)} />
            </Suspense>
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
            <Suspense fallback={null}>
              <Hall2_Letters onComplete={() => setHall(3)} />
            </Suspense>
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
            <Suspense fallback={null}>
              <Hall3_Future onComplete={() => setHall(4)} />
            </Suspense>
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
            <Suspense fallback={null}>
              <FinalHall />
            </Suspense>
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
