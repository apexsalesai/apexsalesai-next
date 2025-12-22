import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export async function POST(req: NextRequest) {
  try {
    // Get user ID from Entra ID session cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get('entra_user_id')?.value || null;
    
    const body = await req.json();
    
    const {
      claim,
      result,
    } = body;
    
    // Use authenticated user ID if available, otherwise null (anonymous)

    // Generate short verification ID for URLs
    const verificationId = nanoid(10); // e.g., "abc123xyz0"

    // Extract data from result (handle both old and new field names)
    const verdict = result.verdict?.classification || result.verdict?.verdictClassification || result.verdictClassification || 'UNKNOWN';
    const verdictLabel = getVerdictLabel(verdict);
    const confidence = result.verdict?.confidenceValue || result.confidenceValue || result.confidence || 0;
    const confidenceBand = result.verdict?.confidenceBand || getConfidenceBand(confidence);
    const evidenceStrength = result.verdict?.evidenceStrength || getEvidenceStrength(confidence);

    // Get IP and user agent for compliance tracking
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Save to database
    const verification = await prisma.verification.create({
      data: {
        verificationId,
        claim,
        verdict,
        verdictLabel,
        confidence,
        confidenceBand,
        evidenceStrength,
        summary: result.decisionPanel?.recommendedAction?.summary || result.summary || '',
        bottomLine: result.decisionPanel?.recommendedAction?.headline || result.bottomLine || null,
        evidenceShows: result.whatTheEvidenceShows || result.evidenceShows || [],
        spreadFactors: result.whyThisNarrativeSpread || result.spreadFactors || [],
        sources: result.sources || { tier1: [], tier2: [], tier3: [] },
        decisionPanel: result.decisionPanel || null,
        actionScenarios: result.actionScenarios || null,
        methodology: result.methodology || null,
        ipAddress,
        userAgent,
        isPublic: true,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      verificationId: verification.verificationId,
      url: `/echo-breaker/v/${verification.verificationId}`,
    });
  } catch (error: any) {
    console.error('Error saving verification:', error);
    return NextResponse.json(
      { error: 'Failed to save verification', details: error.message },
      { status: 500 }
    );
  }
}

// Helper functions
function getVerdictLabel(verdict: string): string {
  const v = verdict.toLowerCase();
  if (v.includes('not_supported') || v === 'false') {
    return 'Not Supported by Evidence';
  } else if (v.includes('substantiated') || v === 'true') {
    return 'Substantiated';
  } else {
    return 'Needs Context';
  }
}

function getConfidenceBand(confidence: number): string {
  if (confidence >= 0.85) return 'Very High';
  if (confidence >= 0.70) return 'High';
  if (confidence >= 0.50) return 'Medium';
  if (confidence >= 0.30) return 'Low';
  return 'Very Low';
}

function getEvidenceStrength(confidence: number): string {
  if (confidence >= 0.80) return 'Strong';
  if (confidence >= 0.60) return 'Medium–High';
  if (confidence >= 0.40) return 'Medium';
  return 'Weak';
}
