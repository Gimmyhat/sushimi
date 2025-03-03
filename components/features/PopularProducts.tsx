"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/components/cart-provider'
import { Product } from '@/types'

interface PopularProductsProps {
  products: Product[]
  loading: boolean
}

export default function PopularProducts({ products, loading }: PopularProductsProps) {
  const { addItem } = useCart()
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(product)
    })
  }
  
  const getProductImage = (product: Product) => {
    // Используем изображения с Unsplash
    // Определение изображения по имени продукта
    const productName = product.name?.toLowerCase() || '';
    
    if (productName.includes('филадельфия')) {
      return 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=2070&auto=format&fit=crop';
    }
    
    if (productName.includes('калифорния')) {
      return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2070&auto=format&fit=crop';
    }
    
    if (productName.includes('лосось') || productName.includes('сяке')) {
      return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
    }
    
    // Определение изображения по категории
    const categorySlug = product.category_slug?.toLowerCase() || '';
    
    if (categorySlug === 'rolls') {
      return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
    }
    
    if (categorySlug === 'sushi') {
      return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2070&auto=format&fit=crop';
    }
    
    if (categorySlug === 'sets') {
      return 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=2070&auto=format&fit=crop';
    }
    
    // Изображение по умолчанию
    return 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?q=80&w=2070&auto=format&fit=crop';
  }
  
  // Моковые данные для отображения, если API вернул пустой массив
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Филадельфия",
      description: "Классический ролл с лососем и сливочным сыром",
      price: 590,
      category_slug: "rolls",
      is_available: true
    },
    {
      id: "2",
      name: "Калифорния",
      description: "Ролл с крабом, авокадо и огурцом",
      price: 450,
      category_slug: "rolls",
      is_available: true
    },
    {
      id: "3",
      name: "Филадельфия Сет",
      description: "Набор из 3 видов роллов Филадельфия",
      price: 1490,
      category_slug: "sets",
      is_available: true
    },
    {
      id: "4",
      name: "Сяке Нигири",
      description: "Суши с лососем",
      price: 120,
      category_slug: "sushi",
      is_available: true
    }
  ];
  
  // Используем моковые данные, если продукты не загрузились
  const displayProducts = products.length > 0 ? products : mockProducts;
  
  // Компонент для карточки продукта
  const ProductCard = ({ product, loading }: { product: Product | null, loading: boolean }) => {
    if (loading) {
      return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <div className="relative h-48 w-full bg-gray-700">
            <Skeleton className="h-48 w-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      )
    }

    if (!product) {
      return null;
    }

    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 w-full bg-gray-700">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            priority
            className="object-cover"
            onError={(e) => {
              console.warn(`Ошибка загрузки изображения для продукта ${product.name}`);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">{product.price} ₽</p>
            <Button 
              variant="default" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
            >
              В корзину
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-10 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Популярные блюда</h2>
          <Button asChild variant="ghost" className="gap-1 text-base font-medium hover:text-primary">
            <Link href="/menu">
              Всё меню <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <ProductCard
                key={index} 
                product={null}
                loading={true}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id} 
                product={product}
                loading={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 