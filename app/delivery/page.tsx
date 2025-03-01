import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Clock, MapPin, Truck, AlertCircle } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Доставка и оплата</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Информация о доставке</h2>
          <p className="text-muted-foreground mb-6">
            Мы доставляем свежие суши и роллы по всему Иркутску. Наша цель - привезти ваш заказ максимально быстро, чтобы вы могли насладиться блюдами в лучшем виде.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Зона доставки</h3>
                <p className="text-muted-foreground">Доставляем по всему Иркутску и ближайшим пригородам</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Время доставки</h3>
                <p className="text-muted-foreground">В среднем 60 минут. В часы пик может увеличиваться до 90 минут</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Стоимость доставки</h3>
                <p className="text-muted-foreground">При заказе от 2000 ₽ - бесплатно. В остальных случаях - 300 ₽</p>
              </div>
            </div>
          </div>
          
          <Button asChild size="lg">
            <Link href="/menu">Перейти к меню</Link>
          </Button>
        </div>
        
        <div className="relative h-[300px] md:h-auto rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Доставка суши"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Способы оплаты</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Наличными при получении</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Картой при получении</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Онлайн оплата на сайте</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Время работы</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Понедельник - Пятница</span>
                <span className="font-medium">10:00 - 23:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Суббота - Воскресенье</span>
                <span className="font-medium">10:00 - 23:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Праздничные дни</span>
                <span className="font-medium">10:00 - 23:00</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Самовывоз</h3>
            <p className="text-muted-foreground mb-4">
              Вы можете забрать заказ самостоятельно из любого нашего ресторана и получить скидку 10%.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contacts">Адреса ресторанов</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Зона доставки</h2>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Карта доставки"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 p-6 rounded-lg max-w-md text-center">
              <h3 className="font-semibold text-lg mb-2">Карта зоны доставки</h3>
              <p className="text-muted-foreground mb-4">
                Мы доставляем по всему Иркутску и ближайшим пригородам. Для уточнения возможности доставки по вашему адресу, пожалуйста, свяжитесь с нами.
              </p>
              <Button asChild>
                <a href="tel:+73952123456">Позвонить</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Часто задаваемые вопросы</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Как долго осуществляется доставка?</AccordionTrigger>
            <AccordionContent>
              Среднее время доставки составляет 60 минут. В часы пик или при неблагоприятных погодных условиях время доставки может увеличиваться до 90 минут.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Сколько стоит доставка?</AccordionTrigger>
            <AccordionContent>
              При заказе на сумму от 2000 ₽ доставка осуществляется бесплатно. В остальных случаях стоимость доставки составляет 300 ₽.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Можно ли заказать доставку на определенное время?</AccordionTrigger>
            <AccordionContent>
              Да, вы можете заказать доставку к определенному времени. При оформлении заказа выберите опцию "Доставка ко времени" и укажите удобное для вас время.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Как оплатить заказ?</AccordionTrigger>
            <AccordionContent>
              Вы можете оплатить заказ наличными или картой при получении, а также онлайн на нашем сайте при оформлении заказа.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>Что делать, если я не получил заказ вовремя?</AccordionTrigger>
            <AccordionContent>
              Если время ожидания превысило указанное, пожалуйста, свяжитесь с нами по телефону +7 (3952) 12-34-56. Мы проверим статус вашего заказа и предоставим актуальную информацию.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="mt-12 bg-muted p-6 rounded-lg flex items-start">
        <AlertCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-lg mb-2">Важная информация</h3>
          <p className="text-muted-foreground">
            В связи с высоким спросом в выходные и праздничные дни, а также в вечернее время, время доставки может быть увеличено. Мы всегда стараемся доставить ваш заказ как можно быстрее, сохраняя качество блюд.
          </p>
        </div>
      </div>
    </div>
  )
}