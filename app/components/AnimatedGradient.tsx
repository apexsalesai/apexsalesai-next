"use client";
import { useEffect, useRef } from "react";

/**
 * Animated gradient overlay using CSS & JS for smooth color transitions.
 */
export default function AnimatedGradient() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let step = 0;
    const colors = [
      [13, 19, 33], // #0d1321
      [0, 194, 203], // #00c2cb
      [9, 16, 24],  // #091018
      [0, 168, 179] // #00a8b3
    ];
    const el = ref.current;
    function animate() {
      if (!el) return;
      step += 0.01;
      const c1 = colors[Math.floor(step)%colors.length];
      const c2 = colors[(Math.floor(step)+1)%colors.length];
      el.style.background = `linear-gradient(120deg, rgb(${c1.join(",")}), rgb(${c2.join(",")}) 100%)`;
      requestAnimationFrame(animate);
    }
    animate();
  }, []);
  return <div ref={ref} className="absolute inset-0 z-0 transition-all duration-1000 opacity-90" aria-hidden="true" />;
}
