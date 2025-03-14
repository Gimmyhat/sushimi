"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
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

// Типы действий для редьюсера
type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartItem[] };

// Состояние корзины
type CartState = {
  items: CartItem[];
};

// Редьюсер для управления состоянием корзины
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Если товар уже в корзине, увеличиваем количество
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return { ...state, items: updatedItems };
      } else {
        // Если товара нет в корзине, добавляем с количеством 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) return state;
      
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'INIT_CART':
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        dispatch({ type: 'INIT_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])
  
  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])
  
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: newItem });
    
    const existingItem = state.items.find(item => item.id === newItem.id);
    
    toast({
      title: "Товар добавлен в корзину",
      description: existingItem 
        ? `${newItem.name} (${existingItem.quantity + 1} шт.)` 
        : newItem.name,
    });
  }
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    
    toast({
      title: "Товар удален из корзины",
    });
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  }
  
  // Вычисляемые значения
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ 
      items: state.items, 
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