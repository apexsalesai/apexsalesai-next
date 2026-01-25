import { motion } from 'framer-motion';

interface KPIBlockProps {
  title: string;
  value: string;
  trend: string;
  badgeColor?: string;
  highlight?: boolean; // Add highlight property for high-impact KPIs
}

import { useEffect, useRef, useState } from 'react';

export const KPIBlock = ({ title, value, trend, badgeColor = 'green', highlight = false }: KPIBlockProps) => {
  // Count-up animation for numbers (supports numbers with commas, %, $)
  const parseValue = (val: string) => {
    const n = parseFloat(val.replace(/[^\d.-]+/g, ''));
    return isNaN(n) ? 0 : n;
  };
  const formatValue = (val: number) => {
    if (value.includes('%')) return `${Math.round(val)}%`;
    if (value.includes('$')) return `$${Math.round(val).toLocaleString()}`;
    return Math.round(val).toLocaleString();
  };
  const [displayValue, setDisplayValue] = useState(parseValue(value));
  const prevValue = useRef(parseValue(value));
  useEffect(() => {
    let start = prevValue.current;
    let end = parseValue(value);
    let startTime: number | null = null;
    const duration = 800;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const curr = start + (end - start) * progress;
      setDisplayValue(curr);
      if (progress < 1) requestAnimationFrame(step);
      else prevValue.current = end;
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 0 32px 0 #38bdf8cc' }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border ${highlight ? 'border-cyan-500' : 'border-slate-700'} ${highlight ? 'shadow-cyan-500/20' : ''} hover:shadow-cyan-500/30 transition cursor-pointer focus-visible:outline-none`}
      tabIndex={0}
    >
      <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">{title}</p>
      <motion.p
        className={`${value.length > 10 ? 'text-2xl' : 'text-3xl'} font-bold text-cyan-300 drop-shadow truncate`}
        key={value}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        title={formatValue(displayValue)} // Add tooltip for truncated values
      >
        {formatValue(displayValue)}
      </motion.p>
      <motion.span
        className={`inline-block text-xs mt-2 px-2 py-1 rounded-full bg-${badgeColor}-600/20 text-${badgeColor}-300 font-semibold shadow-sm`}
        key={trend}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      >
        {trend}
      </motion.span>
    </motion.div>
  );
}
