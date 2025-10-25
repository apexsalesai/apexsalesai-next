/**
 * Phase 2 Telemetry System
 * Production-grade telemetry with Prisma integration
 */

import { PrismaClient } from '@prisma/client';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Generate or extract request ID for tracing
 */
export function getRequestId(headers: Headers): string {
  return headers.get('x-request-id') || crypto.randomUUID();
}

/**
 * Log metric event (tokens, latency, errors)
 */
export async function metric(
  name: string,
  value: number,
  dims: Record<string, any> = {},
  unit?: string
): Promise<void> {
  try {
    await prisma.metricEvent.create({
      data: {
        name,
        value,
        unit: unit || null,
        dims,
      },
    });
  } catch (error) {
    console.error('[Telemetry] Failed to log metric:', error);
  }
}

/**
 * Log audit trail event
 */
export async function audit(
  actorId: string,
  action: string,
  ref: { type: 'campaign' | 'agentTask' | 'asset'; id: string },
  details: Record<string, any> = {}
): Promise<void> {
  try {
    // Use existing AuditLog model (tenant-based)
    // For Phase 2, we'll log to console + MetricEvent
    console.log('[Audit]', { actorId, action, ref, details });
    
    await metric('audit.event', 1, {
      actorId,
      action,
      refType: ref.type,
      refId: ref.id,
      ...details,
    });
  } catch (error) {
    console.error('[Telemetry] Failed to log audit:', error);
  }
}

/**
 * Parse JSON body with validation
 */
export async function requireJson<T = any>(req: Request): Promise<T> {
  const ct = req.headers.get('content-type');
  if (!ct?.includes('application/json')) {
    throw new Response(
      JSON.stringify({ error: 'Content-Type must be application/json' }),
      { status: 415 }
    );
  }
  
  try {
    return (await req.json()) as T;
  } catch {
    throw new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 422 }
    );
  }
}

/**
 * Calculate word count
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculate character count (excluding whitespace)
 */
export function charCount(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * Calculate reading time (200 words per minute)
 */
export function readingTime(text: string): number {
  const words = wordCount(text);
  return Math.ceil(words / 200);
}

/**
 * Get content length limits based on target
 */
export function getContentLimits(targetLength: string): { min: number; max: number; tokens: number } {
  const limits = {
    short: { min: 300, max: 600, tokens: 800 },
    medium: { min: 800, max: 1200, tokens: 1600 },
    long: { min: 1500, max: 2000, tokens: 2600 },
    extended: { min: 2500, max: 4000, tokens: 5000 },
  };
  
  return limits[targetLength as keyof typeof limits] || limits.medium;
}

/**
 * Get platform character limits
 */
export function getPlatformLimits(platform: string): number {
  const limits: Record<string, number> = {
    twitter: 280,
    x: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
    email: 5000,
  };
  
  return limits[platform.toLowerCase()] || 3000;
}

/**
 * Log content generation event
 */
export async function logContentGeneration(data: {
  campaignId: string;
  type: string;
  wordCount: number;
  charCount: number;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  model: string;
}): Promise<void> {
  await metric('content.generated', 1, {
    campaignId: data.campaignId,
    type: data.type,
    wordCount: data.wordCount,
    charCount: data.charCount,
    model: data.model,
  });
  
  await metric('agent.tokens.in', data.tokensIn, {
    campaignId: data.campaignId,
    type: data.type,
  }, 'tokens');
  
  await metric('agent.tokens.out', data.tokensOut, {
    campaignId: data.campaignId,
    type: data.type,
  }, 'tokens');
  
  await metric('agent.latency', data.latencyMs, {
    campaignId: data.campaignId,
    type: data.type,
  }, 'ms');
}

/**
 * Get usage statistics
 */
export async function getUsageStats(userId: string, days: number = 30): Promise<{
  totalGenerations: number;
  totalTokens: number;
  avgLatency: number;
  successRate: number;
}> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const events = await prisma.metricEvent.findMany({
    where: {
      name: 'content.generated',
      createdAt: { gte: since },
    },
  });
  
  const totalGenerations = events.length;
  const totalTokens = events.reduce((sum, e) => {
    const dims = e.dims as any;
    return sum + (dims.tokensIn || 0) + (dims.tokensOut || 0);
  }, 0);
  
  const latencies = await prisma.metricEvent.findMany({
    where: {
      name: 'agent.latency',
      createdAt: { gte: since },
    },
  });
  
  const avgLatency = latencies.length > 0
    ? latencies.reduce((sum, e) => sum + e.value, 0) / latencies.length
    : 0;
  
  return {
    totalGenerations,
    totalTokens,
    avgLatency: Math.round(avgLatency),
    successRate: 100, // TODO: Calculate from error events
  };
}

/**
 * Get recent activity
 */
export async function getRecentActivity(limit: number = 10): Promise<Array<{
  id: string;
  action: string;
  timestamp: Date;
  details: any;
}>> {
  const events = await prisma.metricEvent.findMany({
    where: {
      name: 'audit.event',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return events.map(e => ({
    id: e.id,
    action: (e.dims as any).action || 'unknown',
    timestamp: e.createdAt,
    details: e.dims,
  }));
}
