"use client";
import { useState } from "react";

export default function AnnualBillingToggle({ onChange }: { onChange?: (isAnnual: boolean) => void }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <span className={`font-semibold ${!isAnnual ? 'text-[#00c2cb]' : 'text-[#cbd5e0]'}`}>Monthly</span>
      <button
        className={`w-14 h-8 rounded-full bg-[#23293a] relative transition-colors duration-200 focus:outline-none`}
        onClick={() => {
          setIsAnnual((prev) => {
            const next = !prev;
            onChange?.(next);
            return next;
          });
        }}
        aria-pressed={isAnnual}
        aria-label="Toggle annual billing"
      >
        <span
          className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-200 bg-[#00c2cb] ${isAnnual ? 'translate-x-6' : ''}`}
        />
      </button>
      <span className={`font-semibold ${isAnnual ? 'text-[#00c2cb]' : 'text-[#cbd5e0]'}`}>Annual <span className="text-xs">(Save 8%)</span></span>
    </div>
  );
}
