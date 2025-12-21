import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import MyVerificationsClient from './MyVerificationsClient';

const prisma = new PrismaClient();

export default async function MyVerificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/echo-breaker');
  }

  // Fetch user's verifications
  const verifications = await prisma.verification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Limit to 50 most recent
  });

  return (
    <MyVerificationsClient
      verifications={verifications.map(v => ({
        id: v.id,
        verificationId: v.verificationId,
        claim: v.claim,
        verdict: v.verdict,
        verdictLabel: v.verdictLabel,
        confidence: v.confidence,
        confidenceBand: v.confidenceBand,
        createdAt: v.createdAt.toISOString(),
        viewCount: v.viewCount,
        shareCount: v.shareCount,
      }))}
      userName={session.user.name || 'User'}
    />
  );
}
