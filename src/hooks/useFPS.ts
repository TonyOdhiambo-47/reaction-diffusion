import { useState, useEffect, useRef } from 'react';

/**
 * Calculates FPS using rolling average of frame times.
 */
export function useFPS(isActive: boolean, sampleSize: number = 10): number {
  const [fps, setFps] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      frameTimesRef.current = [];
      lastFrameTimeRef.current = null;
      setFps(0);
      return;
    }

    const measureFrame = (currentTime: number) => {
      if (lastFrameTimeRef.current !== null) {
        const deltaTime = currentTime - lastFrameTimeRef.current;
        
        if (deltaTime > 1 && deltaTime < 1000) {
          frameTimesRef.current.push(deltaTime);
          
          if (frameTimesRef.current.length > sampleSize) {
            frameTimesRef.current.shift();
          }

          if (frameTimesRef.current.length > 0) {
            const avgDeltaTime =
              frameTimesRef.current.reduce((a, b) => a + b, 0) /
              frameTimesRef.current.length;
            setFps(Math.round(1000 / avgDeltaTime));
          }
        }
      }

      lastFrameTimeRef.current = currentTime;

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(measureFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, sampleSize]);

  return fps;
}
