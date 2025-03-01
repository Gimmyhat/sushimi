import { NextResponse } from 'next/server';
import { createOrder, createOrderItems } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderData, orderItems } = body;
    
    if (!orderData || !orderItems || !Array.isArray(orderItems)) {
      return NextResponse.json(
        { error: 'Неверный формат данных заказа' },
        { status: 400 }
      );
    }
    
    // Создаем заказ
    const order = await createOrder(orderData);
    
    // Создаем элементы заказа
    const items = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    await createOrderItems(items);
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    );
  }
} 