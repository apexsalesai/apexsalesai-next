"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MascotAnimated() {
  return (
    <motion.div
      className="absolute left-0 right-0 mx-auto top-8 z-20"
      animate={{
        y: [0, -16, 0],
        boxShadow: [
          '0 0 40px 10px #00c2cb66',
          '0 0 80px 25px #00c2cb88',
          '0 0 40px 10px #00c2cb66'
        ],
        filter: [
          'drop-shadow(0 0 16px #00c2cb99)',
          'drop-shadow(0 0 32px #00c2cbcc)',
          'drop-shadow(0 0 16px #00c2cb99)'
        ]
      }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      <Image src="/images/max-avatar.png" alt="Max Mascot" width={110} height={110} className="rounded-full shadow-2xl border-4 border-[#00c2cb] bg-white" priority />
    </motion.div>
  );
}
