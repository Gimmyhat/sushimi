import { useMutation } from '@tanstack/react-query'
import { checkPromoCode } from '@/lib/api'
import { Promotion } from '@/types'

export function usePromoCode() {
  return useMutation<Promotion | null, Error, string>({
    mutationFn: (code: string) => checkPromoCode(code),
  })
} 