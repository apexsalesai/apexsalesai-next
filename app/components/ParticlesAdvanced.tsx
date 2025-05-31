"use client";
import { useRef, useEffect } from "react";

/**
 * Advanced AI node/connection particles for hero background.
 * Custom, performant, no external dependencies.
 */
export default function ParticlesAdvanced() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const NODES = 28;
    const nodes = Array.from({ length: NODES }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: -0.25 + Math.random() * 0.5,
      vy: -0.18 + Math.random() * 0.36,
      r: 2.2 + Math.random() * 1.6,
      o: 0.12 + Math.random() * 0.15
    }));
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      // Draw connections
      for (let i = 0; i < NODES; ++i) {
        for (let j = i + 1; j < NODES; ++j) {
          if (!ctx) return;
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0,194,203,${0.10 - dist/1200})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // Draw nodes
      for (const n of nodes) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0,194,203,${n.o})`;
        ctx.shadowColor = '#00c2cb';
        ctx.shadowBlur = 10;
        ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
      }
      requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{position:'absolute',top:0,left:0}} aria-hidden="true" />;
}
