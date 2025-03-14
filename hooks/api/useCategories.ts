import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/lib/api'
import { Category } from '@/types'

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
} 