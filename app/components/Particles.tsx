"use client";
import { useCallback, useEffect, useRef } from "react";

/**
 * Simple animated particles for hero background.
 * No external dependencies. Lightweight, performant.
 */
export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.2 + Math.random() * 2.2,
      dx: -0.2 + Math.random() * 0.4,
      dy: -0.15 + Math.random() * 0.3,
      o: 0.08 + Math.random() * 0.14
    }));
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0,194,203,${p.o})`;
        ctx.shadowColor = '#00c2cb';
        ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }, []);
  useEffect(() => {
    animate();
    window.addEventListener('resize', animate);
    return () => window.removeEventListener('resize', animate);
  }, [animate]);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{position:'absolute',top:0,left:0}} aria-hidden="true" />;
}
