"use client";
import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none select-none">
      <motion.div
        initial={{ y: 0, opacity: 0.7 }}
        animate={{ y: [0, 12, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <svg width="30" height="30" viewBox="0 0 30 30"><polyline points="8,12 15,20 22,12" fill="none" stroke="#00c2cb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </motion.div>
      <span className="text-xs text-[#00c2cb] mt-1 tracking-wider uppercase font-semibold">Scroll</span>
    </div>
  );
}
