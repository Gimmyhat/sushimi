"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ImageSlider from '@/components/shared/ImageSlider'

// Массив фоновых изображений для слайдера
const backgrounds = [
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop'
]

export default function CallToAction() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 h-full w-full" style={{ minHeight: '300px' }}>
        <ImageSlider 
          images={backgrounds} 
          interval={6000}
          effect="fade"
          overlayClassName="bg-black/60"
        />
      </div>
      
      <div className="container relative mx-auto px-4 z-10">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur rounded-xl shadow-xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Попробуйте наше меню прямо сейчас</h2>
          <p className="text-lg md:text-xl font-medium text-primary mb-3 md:mb-4">Получите скидку 10% на первый заказ</p>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Используйте промокод <span className="font-semibold text-black">SUSHIMI10</span> при оформлении заказа
          </p>
          <Button asChild size="lg" className="text-base">
            <Link href="/menu">
              Сделать заказ
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 