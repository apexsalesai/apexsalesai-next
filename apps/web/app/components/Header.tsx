import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-6 px-4">
        <Link href="/" aria-label="ApexSalesAI Home" className="flex items-center">
          <Image src="/images/apex-logo.png" alt="ApexSalesAI" width={96} height={32} priority style={{ width: 'auto', height: 'auto' }} className="h-8 w-auto" />
        </Link>
        <ul className="hidden md:flex space-x-8 font-semibold">
          <li><Link href="/" className="text-[#0d1321] hover:text-[#00c2cb]">Home</Link></li>
          <li><Link href="/about" className="text-[#0d1321] hover:text-[#00c2cb]">About</Link></li>
          <li><Link href="/platform" className="text-[#0d1321] hover:text-[#00c2cb]">Platform</Link></li>
          <li><Link href="/pricing" className="text-[#0d1321] hover:text-[#00c2cb]">Pricing</Link></li>
          <li><Link href="/consulting" className="text-[#0d1321] hover:text-[#00c2cb]">Consulting</Link></li>
          <li><Link href="/demo" className="text-[#0d1321] hover:text-[#00c2cb]">Demo</Link></li>
          <li><Link href="/reseller" className="text-[#0d1321] hover:text-[#00c2cb]">Reseller</Link></li>
          <li><Link href="/onboarding" className="text-[#0d1321] hover:text-[#00c2cb]">Onboarding</Link></li>
          <li><Link href="/blog" className="text-[#0d1321] hover:text-[#00c2cb]">Blog</Link></li>
          <li><Link href="/contact" className="text-[#0d1321] hover:text-[#00c2cb]">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
