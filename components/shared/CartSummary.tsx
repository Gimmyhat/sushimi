"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"

interface CartSummaryProps {
  onClose?: () => void
}

export default function CartSummary({ onClose }: CartSummaryProps) {
  const { items, subtotal } = useCart()
  
  // Рассчитываем стоимость доставки (бесплатно при заказе от 1000 рублей)
  const deliveryPrice = subtotal >= 1000 ? 0 : 300
  const finalTotal = subtotal + deliveryPrice
  
  // Проверяем, есть ли товары в корзине
  const isEmpty = items.length === 0
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-3">Ваш заказ</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Товары:</span>
          <span>{subtotal} ₽</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Доставка:</span>
          <span>{deliveryPrice > 0 ? `${deliveryPrice} ₽` : 'Бесплатно'}</span>
        </div>
        
        {deliveryPrice > 0 && subtotal > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            <p>До бесплатной доставки не хватает {1000 - subtotal} ₽</p>
          </div>
        )}
        
        <div className="border-t pt-2 mt-2 flex justify-between font-medium">
          <span>Итого:</span>
          <span>{finalTotal} ₽</span>
        </div>
      </div>
      
      <Button 
        disabled={isEmpty}
        className="w-full mt-4" 
        asChild
      >
        <Link 
          href="/checkout" 
          onClick={onClose}
        >
          Оформить заказ
        </Link>
      </Button>
      
      {isEmpty && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Добавьте товары в корзину для оформления заказа
        </p>
      )}
    </div>
  )
} 