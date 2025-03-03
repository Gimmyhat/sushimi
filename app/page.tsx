"use client"

import { useState, useEffect } from 'react'
import HeroSection from '@/components/features/HeroSection'
import CategoryList from '@/components/features/CategoryList'
import PopularProducts from '@/components/features/PopularProducts'
import FeaturesList from '@/components/features/FeaturesList'
import PromotionsList from '@/components/features/PromotionsList'
import CallToAction from '@/components/features/CallToAction'
import { getCategories, getPopularProducts, getPromotions } from '@/lib/api'
import { Category, Product, Promotion } from '@/types'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Загружаем все данные с обработкой ошибок для каждого запроса
        const categoriesPromise = getCategories().catch(error => {
          console.error('Ошибка при загрузке категорий:', error);
          return [];
        });
        
        const productsPromise = getPopularProducts().catch(error => {
          console.error('Ошибка при загрузке популярных продуктов:', error);
          return [];
        });
        
        const promotionsPromise = getPromotions().catch(error => {
          console.error('Ошибка при загрузке акций:', error);
          return [];
        });
        
        // Ждем выполнения всех запросов
        const [categoriesData, productsData, promotionsData] = await Promise.all([
          categoriesPromise, 
          productsPromise, 
          promotionsPromise
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData);
        setPromotions(promotionsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      
      <CategoryList categories={categories} loading={loading} />
      
      <PopularProducts products={products} loading={loading} />
      
      <FeaturesList />
      
      <PromotionsList promotions={promotions} loading={loading} />
      
      <CallToAction />
    </main>
  )
}