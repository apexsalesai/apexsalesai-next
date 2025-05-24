import { Inter } from 'next/font/google';
import Navbar from './Navbar';
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] });

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1321] text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
