"use client"

import { Truck, Clock, MapPin } from 'lucide-react'

export default function FeaturesList() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Почему выбирают нас</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="flex flex-col items-center text-center p-4 md:p-6">
            <div className="flex justify-center items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
              <Truck className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Быстрая доставка</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Доставляем заказы в течение 60 минут по всему городу. В часы пик время доставки может быть увеличено.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 md:p-6">
            <div className="flex justify-center items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
              <Clock className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Свежие ингредиенты</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Используем только свежие продукты для приготовления. Наши повара контролируют качество каждого блюда.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 md:p-6">
            <div className="flex justify-center items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
              <MapPin className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Удобное расположение</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Наши рестораны расположены в разных районах города, что позволяет нам быстро доставлять блюда горячими.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 