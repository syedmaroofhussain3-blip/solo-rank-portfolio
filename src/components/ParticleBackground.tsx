import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      
      const size = Math.random() * 4 + 1;
      const isBlue = Math.random() > 0.5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = isBlue 
        ? 'hsl(200, 100%, 55%)' 
        : 'hsl(270, 70%, 45%)';
      particle.style.boxShadow = isBlue
        ? '0 0 10px hsl(200, 100%, 55%), 0 0 20px hsl(200, 100%, 55%)'
        : '0 0 10px hsl(270, 70%, 45%), 0 0 20px hsl(270, 70%, 45%)';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animation = `particle ${15 + Math.random() * 20}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particles-container"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;
