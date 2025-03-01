import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'

export default function PromotionsPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Акции и специальные предложения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[
          {
            title: 'Скидка 20% на все сеты',
            description: 'Используйте промокод "СЕТИРК" при заказе любого сета и получите скидку 20%. Акция действует при заказе от 1500 ₽.',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: '01.06.2025 - 30.06.2025',
            promo: 'СЕТИРК',
            link: '/menu?category=sets'
          },
          {
            title: 'Бесплатная доставка',
            description: 'При заказе от 2000 ₽ доставка бесплатно по всему Иркутску. Акция действует постоянно.',
            image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: 'Постоянная акция',
            link: '/menu'
          },
          {
            title: 'Скидка 10% на самовывоз',
            description: 'Заберите заказ самостоятельно из любого нашего ресторана и получите скидку 10% на весь заказ.',
            image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: 'Постоянная акция',
            link: '/contacts'
          },
          {
            title: 'Счастливые часы',
            description: 'Каждый будний день с 14:00 до 17:00 скидка 15% на все меню. Отличная возможность попробовать наши блюда по выгодной цене.',
            image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: 'Постоянная акция',
            link: '/menu'
          }
        ].map((promo, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-64">
              <Image 
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">Акция</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center text-muted-foreground mb-2">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span className="text-sm">{promo.date}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{promo.title}</h2>
              <p className="text-muted-foreground mb-4">{promo.description}</p>
              {promo.promo && (
                <div className="bg-muted p-3 rounded-md text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Промокод:</p>
                  <p className="font-bold text-lg">{promo.promo}</p>
                </div>
              )}
              <Button asChild className="w-full">
                <Link href={promo.link}>Воспользоваться</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Программа лояльности</h2>
      <div className="bg-card border rounded-lg p-6 md:p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Накопительная система скидок</h3>
            <p className="text-muted-foreground mb-4">
              Становитесь участником нашей программы лояльности и получайте скидки на каждый заказ. Чем больше вы заказываете, тем выше ваша скидка!
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Сумма заказов от 5 000 ₽ - скидка 5%</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Сумма заказов от 10 000 ₽ - скидка 7%</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Сумма заказов от 20 000 ₽ - скидка 10%</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Сумма заказов от 50 000 ₽ - скидка 15%</span>
              </li>
            </ul>
            <Button>Стать участником</Button>
          </div>
          <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="Программа лояльности"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Специальные предложения</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">День рождения</h3>
            <p className="text-muted-foreground mb-4">
              В день вашего рождения и 3 дня до и после получите скидку 15% на весь заказ. Просто предъявите документ, подтверждающий дату рождения.
            </p>
            <Button variant="outline" className="w-full">Подробнее</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Корпоративные заказы</h3>
            <p className="text-muted-foreground mb-4">
              Специальные условия для корпоративных клиентов. Индивидуальный подход, скидки и бонусы при регулярных заказах.
            </p>
            <Button variant="outline" className="w-full">Подробнее</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Подписка на новости</h3>
            <p className="text-muted-foreground mb-4">
              Подпишитесь на нашу рассылку и получайте информацию о новых акциях и специальных предложениях первыми.
            </p>
            <Button variant="outline" className="w-full">Подписаться</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}