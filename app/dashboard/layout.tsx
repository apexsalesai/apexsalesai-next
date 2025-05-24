'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
    </SessionProvider>
  );
}
