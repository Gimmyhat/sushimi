"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Phone, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/cart-provider'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Меню', href: '/menu' },
  { name: 'Акции', href: '/promotions' },
  { name: 'О нас', href: '/about' },
  { name: 'Доставка', href: '/delivery' },
  { name: 'Контакты', href: '/contacts' },
]

export default function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-white shadow-sm' : 'bg-white'
    }`}>
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-10 w-10 overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">СМ</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">СушиМи</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium transition-colors hover:text-primary relative ${
                  pathname === item.href 
                    ? 'text-primary after:absolute after:bottom-[-1.5rem] after:left-0 after:right-0 after:h-[2px] after:bg-primary' 
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="tel:+73952123456" className="hidden md:flex items-center gap-2 text-base font-medium border border-gray-200 rounded-full px-5 py-2.5 hover:border-primary/50 hover:text-primary transition-colors">
            <Phone className="h-5 w-5" />
            <span>+7 (3952) 12-34-56</span>
          </a>
          
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative rounded-full border-gray-200 hover:border-primary/50 hover:text-primary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full border-gray-200 hover:border-primary/50 hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-gray-200 bg-white">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative h-10 w-10 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">СМ</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold gradient-text">СушиМи</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-base font-medium transition-colors hover:text-primary flex items-center justify-between ${
                        pathname === item.href ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <a href="tel:+73952123456" className="flex items-center gap-2 text-base font-medium text-primary">
                    <Phone className="h-5 w-5" />
                    <span>+7 (3952) 12-34-56</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}