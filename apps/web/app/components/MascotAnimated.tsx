"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const VALUE_CHIPS = [
  { text: "24/7 AI", color: "#00c2cb" },
  { text: "Enterprise-Ready", color: "#00e0e6" }
];

function GreetingSpeechBubble() {
  const phrases = [
    "Welcome to Autonomous Revenue.",
    "Ready to scale with AI?",
    "Let’s build the future of sales."
  ];
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [show, setShow] = useState(true);

  // Typewriter effect for each phrase
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let reveal = 0;
    setDisplayed("");
    setShow(true);
    function type() {
      if (reveal < phrases[index].length) {
        setDisplayed(prev => prev + phrases[index][reveal]);
        reveal++;
        timeout = setTimeout(type, 32);
      } else {
        timeout = setTimeout(() => setShow(false), 1200);
      }
    }
    type();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [index]);

  // When bubble fades out, advance to next phrase
  useEffect(() => {
    if (!show) {
      const t = setTimeout(() => {
        setIndex(i => (i + 1) % phrases.length);
        setShow(true);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [show, phrases.length]);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -top-8 bg-white bg-opacity-90 text-[#00c2cb] text-base px-4 py-1 rounded-full shadow-lg font-semibold pointer-events-none select-none"
      style={{whiteSpace:'nowrap', zIndex:30, opacity: show ? 1 : 0, transition: 'opacity 0.3s'}}
      aria-live="polite"
    >
      {displayed}
      <span className="blinking-cursor" style={{opacity: show && displayed.length < phrases[index].length ? 1 : 0}}>|</span>
      <style>{`.blinking-cursor { animation: blink 1s steps(1) infinite; } @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }`}</style>
    </div>
  );
}


export default function MascotAnimated() {
  return (
    <div className="absolute left-0 right-0 mx-auto top-4 z-20 flex flex-col items-center justify-center" style={{width: 340, height: 340}}>
      {/* Animated rotating halo ring */}
      <motion.div
        className="absolute rounded-full border-2 border-[#00c2cb80]"
        style={{width: 270, height: 270, borderColor: '#00c2cb80', borderWidth: 4, left: 35, top: 35, zIndex: 10}}
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />
      {/* Pulsing glow */}
      <motion.div
        className="absolute rounded-full bg-[#00c2cb] opacity-30 blur-2xl"
        style={{width: 210, height: 210, left: 65, top: 65, zIndex: 9}}
        animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      />
      {/* Mascot with floating, head nod, and overlays */}
      <motion.div
        initial={{ rotate: 0, y: 0, filter: 'drop-shadow(0 0 32px #00c2cb88)' }}
        animate={{
          rotate: [0, -10, 8, -5, 3, 0], // gentle nod/tilt
          y: [0, -32, 0],
          filter: ['drop-shadow(0 0 32px #00c2cb88)', 'drop-shadow(0 0 64px #00c2cbcc)', 'drop-shadow(0 0 32px #00c2cb88)']
        }}
        transition={{
          rotate: { duration: 2.2, ease: "easeInOut" },
          y: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2.2 },
          filter: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2.2 }
        }}
        className="relative z-20"
      >
        {/* Mascot image */}
        <Image src="/images/apex-logo.png" alt="Apex Logo Test" width={220} height={220} className="rounded-full shadow-2xl border-4 border-[#00c2cb] bg-white" priority />

        {/* Premium greeting speech bubble (fade/slide in, no typewriter) */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -36, -36, 0] }}
          transition={{ duration: 3.2, delay: 0.5 }}
          className="absolute left-1/2 -translate-x-1/2 -top-24 bg-white bg-opacity-95 text-[#00c2cb] text-lg px-6 py-2 rounded-full shadow-xl font-semibold pointer-events-none select-none"
          style={{whiteSpace:'nowrap', zIndex:30}}
        >
          Welcome to Autonomous Revenue.<br className="hidden md:inline" /> Let’s build the future of sales.
        </motion.div>
        {/* Floating value chips */}
        {/* 24/7 AI chip floats/orbits */}
        <motion.div
          className="absolute px-3 py-2 rounded-full text-base font-bold shadow-md select-none"
          style={{
            background: '#fff',
            color: VALUE_CHIPS[0].color,
            left: 110 + 120 * Math.cos(0), // right side
            top: 110 + 120 * Math.sin(0),
            zIndex: 15,
            border: `2px solid ${VALUE_CHIPS[0].color}`,
            opacity: 0.95
          }}
          animate={{
            x: [0, 12, 0, -12, 0],
            y: [0, 8, 0, -8, 0],
            scale: [1, 1.13, 1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          {VALUE_CHIPS[0].text}
        </motion.div>
        {/* Enterprise-Ready chip fixed below mascot (lapel area) */}
        <div
          className="absolute px-3 py-2 rounded-full text-base font-bold shadow-md select-none"
          style={{
            background: '#fff',
            color: VALUE_CHIPS[1].color,
            left: '50%',
            transform: 'translateX(-50%)',
            top: 245, // just below mascot image (220px tall + margin)
            zIndex: 15,
            border: `2px solid ${VALUE_CHIPS[1].color}`,
            opacity: 0.97
          }}
        >
          {VALUE_CHIPS[1].text}
        </div>
      </motion.div>
      {/* Floating sparkles */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{width: 180, height: 180, left: 0, top: 0}}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* 3 sparkles */}
        <span className="absolute left-8 top-8 w-2 h-2 bg-white rounded-full opacity-70 blur-[2px] animate-pulse" style={{animationDuration: '2.2s'}} />
        <span className="absolute right-10 top-12 w-1.5 h-1.5 bg-[#00c2cb] rounded-full opacity-60 blur-[1px] animate-pulse" style={{animationDuration: '3.1s'}} />
        <span className="absolute left-16 bottom-8 w-1 h-1 bg-white rounded-full opacity-50 blur-[1px] animate-pulse" style={{animationDuration: '2.7s'}} />
      </motion.div>
    </div>
  );
}
