import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent">
      <div
        className="h-full bg-cyber-green shadow-[0_0_8px_rgba(0,255,157,0.6)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
