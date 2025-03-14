import { useQuery } from '@tanstack/react-query'
import { getPopularProducts } from '@/lib/api'
import { Product } from '@/types'

export function usePopularProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'popular'],
    queryFn: getPopularProducts,
  })
} 