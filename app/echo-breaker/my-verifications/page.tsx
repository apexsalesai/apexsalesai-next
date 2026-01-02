import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import MyVerificationsClient from './MyVerificationsClient';
import { prisma } from '@/lib/prisma';

export default async function MyVerificationsPage() {
  // Get user ID from Entra ID session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get('entra_user_id')?.value;

  if (!userId) {
    redirect('/echo-breaker');
  }

  // Get user info
  const user = await prisma.echoBreakerUser.findUnique({
    where: { id: userId },
    select: { 
      name: true,
      subscriptionTier: true,
    },
  });

  // Fetch user's verifications
  const verifications = await prisma.verification.findMany({
    where: {
      userId,
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
      userName={user?.name || 'User'}
      subscriptionTier={user?.subscriptionTier || 'free'}
    />
  );
}
