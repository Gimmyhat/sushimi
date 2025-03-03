import { NextRequest, NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    console.log(`API: Получаем продукты для категории ${slug}`);
    
    if (!slug) {
      console.log('Запрос без slug параметра');
      return NextResponse.json(
        { success: false, error: 'Не указана категория', data: [] },
        { status: 400 }
      );
    }
    
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