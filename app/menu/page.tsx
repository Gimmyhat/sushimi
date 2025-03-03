"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/components/cart-provider'
import { getCategories, getProductsByCategory } from '@/lib/api'

// Определяем интерфейсы
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  is_available: boolean;
  category_id: string;
  category_slug: string;
  image_url?: string;
}

// Добавляем тестовые данные напрямую в компонент страницы
// Данные категорий
const testCategories = [
  {
    id: 'cat1',
    name: 'Роллы',
    slug: 'rolls',
    description: 'Классические и фирменные роллы',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat2',
    name: 'Суши',
    slug: 'sushi',
    description: 'Традиционные японские суши',
    image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat3',
    name: 'Сеты',
    slug: 'sets',
    description: 'Наборы из нескольких видов роллов и суши',
    image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'cat4',
    name: 'Напитки',
    slug: 'drinks',
    description: 'Напитки к вашему заказу',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop'
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

// Функция для получения изображения продукта в зависимости от категории
const getProductImage = (categorySlug: string, productId: string) => {
  // Соответствие между id продукта и путем к изображению
  const productIdToImage: Record<string, string> = {
    // Роллы
    'r002': '/images/products/rolls/california.jpg', // Калифорния
    'r003': '/images/products/rolls/dragon.jpg',     // Дракон
    'r004': '/images/products/rolls/spicy-salmon.jpg', // Спайси лосось
    
    // Суши
    's001': '/images/products/sushi/nigiri-salmon.jpg', // Нигири с лососем
    's004': '/images/products/sushi/nigiri-shrimp.jpg', // Нигири с креветкой
    
    // Сеты
    'st002': '/images/products/sets/california-set.jpg', // Сет Калифорния
    'st003': '/images/products/sets/assorted-set.jpg',   // Сет Ассорти
    
    // Напитки
    'd001': '/images/products/drinks/green-tea.jpg',    // Чай зеленый
    'd002': '/images/products/drinks/cola.jpg',         // Кока-кола
    'd003': '/images/products/drinks/sprite.jpg',       // Спрайт
  };

  // Проверяем соответствие по ID продукта
  if (productIdToImage[productId]) {
    return productIdToImage[productId];
  }
  
  // Для продуктов без конкретных изображений используем категорию
  switch (categorySlug) {
    case 'rolls':
      return `/images/categories/category-rolls.jpg`;
    case 'sushi':
      return `/images/categories/category-sushi.jpg`;
    case 'sets':
      return `/images/categories/category-sets.jpg`;
    case 'drinks':
      return `/images/categories/category-drinks.jpg`;
    default:
      return `/images/categories/category-default.jpg`;
  }
};

export default function MenuPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<{[key: string]: Product[]}>({})
  const [activeTab, setActiveTab] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        console.log('Fetching data for menu...')

        // Используем тестовые данные вместо API
        const fetchedCategories = testCategories;
        console.log('Fetched categories:', fetchedCategories)

        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories)
          
          // Определяем активную вкладку
          let initialTab = fetchedCategories[0].slug;
          
          // Если есть параметр категории в URL, используем его
          if (categoryParam) {
            const matchingCategory = fetchedCategories.find(
              (cat) => cat.slug === categoryParam || cat.slug === categoryParam.toLowerCase()
            );
            if (matchingCategory) {
              initialTab = matchingCategory.slug;
            }
          }
          
          setActiveTab(initialTab)
          console.log('Active tab set to:', initialTab)
          
          // Загружаем продукты для всех категорий
          const productsByCategory: {[key: string]: Product[]} = {}
          
          for (const category of fetchedCategories) {
            // Используем тестовые продукты для каждой категории
            const categoryProducts = testProducts[category.slug as keyof typeof testProducts] || [];
            console.log(`Fetched products for ${category.slug}:`, categoryProducts)
            
            productsByCategory[category.slug] = categoryProducts
          }
          
          setProducts(productsByCategory)
        }
      } catch (error) {
        console.error('Error fetching data for menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryParam]) // Добавляем categoryParam в массив зависимостей

  const handleTabChange = (slug: string) => {
    setActiveTab(slug)
  }
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || getProductImage(product.category_slug, product.id)
    })
  }
  
  if (loading) {
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
  
  const hasProducts = Object.values(products).some(arr => arr.length > 0);
  
  if (!hasProducts) {
    return (
      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-6">Меню</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            {categories.map((category) => (
              <TabsTrigger
                key={category.slug}
                value={category.slug}
                onClick={() => setActiveTab(category.slug)}
                className={`px-4 py-2 rounded ${activeTab === category.slug ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Меню</h1>
      
      {loading ? (
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
                      activeTab === category.slug
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
            {products[activeTab]?.map((product, index) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={product.image_url || getProductImage(product.category_slug, product.id)}
                    alt={product.name}
                    fill
                    priority={index < 3}
                    className="object-cover"
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