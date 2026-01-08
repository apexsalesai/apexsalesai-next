import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * Database Healthcheck API
 * 
 * Tests PostgreSQL connectivity and returns response time
 * Used to verify database connection is working properly
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = Date.now();
  
  try {
    // Simple query to test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    const responseTime = Date.now() - startTime;
    
    return res.status(200).json({
      status: 'healthy',
      database: 'postgresql',
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database healthcheck failed:', error);
    
    return res.status(500).json({
      status: 'error',
      database: 'postgresql',
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    });
  }
}
