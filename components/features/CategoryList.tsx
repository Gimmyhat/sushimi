"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Category } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryListProps {
  categories: Category[]
  loading: boolean
}

export default function CategoryList({ categories, loading }: CategoryListProps) {
  // Функция для получения изображения категории
  const getCategoryImage = (slug: string) => {
    // Используем изображения с Unsplash
    switch (slug) {
      case 'rolls':
        return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
      case 'sushi':
        return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2070&auto=format&fit=crop';
      case 'sets':
        return 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=2070&auto=format&fit=crop';
      case 'drinks':
        return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2070&auto=format&fit=crop';
      case 'promotions':
      case 'promo':
      case 'special-offers':
      case 'specials':
        return 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?q=80&w=2070&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=2070&auto=format&fit=crop';
    }
  }

  // Моковые данные для отображения, если API вернул пустой массив
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Роллы",
      slug: "rolls",
      description: "Традиционные и авторские роллы"
    },
    {
      id: "2",
      name: "Суши",
      slug: "sushi",
      description: "Классические и фирменные суши"
    },
    {
      id: "3",
      name: "Сеты",
      slug: "sets",
      description: "Готовые наборы для компаний"
    },
    {
      id: "4",
      name: "Напитки",
      slug: "drinks",
      description: "Безалкогольные напитки"
    }
  ];
  
  // Используем моковые данные, если категории не загрузились
  const displayCategories = categories.length > 0 ? categories : mockCategories;

  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Категории блюд</h2>
          <Button asChild variant="ghost" className="gap-1 text-base font-medium hover:text-primary">
            <Link href="/menu">
              Все категории <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {/* Отображение карточек категорий */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array(4).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-40 md:h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/menu?category=${category.slug}`}
                className="block"
              >
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-40 md:h-48 w-full bg-gray-700">
                    <Image
                      src={getCategoryImage(category.slug)}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority
                      className="object-cover"
                      onError={(e) => {
                        console.warn(`Ошибка загрузки изображения для категории ${category.name}`);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
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