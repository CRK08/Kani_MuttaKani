import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function DustParticles({ density = 'low', color = '#c9a84c' }) {
  const counts = { low: 25, medium: 40, high: 55 };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles-dust"
      init={particlesInit}
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: counts[density] },
          size: { value: { min: 0.5, max: 1.5 } },
          color: { value: color },
          opacity: { value: { min: 0.05, max: 0.2 } },
          move: {
            enable: true,
            speed: 0.3,
            direction: 'none',
            random: true,
            straight: false,
          },
        },
        interactivity: { events: {} },
        background: { color: "transparent" },
        fullScreen: { enable: true, zIndex: 0 }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default DustParticles;
