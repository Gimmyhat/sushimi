"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Tag, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Promotion } from '@/types'

interface PromotionDetailProps {
  initialPromotion: Promotion | null
  promotionId: string
}

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
  
  // Альтернативное изображение по умолчанию
  return '/images/categories/category-default.jpg';
};

export default function PromotionDetail({ initialPromotion, promotionId }: PromotionDetailProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(initialPromotion);
  const [loading, setLoading] = useState(!initialPromotion);
  
  // Этот хук выполняется только если initialPromotion не был предоставлен
  useEffect(() => {
    if (!initialPromotion) {
      const fetchPromotion = async () => {
        try {
          setLoading(true);
          // Здесь в реальном приложении был бы запрос к API
          // const response = await fetch(`/api/promotions/${promotionId}`);
          // const data = await response.json();
          
          // Но пока просто имитируем загрузку
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } catch (error) {
          console.error('Ошибка при загрузке акции:', error);
          setLoading(false);
        }
      };
      
      fetchPromotion();
    }
  }, [initialPromotion, promotionId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/promotions" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
            <ArrowLeft size={16} className="mr-2" /> Назад к акциям
          </Link>
        </div>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-80 w-full mb-6" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    );
  }
  
  if (!promotion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/promotions" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
            <ArrowLeft size={16} className="mr-2" /> Назад к акциям
          </Link>
        </div>
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Акция не найдена</h1>
          <p className="text-gray-500 mb-6">К сожалению, запрашиваемая акция не существует или была удалена.</p>
          <Button asChild>
            <Link href="/promotions">Все акции</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/promotions" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
          <ArrowLeft size={16} className="mr-2" /> Назад к акциям
        </Link>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="relative h-80 w-full mb-6 rounded-lg overflow-hidden">
          <Image
            src={getPromoImage(promotion)}
            alt={promotion.title || 'Акция'}
            fill
            priority
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">{promotion.title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{promotion.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {promotion.promo_code && (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center">
                <Tag className="mr-3 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Промокод</p>
                  <p className="font-bold">{promotion.promo_code}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {promotion.discount_percent && (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center">
                <Tag className="mr-3 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Скидка</p>
                  <p className="font-bold">{promotion.discount_percent}%</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {(promotion.start_date || promotion.end_date) && (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center">
                <Calendar className="mr-3 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Период действия</p>
                  <p className="font-medium">
                    {promotion.start_date && new Date(promotion.start_date).toLocaleDateString('ru-RU')}
                    {promotion.start_date && promotion.end_date && ' — '}
                    {promotion.end_date && new Date(promotion.end_date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/menu">Перейти в меню</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 