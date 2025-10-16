'use client';

import React, { useEffect, useState } from 'react';

interface SuccessConfettiProps {
  show: boolean;
  message?: string;
}

export default function SuccessConfetti({ show, message = 'Success!' }: SuccessConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['#00c2cb', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Clear after animation
      setTimeout(() => setParticles([]), 3000);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Success Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] text-white px-8 py-4 rounded-full shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <span className="text-xl font-bold">{message}</span>
            <span className="text-3xl">✨</span>
          </div>
        </div>
      </div>

      {/* Confetti Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s'
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
