"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Clock, MapPin, Truck, ChevronRight, Star } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { getCategories, getPopularProducts, getPromotions } from '@/lib/api'

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])
  const [popularProducts, setPopularProducts] = useState<any[]>([])
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const { addItem } = useCart()
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, productsData, promotionsData] = await Promise.all([
          getCategories(),
          getPopularProducts(),
          getPromotions()
        ])
        
        setCategories(categoriesData)
        setPopularProducts(productsData)
        setPromotions(promotionsData)
      } catch (error) {
        console.error('Error fetching home page data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url
    })
  }
  
  const getCategoryImage = (slug: string) => {
    switch (slug) {
      case 'rolls':
        return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop";
      case 'sushi':
        return "https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1000&auto=format&fit=crop";
      case 'sets':
        return "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=1000&auto=format&fit=crop";
      case 'drinks':
        return "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
    }
  }
  
  // Функция для получения заглушек изображений продуктов
  const getProductImage = (product: any) => {
    // Используем категорию продукта для выбора соответствующего изображения
    if (product.category_slug) {
      const categorySlug = product.category_slug;
      const idLastChars = product.id.slice(-3);
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
    }
    
    // Если категория неизвестна, вернем базовое изображение суши
    return "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1000&auto=format&fit=crop";
  }
  
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        
        <div className="relative pt-10 pb-16 md:pb-24">
          {/* Декоративные элементы */}
          <div className="absolute -right-10 top-20 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -left-10 bottom-20 w-[250px] h-[250px] rounded-full bg-accent/5 blur-[80px]" />
          
          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Текстовый контент */}
              <div className="flex flex-col max-w-xl">
                <div className="inline-block bg-primary/10 text-primary text-sm font-medium py-1.5 px-4 rounded-full mb-6 self-start">
                  Премиальная доставка суши в Иркутске
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">Искусство</span> вкуса<br />в каждом роле
                </h1>
                
                <p className="text-muted-foreground text-base md:text-lg mb-8">
                  Истинное наслаждение японской кухней — премиальные ингредиенты, 
                  мастерство шеф-поваров и безукоризненная доставка в течение 60 минут
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="text-base bg-primary hover:bg-primary/90 transition-all">
                    <Link href="/menu">
                      Выбрать суши <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base">
                    <Link href="/promotions">Специальные предложения</Link>
                  </Button>
                </div>
                
                {/* Преимущества */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Доставка за 60 минут</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Оценка 4.9 из 5</span>
                  </div>
                </div>
              </div>
              
              {/* Изображение */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                <Image 
                  src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470&auto=format&fit=crop"
                  alt="Премиальные суши"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Плавающая карточка с рейтингом */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
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

      {/* Popular Categories */}
      <section className="container py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Категории блюд</h2>
          <Button asChild variant="ghost" className="gap-1 text-base font-medium hover:text-primary">
            <Link href="/menu">
              Все категории <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 md:h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/menu?category=${category.slug}`}>
                <div className="group relative h-48 md:h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-lg card-hover">
                  <Image 
                    src={getCategoryImage(category.slug)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Items */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Бестселлеры</h2>
            <Button asChild variant="ghost" className="gap-1 text-base font-medium hover:text-primary">
              <Link href="/menu">
                Все меню <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="bg-white">
                  <Skeleton className="h-52 w-full rounded-t-lg" />
                  <CardContent className="p-5">
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden bg-white border-none shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-52">
                    <Image 
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={85}
                    />
                    <div className="absolute top-4 right-4 bg-white text-primary text-xs font-medium py-1 px-2.5 rounded-full shadow-sm">
                      <Star className="h-3 w-3 inline mr-1" fill="currentColor" /> Хит продаж
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-xl">{product.price} ₽</span>
                      <Button 
                        size="default" 
                        className="bg-primary hover:bg-primary/90 shadow-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-primary/10 text-primary p-5 rounded-full mb-5">
              <Truck className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Быстрая доставка</h3>
            <p className="text-muted-foreground text-base">Доставляем заказы в течение 60 минут по всему Иркутску</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-primary/10 text-primary p-5 rounded-full mb-5">
              <Clock className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Свежие ингредиенты</h3>
            <p className="text-muted-foreground text-base">Используем только премиальные свежие продукты высшего качества</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-primary/10 text-primary p-5 rounded-full mb-5">
              <MapPin className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Удобное расположение</h3>
            <p className="text-muted-foreground text-base">Расположены в центре города с возможностью самовывоза</p>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Акции и предложения</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotions.slice(0, 2).map((promo) => (
                <div key={promo.id} className="relative h-72 md:h-80 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
                  <Image 
                    src={promo.image_url || "https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"}
                    alt={promo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="inline-block bg-white/90 backdrop-blur-sm text-primary text-sm font-medium py-1.5 px-4 rounded-full self-start shadow-sm">
                      Акция
                    </div>
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-3">{promo.title}</h3>
                      <p className="text-gray-100 mb-5">{promo.description}</p>
                      <Button asChild variant="default" size="lg" className="bg-white text-primary hover:bg-white/90 text-base">
                        <Link href={promo.promo_code ? `/menu?promo=${promo.promo_code}` : "/menu"}>
                          Заказать сейчас <ChevronRight className="h-5 w-5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary/70 shadow-xl">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-30 -mr-32 -mb-32"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-30 -ml-32 -mt-32"></div>
          
          <div className="relative p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Готовы к кулинарному наслаждению?</h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto text-white/80">
              Закажите прямо сейчас и получите специальную скидку 10% на первый заказ с кодом <span className="font-bold text-white">СУШИ10</span>
            </p>
            <Button asChild size="lg" className="bg-white hover:bg-white/90 text-primary text-base px-8 py-6 h-auto shadow-md">
              <Link href="/menu">Сделать заказ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}