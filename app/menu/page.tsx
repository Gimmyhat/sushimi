"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/components/cart-provider'
import { useCategories, useProductsByCategory } from '@/hooks/api'
import { Category, Product } from '@/types'
import { ProductImage } from '@/components/ui/product-image'

// Добавляем тестовые данные напрямую в компонент страницы
// Данные категорий
const testCategories = [
  {
    id: 'cat1',
    name: 'Роллы',
    slug: 'rolls',
    description: 'Классические и фирменные роллы',
    image_url: '/images/categories/category-rolls.jpg'
  },
  {
    id: 'cat2',
    name: 'Суши',
    slug: 'sushi',
    description: 'Традиционные японские суши',
    image_url: '/images/categories/category-sushi.jpg'
  },
  {
    id: 'cat3',
    name: 'Сеты',
    slug: 'sets',
    description: 'Наборы из нескольких видов роллов и суши',
    image_url: '/images/categories/category-sets.jpg'
  },
  {
    id: 'cat4',
    name: 'Напитки',
    slug: 'drinks',
    description: 'Напитки к вашему заказу',
    image_url: '/images/categories/category-drinks.jpg'
  }
];

// Данные продуктов по категориям
const testProducts = {
  rolls: [
    {
      id: 'r001',
      name: 'Филадельфия классик',
      description: 'Классический ролл с лососем, сливочным сыром, огурцом и авокадо',
      price: 590,
      weight: '280 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    },
    {
      id: 'r002',
      name: 'Калифорния',
      description: 'Ролл с крабовым мясом, авокадо, огурцом и икрой тобико',
      price: 490,
      weight: '260 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    },
    {
      id: 'r003',
      name: 'Дракон',
      description: 'Ролл с угрем, огурцом, сливочным сыром, авокадо и соусом унаги',
      price: 640,
      weight: '290 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    },
    {
      id: 'r004',
      name: 'Спайси лосось',
      description: 'Острый ролл с лососем, огурцом и спайси соусом',
      price: 450,
      weight: '240 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    },
    {
      id: 'r005',
      name: 'Радуга',
      description: 'Ролл с разными видами рыбы (лосось, тунец, угорь), авокадо и огурцом',
      price: 670,
      weight: '300 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    },
    {
      id: 'r006',
      name: 'Темпура с креветкой',
      description: 'Жареный ролл с креветкой, сливочным сыром, авокадо и соусом унаги',
      price: 580,
      weight: '270 г',
      is_available: true,
      category_id: 'cat1',
      category_slug: 'rolls'
    }
  ],
  sushi: [
    {
      id: 's001',
      name: 'Нигири с лососем',
      description: 'Классические суши с рисом и свежим лососем',
      price: 190,
      weight: '35 г',
      is_available: true,
      category_id: 'cat2',
      category_slug: 'sushi'
    },
    {
      id: 's002',
      name: 'Нигири с тунцом',
      description: 'Классические суши с рисом и свежим тунцом',
      price: 210,
      weight: '35 г',
      is_available: true,
      category_id: 'cat2',
      category_slug: 'sushi'
    },
    {
      id: 's003',
      name: 'Нигири с угрем',
      description: 'Классические суши с рисом и копченым угрем под соусом унаги',
      price: 230,
      weight: '40 г',
      is_available: true,
      category_id: 'cat2',
      category_slug: 'sushi'
    },
    {
      id: 's004',
      name: 'Нигири с креветкой',
      description: 'Классические суши с рисом и отварной креветкой',
      price: 200,
      weight: '35 г',
      is_available: true,
      category_id: 'cat2',
      category_slug: 'sushi'
    },
    {
      id: 's005',
      name: 'Гункан с икрой лосося',
      description: 'Суши-корзинка с рисом и красной икрой',
      price: 290,
      weight: '40 г',
      is_available: true,
      category_id: 'cat2',
      category_slug: 'sushi'
    }
  ],
  sets: [
    {
      id: 'st001',
      name: 'Сет Филадельфия',
      description: 'Большой сет из 4 видов роллов с лососем: Филадельфия классик, Филадельфия с огурцом, Филадельфия с авокадо, Филадельфия спайси',
      price: 1590,
      weight: '1050 г',
      is_available: true,
      category_id: 'cat3',
      category_slug: 'sets'
    },
    {
      id: 'st002',
      name: 'Сет Калифорния',
      description: 'Набор из классической Калифорнии и её вариаций с разными начинками',
      price: 1490,
      weight: '980 г',
      is_available: true,
      category_id: 'cat3',
      category_slug: 'sets'
    },
    {
      id: 'st003',
      name: 'Сет Ассорти',
      description: 'Большой сет из самых популярных роллов: Филадельфия, Калифорния, Дракон и Радуга',
      price: 1890,
      weight: '1120 г',
      is_available: true,
      category_id: 'cat3',
      category_slug: 'sets'
    },
    {
      id: 'st004',
      name: 'Сет Hot',
      description: 'Набор из горячих жареных роллов с различными начинками',
      price: 1690,
      weight: '1050 г',
      is_available: true,
      category_id: 'cat3',
      category_slug: 'sets'
    }
  ],
  drinks: [
    {
      id: 'd001',
      name: 'Чай зеленый',
      description: 'Традиционный японский зеленый чай',
      price: 190,
      weight: '400 мл',
      is_available: true,
      category_id: 'cat4',
      category_slug: 'drinks'
    },
    {
      id: 'd002',
      name: 'Кока-кола',
      description: 'Кока-кола классическая',
      price: 150,
      weight: '500 мл',
      is_available: true,
      category_id: 'cat4',
      category_slug: 'drinks'
    },
    {
      id: 'd003',
      name: 'Спрайт',
      description: 'Газированный напиток Спрайт',
      price: 150,
      weight: '500 мл',
      is_available: true,
      category_id: 'cat4',
      category_slug: 'drinks'
    },
    {
      id: 'd004',
      name: 'Сок апельсиновый',
      description: 'Натуральный апельсиновый сок',
      price: 190,
      weight: '500 мл',
      is_available: true,
      category_id: 'cat4',
      category_slug: 'drinks'
    },
    {
      id: 'd005',
      name: 'Сок яблочный',
      description: 'Натуральный яблочный сок',
      price: 190,
      weight: '500 мл',
      is_available: true,
      category_id: 'cat4',
      category_slug: 'drinks'
    }
  ]
};

// Функция для получения изображения продукта
const getProductImage = (categorySlug: string | undefined, productId: string): string => {
  if (!categorySlug) return '/images/default-product.jpg';
  
  // Определяем путь к изображению на основе категории и ID продукта
  switch (categorySlug) {
    case 'rolls':
      return `/images/products/rolls/${productId.includes('r') ? productId.replace('r', 'roll-') : 'roll-default'}.jpg`;
    case 'sushi':
      return `/images/products/sushi/${productId.includes('s') ? productId.replace('s', 'sushi-') : 'nigiri-salmon'}.jpg`;
    case 'sets':
      return `/images/products/sets/${productId.includes('st') ? productId.replace('st', 'set-') : 'assorted-set'}.jpg`;
    case 'drinks':
      return `/images/products/drinks/${productId.includes('d') ? productId.replace('d', 'drink-') : 'cola'}.jpg`;
    default:
      return '/images/default-product.jpg';
  }
};

export default function MenuPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const { addItem } = useCart()
  
  // Получаем категории с использованием React Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useCategories()
  
  // Получаем продукты для активной категории
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useProductsByCategory(activeCategory || '')
  
  // Если нет активной категории и есть категории, устанавливаем первую категорию как активную
  useEffect(() => {
    if (!activeCategory && categories.length > 0 && !categoriesLoading) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, categoriesLoading, activeCategory]);
  
  const handleTabChange = (slug: string) => {
    setActiveCategory(slug)
  }
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || getProductImage(product.category_slug, product.id)
    })
  }
  
  if (productsLoading) {
    return (
      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-10">Меню - Загрузка...</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <div className="flex gap-3 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-white border-none shadow-sm">
              <Skeleton className="h-52 w-full rounded-t-lg" />
              <CardContent className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  const hasProducts = products.length > 0;
  
  if (!hasProducts) {
    return (
      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-6">Меню</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 py-2 rounded ${activeCategory === category.slug ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Меню</h1>
      
      {productsLoading ? (
        <div className="text-center py-10">
          <p className="text-xl">Меню - Загрузка...</p>
        </div>
      ) : (
        <>
          {/* Вкладки категорий */}
          <div className="border-b mb-6">
            <ul className="flex flex-wrap -mb-px">
              {categories.map((category) => (
                <li key={category.id} className="mr-2">
                  <button
                    onClick={() => handleTabChange(category.slug)}
                    className={`inline-block p-4 rounded-t-lg ${
                      activeCategory === category.slug
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'hover:text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Список продуктов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 relative">
                  <ProductImage
                    src={product.image_url || getProductImage(product.category_slug, product.id)}
                    alt={product.name}
                    priority={index < 3}
                    aspectRatio="landscape"
                    className="h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">{product.price} ₽</p>
                      <p className="text-gray-500 text-sm">{product.weight}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}