"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Promotion } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface PromotionsListProps {
  promotions: Promotion[]
  loading: boolean
}

export default function PromotionsList({ promotions, loading }: PromotionsListProps) {
  // Функция для получения изображения акции
  const getPromoImage = (promo: Promotion) => {
    // Проверяем промокоды и возвращаем соответствующие изображения
    const promoCode = promo.promo_code?.toLowerCase() || '';
    const title = promo.title?.toLowerCase() || '';
    
    // Проверяем содержит ли промокод или заголовок определенные ключевые слова
    if (title.includes('10%') || title.includes('первый') || promoCode.includes('first')) {
      return '/images/categories/category-default.jpg';
    }
    
    if (title.includes('15%') || title.includes('сет') || promoCode.includes('set')) {
      return '/images/categories/category-sets.jpg';
    }
    
    // Альтернативные изображения для других промо
    return '/images/categories/category-rolls.jpg';
  };
  
  // Моковые данные для отображения, если API вернул пустой массив
  const mockPromotions: Promotion[] = [
    {
      id: "02c9808c-180e-4b7a-b17b-c08faa28ce6b",
      title: "Скидка 10% на первый заказ",
      description: "Скидка 10% для новых клиентов",
      promo_code: "FIRST10",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "28cf6a47-bd86-4548-ab58-70ae86f75d8f",
      title: "Скидка 15% на сеты",
      description: "Скидка на все сеты до конца недели",
      promo_code: "SETS15",
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
  
  // Используем моковые данные, если промоакции не загрузились
  const displayPromotions = promotions.length > 0 ? promotions : mockPromotions;
  
  return (
    <section className="py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-3xl">
          Акции и специальные предложения
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {Array(2).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-40 md:h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayPromotions.map((promo) => (
              <Link 
                key={promo.id} 
                href={`/promotions/${promo.id}`}
                className="block h-full"
              >
                <Card className="overflow-hidden h-full transition-all hover:shadow-md flex flex-col">
                  <div className="relative h-40 md:h-48 w-full bg-gray-700">
                    <Image
                      src={getPromoImage(promo)}
                      alt={promo.title || 'Акция'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="object-cover"
                      onError={(e) => {
                        console.warn(`Ошибка загрузки изображения для акции ${promo.title}`);
                        // Используем запасное изображение при ошибке
                        e.currentTarget.src = '/images/categories/category-default.jpg';
                      }}
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold mb-2">{promo.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{promo.description}</p>
                      {promo.promo_code && (
                        <p className="text-sm font-medium">
                          Промокод: <span className="font-bold">{promo.promo_code}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end items-center text-primary mt-4">
                      <span className="text-sm font-medium mr-1">Подробнее</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 