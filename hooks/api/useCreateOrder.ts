import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder, OrderData } from '@/lib/api'
import { Order, OrderItem } from '@/types'

interface CreateOrderParams {
  orderData: OrderData;
  orderItems: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[];
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation<Order | null, Error, CreateOrderParams>({
    mutationFn: ({ orderData, orderItems }) => createOrder(orderData, orderItems),
    onSuccess: () => {
      // Инвалидируем кэш заказов при успешном создании нового заказа
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
} 