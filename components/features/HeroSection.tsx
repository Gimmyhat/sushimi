"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, Star } from 'lucide-react'
import ImageSlider from '@/components/shared/ImageSlider'

// Массив фоновых изображений
const backgroundImages = [
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562802378-063ec186a863?q=80&w=1200&auto=format&fit=crop'
];

export default function HeroSection() {
  return (
    <section className="w-full relative min-h-[400px] md:min-h-[480px] overflow-hidden">
      <div className="absolute inset-0 h-full w-full" style={{ minHeight: '320px' }}>
        <ImageSlider 
          images={backgroundImages} 
          interval={5000}
          effect="fade"
          overlayClassName="bg-gradient-to-b from-black/70 via-black/50 to-black/70"
        />
      </div>
      
      <div className="relative py-8 md:py-12 lg:py-16 w-full text-white z-10">
        {/* Декоративные элементы */}
        <div className="absolute -right-10 top-20 w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -left-10 bottom-20 w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full bg-accent/20 blur-[80px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Текстовый контент */}
            <div className="flex flex-col max-w-xl">
              <div className="inline-block bg-primary/30 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-4 rounded-full mb-3 md:mb-4 self-start shadow-sm">
                Премиальная доставка суши в Иркутске
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 leading-tight text-white drop-shadow-md">
                <span className="text-primary text-glow">Искусство</span> вкуса<br />в каждом роле
              </h1>
              
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-4 md:mb-6 drop-shadow-md">
                Истинное наслаждение японской кухней — премиальные ингредиенты, 
                мастерство шеф-поваров и безукоризненная доставка в течение 60 минут
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                <Button asChild size="lg" className="text-base bg-primary hover:bg-primary/90 transition-all">
                  <Link href="/menu">
                    Выбрать суши <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                  <Link href="/promotions">Специальные предложения</Link>
                </Button>
              </div>
              
              {/* Преимущества */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs md:text-sm font-medium">Доставка за 60 минут</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-xs md:text-sm font-medium">Оценка 4.9 из 5</span>
                </div>
              </div>
            </div>
            
            {/* Плавающая карточка с рейтингом */}
            <div className="hidden lg:block relative">
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md z-10">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`h-4 w-4 ${i <= 5 ? 'text-primary' : 'text-gray-300'}`} fill={i <= 5 ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="text-xs text-gray-600">Более 2000 положительных отзывов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 