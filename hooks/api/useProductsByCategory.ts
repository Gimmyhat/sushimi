import { useQuery } from '@tanstack/react-query'
import { getProductsByCategory } from '@/lib/api'
import { Product } from '@/types'

export function useProductsByCategory(categorySlug: string) {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => getProductsByCategory(categorySlug),
    enabled: !!categorySlug, // Запрос выполняется только если есть categorySlug
  })
} 