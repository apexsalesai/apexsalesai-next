import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('entra_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    // Get user from database
    const user = await prisma.EchoBreakerUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      // Clear invalid cookie
      cookieStore.delete('entra_user_id');
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ user: null });
  }
}
