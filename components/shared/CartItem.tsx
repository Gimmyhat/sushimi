"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartItem({ id, name, price, quantity, image }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1)
    } else {
      removeItem(id)
    }
  }

  const increaseQuantity = () => {
    updateQuantity(id, quantity + 1)
  }

  return (
    <div className="flex items-start py-4 border-b last:border-0">
      <div className="relative w-16 h-16 bg-slate-100 rounded-md overflow-hidden mr-4 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Нет фото
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium truncate mb-1">{name}</h4>
        <p className="text-sm text-muted-foreground mb-2">
          {price} ₽ x {quantity} = {price * quantity} ₽
        </p>
        
        <div className="flex items-center">
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none" 
              onClick={decreaseQuantity}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none" 
              onClick={increaseQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 