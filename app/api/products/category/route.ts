import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Не указана категория' },
        { status: 400 }
      );
    }
    
    const products = await getProductsByCategory(slug);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении продуктов по категории' },
      { status: 500 }
    );
  }
} 