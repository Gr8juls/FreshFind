import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // In a real app, we would get the userId from the session/JWT.
  // We'll mock the first user found or return a dummy response for demo purposes.
  
  try {
    let loyalty = await prisma.loyaltyAccount.findFirst({
      include: {
        user: {
          select: { fullName: true }
        }
      }
    });
    
    // If no data exists, return mock data
    if (!loyalty) {
      return NextResponse.json({
        id: 'mock-123',
        points: 450,
        badgeTier: 'Waste Warrior',
        mealsRescued: 15,
        co2SavedKg: 22.5,
        user: {
          fullName: 'Test Customer'
        }
      });
    }

    return NextResponse.json(loyalty);
  } catch (error) {
    console.error('Loyalty fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch loyalty account' }, { status: 500 });
  }
}
