import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-gray-200">
      <div className="container py-16 md:py-20">
        <div className="flex flex-col gap-10">
          {/* Top section with newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-10 border-b border-gray-200">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative h-10 w-10 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">СМ</span>
                  </div>
                </div>
                <span className="text-xl font-bold gradient-text">СушиМи</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Погрузитесь в мир изысканной японской кухни с доставкой свежайших суши прямо к вашему столу.
              </p>
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-3">Подпишитесь на новости и акции</h4>
                <div className="flex gap-2">
                  <Input placeholder="Ваш email" className="bg-white" />
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="https://instagram.com" className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-gray-500 hover:text-primary hover:bg-white/80 transition-colors shadow-sm" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-gray-500 hover:text-primary hover:bg-white/80 transition-colors shadow-sm" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-gray-500 hover:text-primary hover:bg-white/80 transition-colors shadow-sm" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-4">Быстрые ссылки</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
                </li>
                <li>
                  <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">Меню</Link>
                </li>
                <li>
                  <Link href="/promotions" className="text-muted-foreground hover:text-primary transition-colors">Акции</Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">О нас</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-4">Информация</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/delivery" className="text-muted-foreground hover:text-primary transition-colors">Условия доставки</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Политика конфиденциальности</Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Часто задаваемые вопросы</Link>
                </li>
                <li>
                  <Link href="/payment" className="text-muted-foreground hover:text-primary transition-colors">Способы оплаты</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-4">Контакты</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <span className="text-sm">+7 (3952) 12-34-56</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <span className="text-sm">info@sushimi.ru</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <span className="text-sm">г. Иркутск, ул. Ленина, 1</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <span className="text-sm">Ежедневно с 10:00 до 23:00</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section with copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} СушиМи. Все права защищены.</p>
            <p className="mt-2 md:mt-0">Сделано с <span className="text-primary">♥</span> для ценителей японской кухни</p>
          </div>
        </div>
      </div>
    </footer>
  )
}