'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { DashboardTabs } from '@/components/DashboardTabs';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d1321]">
      <DashboardTabs />
    </div>
  );
}