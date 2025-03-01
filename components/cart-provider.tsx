"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  
  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])
  
  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])
  
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        // Если товар уже в корзине, увеличиваем количество
        const updatedItems = prevItems.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
        
        toast({
          title: "Товар добавлен в корзину",
          description: `${newItem.name} (${existingItem.quantity + 1} шт.)`,
        })
        
        return updatedItems
      } else {
        // Если товара нет в корзине, добавляем с количеством 1
        toast({
          title: "Товар добавлен в корзину",
          description: newItem.name,
        })
        
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }
  
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
    
    toast({
      title: "Товар удален из корзины",
    })
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }
  
  const clearCart = () => {
    setItems([])
  }
  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      subtotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}