import { NextResponse } from 'next/server';
import { getPromotions } from '@/lib/db';

export async function GET() {
  try {
    const promotions = await getPromotions();
    return NextResponse.json({
      data: promotions,
      success: true
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении акций', success: false },
      { status: 500 }
    );
  }
} 