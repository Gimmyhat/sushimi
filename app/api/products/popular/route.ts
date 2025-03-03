import { NextResponse } from 'next/server';
import { getPopularProducts } from '@/lib/db';

export async function GET() {
  try {
    const products = await getPopularProducts(4);
    return NextResponse.json({
      data: products,
      success: true
    });
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении популярных продуктов', success: false },
      { status: 500 }
    );
  }
} 