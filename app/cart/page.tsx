"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { checkPromoCode } from '@/lib/api'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)
  const [promoError, setPromoError] = useState('')
  
  const deliveryCost = subtotal >= 2000 ? 0 : 300
  const total = subtotal - discount + deliveryCost
  
  const applyPromoCode = async () => {
    if (!promoCode) return
    
    setIsCheckingPromo(true)
    setPromoError('')
    
    try {
      const promo = await checkPromoCode(promoCode)
      
      if (promo) {
        setPromoApplied(true)
        const discountAmount = Math.round(subtotal * ((promo.discount_percent ?? 0) / 100))
        setDiscount(discountAmount)
      } else {
        setPromoError('Промокод недействителен или срок его действия истек')
      }
    } catch (error) {
      console.error('Error applying promo code:', error)
      setPromoError('Ошибка при проверке промокода')
    } finally {
      setIsCheckingPromo(false)
    }
  }
  
  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Корзина пуста</h1>
        <p className="text-muted-foreground mb-8">Добавьте товары из нашего меню, чтобы сделать заказ</p>
        <Button asChild size="lg">
          <Link href="/menu">Перейти в меню</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground">{item.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-medium">{item.price * item.quantity} ₽</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="text-xs">Удалить</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/menu">Продолжить покупки</Link>
            </Button>
            <Button variant="outline" onClick={() => clearCart()}>
              Очистить корзину
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Сумма заказа</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма</span>
                  <span>{subtotal} ₽</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка</span>
                    <span>-{discount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Итого</span>
                <span>{total} ₽</span>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="promo" className="mb-2 block">Промокод</Label>
                <div className="flex gap-2">
                  <Input 
                    id="promo" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                    disabled={promoApplied || isCheckingPromo}
                  />
                  <Button 
                    variant="outline" 
                    onClick={applyPromoCode}
                    disabled={promoApplied || isCheckingPromo || !promoCode}
                  >
                    {isCheckingPromo ? 'Проверка...' : 'Применить'}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-1">Промокод применен!</p>
                )}
                {promoError && (
                  <p className="text-sm text-destructive mt-1">{promoError}</p>
                )}
              </div>
              
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Оформить заказ</Link>
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Нажимая кнопку "Оформить заказ", вы соглашаетесь с условиями доставки и политикой конфиденциальности
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}