import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      console.log('Запрос без slug параметра');
      return NextResponse.json(
        { success: false, error: 'Не указана категория', data: [] },
        { status: 400 }
      );
    }
    
    console.log(`API: Получаем продукты для категории ${slug}`);
    const products = await getProductsByCategory(slug);
    console.log(`API: Найдено ${products.length} продуктов для категории ${slug}`);
    
    return NextResponse.json({ 
      success: true, 
      data: products 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении продуктов по категории', data: [] },
      { status: 500 }
    );
  }
} 