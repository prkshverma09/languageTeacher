"use client";

import { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  label: string;
  color: string;
}

export default function AudioWaveform({ isActive, label, color }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>(Array(50).fill(0.1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barsRef.current.length;
      const centerY = canvas.height / 2;

      barsRef.current.forEach((height, index) => {
        if (isActive) {
          // Animate with random wave motion when active
          barsRef.current[index] = Math.max(
            0.1,
            Math.min(1, height + (Math.random() - 0.5) * 0.3)
          );
        } else {
          // Gradually decrease when inactive
          barsRef.current[index] = Math.max(0.1, height * 0.95);
        }

        const barHeight = barsRef.current[index] * (canvas.height * 0.8);
        const x = index * barWidth;
        const y = centerY - barHeight / 2;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, color]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </p>
      <div className={`relative w-full rounded-lg overflow-hidden ${isActive ? 'bg-gray-800' : 'bg-gray-900'} p-4`}>
        <canvas
          ref={canvasRef}
          width={800}
          height={100}
          className="w-full h-24"
        />
      </div>
    </div>
  );
}
