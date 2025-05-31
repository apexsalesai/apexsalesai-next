"use client";
/**
 * Trust bar with stylized SVG customer/partner logos for credibility.
 */
export default function TrustBar() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 pt-10 pb-2 opacity-80 select-none">
      <svg width="90" height="30" viewBox="0 0 90 30"><circle cx="15" cy="15" r="13" fill="#00c2cb" opacity="0.18"/><circle cx="15" cy="15" r="8" fill="#00c2cb"/><text x="15" y="20" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">AIQ</text></svg>
      <svg width="90" height="30" viewBox="0 0 90 30"><rect x="10" y="5" width="70" height="20" rx="10" fill="#fff" opacity="0.1"/><text x="45" y="20" textAnchor="middle" fontSize="13" fill="#00c2cb" fontWeight="bold">DATAFLOW</text></svg>
      <svg width="90" height="30" viewBox="0 0 90 30"><ellipse cx="45" cy="15" rx="30" ry="13" fill="#00c2cb" opacity="0.13"/><ellipse cx="45" cy="15" rx="15" ry="8" fill="#00c2cb"/><text x="45" y="20" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">NEXUS</text></svg>
      <svg width="90" height="30" viewBox="0 0 90 30"><rect x="15" y="8" width="60" height="14" rx="7" fill="#00c2cb" opacity="0.14"/><rect x="30" y="12" width="30" height="6" rx="3" fill="#00c2cb"/><text x="45" y="20" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">QUANTIX</text></svg>
      <svg width="90" height="30" viewBox="0 0 90 30"><polygon points="45,5 65,25 25,25" fill="#00c2cb" opacity="0.15"/><polygon points="45,10 60,23 30,23" fill="#00c2cb"/><text x="45" y="20" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">SYNTH</text></svg>
    </div>
  );
}
