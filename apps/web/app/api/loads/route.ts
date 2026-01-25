import { NextResponse } from 'next/server';
import { TokenService } from '@lib/services/auth/tokenService';
import { DataverseApiService } from '@lib/services/dataverse/dataverseApi';

/**
 * API Route: /api/loads
 * Purpose: Demonstrates authenticated Dataverse query via TokenService
 */
export async function GET() {
  try {
    // TODO: Implement Auth0 session validation
    // For now, using demo user ID
    const userId = 1; // Demo user

    // Retrieve valid access token
    const tokenData = await TokenService.getValidToken(userId, 'dataverse');
    if (!tokenData || !tokenData.accessToken) {
      return NextResponse.json(
        { error: 'Failed to retrieve valid Dataverse token' },
        { status: 500 }
      );
    }

    // Query sample entity (e.g., accounts)
    const records = await DataverseApiService.query('accounts', {
      top: 5,
      select: ['name', 'accountid', 'emailaddress1'],
    });

    return NextResponse.json({
      message: 'Dataverse connection successful',
      records,
    });
  } catch (error: any) {
    console.error('Error in /api/loads route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
