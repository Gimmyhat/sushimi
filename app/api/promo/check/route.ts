import { NextResponse } from 'next/server';
import { checkPromoCode } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'Не указан промокод' },
        { status: 400 }
      );
    }
    
    const promo = await checkPromoCode(code);
    if (!promo) {
      return NextResponse.json(
        { error: 'Промокод недействителен или срок его действия истек' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(promo);
  } catch (error) {
    console.error('Error checking promo code:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке промокода' },
      { status: 500 }
    );
  }
} 