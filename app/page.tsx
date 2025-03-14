"use client"

import HeroSection from '@/components/features/HeroSection'
import CategoryList from '@/components/features/CategoryList'
import PopularProducts from '@/components/features/PopularProducts'
import FeaturesList from '@/components/features/FeaturesList'
import PromotionsList from '@/components/features/PromotionsList'
import CallToAction from '@/components/features/CallToAction'
import { useCategories, usePopularProducts, usePromotions } from '@/hooks/api'

export default function Home() {
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useCategories()
  
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = usePopularProducts()
  
  const { 
    data: promotions = [], 
    isLoading: promotionsLoading 
  } = usePromotions()
  
  const loading = categoriesLoading || productsLoading || promotionsLoading
  
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      
      <CategoryList categories={categories} loading={categoriesLoading} />
      
      <PopularProducts products={products} loading={productsLoading} />
      
      <FeaturesList />
      
      <PromotionsList promotions={promotions} loading={promotionsLoading} />
      
      <CallToAction />
    </main>
  )
}