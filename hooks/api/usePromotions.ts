import { useQuery } from '@tanstack/react-query'
import { getPromotions } from '@/lib/api'
import { Promotion } from '@/types'

export function usePromotions() {
  return useQuery<Promotion[], Error>({
    queryKey: ['promotions'],
    queryFn: getPromotions,
  })
} 