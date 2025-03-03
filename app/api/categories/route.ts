import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      data: categories,
      success: true
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категорий', success: false },
      { status: 500 }
    );
  }
} 