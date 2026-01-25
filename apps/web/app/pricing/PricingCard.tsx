"use client";
import { useState } from "react";

interface PricingCardProps {
  title: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  cta: string;
  bestValue?: boolean;
  custom?: boolean;
  isAnnual: boolean;
}

export default function PricingCard({
  title,
  priceMonthly,
  priceAnnual,
  features,
  cta,
  bestValue,
  custom,
  isAnnual,
}: PricingCardProps) {
  let price = custom ? "Custom" : isAnnual ? `$${priceAnnual.toLocaleString()}/yr` : `$${priceMonthly.toLocaleString()}/mo`;
  let priceNote = custom ? "Contact us" : isAnnual ? "Billed annually" : "Billed monthly";

  return (
    <div
      className={`bg-[#0d1321] rounded-xl p-8 flex flex-col items-center border ${bestValue ? 'border-4 border-[#00c2cb] shadow-lg scale-105' : 'border-[#00c2cb]/20'}`}
    >
      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
        {title}
        {bestValue && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-[#00c2cb] text-[#0d1321]">Best Value</span>
        )}
      </h3>
      <p className="text-4xl font-bold text-[#00c2cb] mb-1">{price}</p>
      <p className="text-xs text-[#cbd5e0] mb-4">{priceNote}</p>
      <ul className="mb-6 space-y-2 text-left text-[#cbd5e0]">
        {features.map((f, i) => (
          <li key={i}>✔️ {f}</li>
        ))}
      </ul>
      <button className="bg-[#00c2cb] text-[#0d1321] font-bold py-2 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300">{cta}</button>
    </div>
  );
}
