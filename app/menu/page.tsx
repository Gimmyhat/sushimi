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

// Функция для получения изображения продукта в зависимости от категории
const getProductImage = (categorySlug: string, productId: string) => {
  // Используем последние символы ID продукта для получения разных изображений для разных продуктов
  const idLastChars = productId.slice(-3);
  const hashCode = parseInt(idLastChars, 16) % 5; // Используем для выбора одной из 5 заглушек
  
  // Базовые изображения для каждой категории
  switch (categorySlug) {
    case 'rolls':
      const rollsImages = [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615361200141-f45961bc8a64?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1635012952399-50b65f28e3c7?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559410545-0bdcd187e323?q=80&w=1000&auto=format&fit=crop"
      ];
      return rollsImages[hashCode];
    case 'sushi':
      const sushiImages = [
        "https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556906903-0a5dc8b0ff5d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583623025817-d180a2fe075e?q=80&w=1000&auto=format&fit=crop"
      ];
      return sushiImages[hashCode];
    case 'sets':
      const setsImages = [
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617196333412-f53a995a6e16?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1628707351135-e336e6426053?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562802378-063ec186a863?q=80&w=1000&auto=format&fit=crop"
      ];
      return setsImages[hashCode];
    case 'drinks':
      const drinksImages = [
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498480086004-2400bd8c3663?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571950006418-f226dc106482?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565454296317-b45fe0ff1447?q=80&w=1000&auto=format&fit=crop"
      ];
      return drinksImages[hashCode];
    default:
      return "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1000&auto=format&fit=crop";
  }
};

export default function MenuPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<Record<string, any[]>>({})
  const [activeTab, setActiveTab] = useState('')
  const [loading, setLoading] = useState(true)
  
  const { addItem } = useCart()
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Получаем категории
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        
        if (categoriesData.length > 0) {
          // Определяем активную вкладку
          let initialTab = categoriesData[0].slug
          
          // Если есть параметр категории в URL, используем его
          if (categoryParam) {
            const matchingCategory = categoriesData.find(
              (cat: any) => cat.slug === categoryParam || cat.slug === categoryParam.toLowerCase()
            )
            if (matchingCategory) {
              initialTab = matchingCategory.slug
            }
          }
          
          setActiveTab(initialTab)
          
          // Загружаем продукты для всех категорий
          const productsData: Record<string, any[]> = {}
          
          for (const category of categoriesData) {
            const categoryProducts = await getProductsByCategory(category.slug)
            productsData[category.slug] = categoryProducts
          }
          
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [categoryParam])
  
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || getProductImage(product.category_slug || activeTab, product.id)
    })
  }
  
  if (loading) {
    return (
      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-10">Меню</h1>
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
  
  return (
    <main className="bg-slate-50 pb-16">
      <div className="pt-10 pb-6 bg-white shadow-sm">
        <div className="container">
          <h1 className="text-4xl font-bold">Меню</h1>
        </div>
      </div>
      
      <div className="container py-12">
        {categories.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.slug} 
                    className="text-base px-5 py-2.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-0">
                {products[category.slug] && products[category.slug].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products[category.slug].map((product) => (
                      <Card key={product.id} className="overflow-hidden bg-white border-none shadow-sm hover:shadow-md transition-all">
                        <div className="relative h-56">
                          <Image 
                            src={product.image_url || getProductImage(category.slug, product.id)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          {product.weight && (
                            <div className="absolute top-4 right-4 bg-white text-gray-700 text-xs font-medium py-1 px-2.5 rounded-full shadow-sm">
                              {product.weight}
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-semibold text-xl mb-3">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-5 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-xl">{product.price} ₽</span>
                            <Button 
                              onClick={() => handleAddToCart(product)} 
                              className="bg-primary hover:bg-primary/90 shadow-sm"
                            >
                              В корзину
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <p className="text-muted-foreground text-lg">В данной категории пока нет товаров</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-muted-foreground text-lg">Меню загружается или недоступно</p>
          </div>
        )}
      </div>
    </main>
  )
}