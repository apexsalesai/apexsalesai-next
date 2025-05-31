"use client";
import { motion } from "framer-motion";

export default function AnimatedCTA({ children, href, ...props }: { children: React.ReactNode, href: string, [key: string]: any }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05, boxShadow: "0 0 0 4px #00c2cb44" }}
      whileTap={{ scale: 0.96 }}
      className="btn-primary text-lg py-3 px-8 relative overflow-hidden group rounded-xl font-bold shadow-lg transition-all duration-300 bg-[#00c2cb] text-white hover:bg-[#009ca6] focus:ring-4 focus:ring-[#00c2cb]/30"
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <motion.span
          className="inline-block ml-2"
          initial={{ x: 0 }}
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M6 4l4 5-4 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.span>
      </span>
    </motion.a>
  );
}
