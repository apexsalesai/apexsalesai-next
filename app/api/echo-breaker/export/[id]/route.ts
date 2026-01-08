import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { canPerformAction } from '@/lib/subscription';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('entra_user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user subscription tier
    const user = await prisma.echoBreakerUser.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        monthlyExports: true,
        exportsCount: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 🔒 MONETIZATION GATE: Check if user can export PDFs
    if (!canPerformAction(user.subscriptionTier as any, 'canExportPDF')) {
      return NextResponse.json(
        {
          error: 'Upgrade required',
          message: 'PDF export is a Professional feature. Upgrade to unlock citation-ready exports.',
          requiredTier: 'professional',
          upgradeUrl: '/echo-breaker/upgrade',
        },
        { status: 403 }
      );
    }

    // Get verification
    const verification = await prisma.verification.findUnique({
      where: { verificationId: id },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    // Check ownership or public access
    if (!verification.isPublic && verification.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Track export event
    const exportEvent = {
      timestamp: new Date().toISOString(),
      userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const currentExportHistory = Array.isArray(verification.exportHistory)
      ? verification.exportHistory
      : [];

    // Update verification with export tracking
    await prisma.verification.update({
      where: { id: verification.id },
      data: {
        exportCount: { increment: 1 },
        lastExportedAt: new Date(),
        exportHistory: [...currentExportHistory, exportEvent] as any,
      },
    });

    // Update user export count
    await prisma.echoBreakerUser.update({
      where: { id: userId },
      data: {
        exportsCount: { increment: 1 },
        monthlyExports: { increment: 1 },
      },
    });

    // Return PDF data (will be generated on client side for now)
    // In production, you'd use a library like puppeteer or jsPDF server-side
    return NextResponse.json({
      success: true,
      verification: {
        id: verification.verificationId,
        claim: verification.claim,
        verdict: verification.verdict,
        verdictLabel: verification.verdictLabel,
        confidence: verification.confidence,
        confidenceBand: verification.confidenceBand,
        evidenceStrength: verification.evidenceStrength,
        summary: verification.summary,
        bottomLine: verification.bottomLine,
        evidenceShows: verification.evidenceShows,
        spreadFactors: verification.spreadFactors,
        sources: verification.sources,
        decisionPanel: verification.decisionPanel,
        createdAt: verification.createdAt,
      },
      exportEvent,
    });
  } catch (error: any) {
    console.error('Error exporting verification:', error);
    return NextResponse.json(
      { error: 'Failed to export verification', details: error.message },
      { status: 500 }
    );
  }
}
