"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/components/cart-provider'
import { createOrder, OrderData } from '@/lib/api'
import { OrderStatus, PaymentMethod } from '@/types/order'

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap',
    scheduledTime: '',
    comment: '',
  })
  
  // Расчет стоимости доставки и общей суммы
  const deliveryCost = subtotal >= 2000 ? 0 : 300
  const total = subtotal + deliveryCost
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину перед оформлением заказа",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Создание заказа
      const orderData: OrderData = {
        user_id: undefined, // В будущем здесь будет ID авторизованного пользователя
        total,
        address: formData.address,
        phone: formData.phone,
        payment_method: formData.paymentMethod,
        delivery_time: formData.deliveryTime === 'asap' ? 'Как можно скорее' : `К ${formData.scheduledTime}`,
        comment: formData.comment
      }
      
      // Создание элементов заказа
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
      
      // Отправляем заказ и его элементы через API
      await createOrder(orderData, orderItems)
      
      // Очистка корзины и перенаправление
      clearCart()
      
      toast({
        title: "Заказ оформлен!",
        description: "Ваш заказ успешно оформлен. Ожидайте звонка оператора.",
      })
      
      // Перенаправление на страницу успешного оформления заказа
      router.push('/checkout/success')
      
    } catch (error) {
      console.error('Error submitting order:', error)
      toast({
        title: "Ошибка при оформлении заказа",
        description: "Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
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
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя*</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон*</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          required 
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          type="email"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Адрес доставки</h2>
                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес*</Label>
                      <Textarea 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required 
                        placeholder="Улица, дом, квартира, подъезд, этаж"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleRadioChange('paymentMethod', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Наличными при получении</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Картой при получении</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">Онлайн оплата</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Время доставки</h2>
                    <RadioGroup 
                      value={formData.deliveryTime} 
                      onValueChange={(value) => handleRadioChange('deliveryTime', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asap" id="asap" />
                        <Label htmlFor="asap">Как можно скорее</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label htmlFor="scheduled">Ко времени</Label>
                      </div>
                    </RadioGroup>
                    {formData.deliveryTime === 'scheduled' && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="scheduledTime">Выберите время</Label>
                        <Input 
                          id="scheduledTime" 
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleChange}
                          type="time" 
                          min="10:00" 
                          max="22:30"
                          required={formData.deliveryTime === 'scheduled'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Textarea 
                      id="comment" 
                      name="comment" 
                      value={formData.comment} 
                      onChange={handleChange} 
                      placeholder="Дополнительная информация для курьера"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/cart">Вернуться в корзину</Link>
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
              </Button>
            </div>
          </form>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
              
              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма</span>
                  <span>{subtotal} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Итого</span>
                <span>{total} ₽</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Информация о доставке</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Доставка осуществляется по всему Иркутску. Среднее время доставки составляет 60 минут.
                </p>
                <p className="text-sm text-muted-foreground">
                  При заказе от 2000 ₽ доставка бесплатная. В остальных случаях стоимость доставки составляет 300 ₽.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}