import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import EchoBreakerVerificationView from './EchoBreakerVerificationView';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerificationPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch verification from database
  const verification = await prisma.verification.findUnique({
    where: { verificationId: id },
    include: { user: true },
  });

  if (!verification || !verification.isPublic) {
    notFound();
  }

  // Increment view count
  await prisma.verification.update({
    where: { id: verification.id },
    data: { viewCount: { increment: 1 } },
  });

  // Transform data for client component
  const result = {
    verdict: {
      verdictClassification: verification.verdict,
      confidenceValue: verification.confidence,
      evidenceStrength: verification.evidenceStrength,
    },
    summary: verification.summary,
    bottomLine: verification.bottomLine,
    evidenceShows: verification.evidenceShows,
    spreadFactors: verification.spreadFactors,
    sources: verification.sources as any,
    decisionPanel: verification.decisionPanel as any,
  };

  return (
    <EchoBreakerVerificationView
      claim={verification.claim}
      result={result}
      verificationId={verification.verificationId}
      createdAt={verification.createdAt.toISOString()}
      viewCount={verification.viewCount}
      userName={verification.user?.name}
    />
  );
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  const verification = await prisma.verification.findUnique({
    where: { verificationId: id },
  });

  if (!verification) {
    return {
      title: 'Verification Not Found | Echo Breaker',
    };
  }

  const truncatedClaim = verification.claim.length > 100 
    ? verification.claim.substring(0, 100) + '...' 
    : verification.claim;

  return {
    title: `${verification.verdictLabel}: "${truncatedClaim}" | Echo Breaker`,
    description: verification.summary,
    openGraph: {
      title: `${verification.verdictLabel}`,
      description: `"${truncatedClaim}" - ${verification.summary}`,
      type: 'article',
      url: `https://apexsalesai.com/echo-breaker/v/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${verification.verdictLabel}`,
      description: `"${truncatedClaim}"`,
    },
  };
}
