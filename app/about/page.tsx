import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">О нас</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">СушиМастер Иркутск</h2>
          <p className="text-muted-foreground mb-4">
            Мы - команда профессионалов, влюбленных в японскую кухню. Наша миссия - доставлять свежие и вкусные суши и роллы жителям Иркутска, сохраняя аутентичность вкуса и высокое качество блюд.
          </p>
          <p className="text-muted-foreground mb-4">
            СушиМастер начал свою работу в 2018 году как небольшое семейное предприятие. За эти годы мы выросли, но сохранили главное - внимание к каждому клиенту и безупречное качество нашей продукции.
          </p>
          <p className="text-muted-foreground">
            Мы используем только свежие ингредиенты, работаем с проверенными поставщиками и постоянно совершенствуем наши рецепты, чтобы радовать вас новыми вкусами.
          </p>
        </div>
        <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Наша команда"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-center">Наши преимущества</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Свежие ингредиенты</h3>
            <p className="text-muted-foreground">
              Мы закупаем продукты каждый день, чтобы гарантировать свежесть и качество наших блюд.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Опытные повара</h3>
            <p className="text-muted-foreground">
              Наши шеф-повара имеют многолетний опыт работы и регулярно повышают свою квалификацию.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
            <p className="text-muted-foreground">
              Мы доставляем заказы в течение 60 минут по всему Иркутску, чтобы вы могли насладиться свежими блюдами.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Наша история</h2>
      <div className="space-y-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
              2018
            </div>
          </div>
          <div className="md:w-3/4">
            <h3 className="font-semibold text-lg mb-2">Открытие</h3>
            <p className="text-muted-foreground">
              СушиМастер открыл свои двери в небольшом помещении в центре Иркутска. Начали с небольшого меню и доставки по центральным районам города.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
              2020
            </div>
          </div>
          <div className="md:w-3/4">
            <h3 className="font-semibold text-lg mb-2">Расширение</h3>
            <p className="text-muted-foreground">
              Расширили меню, добавили новые категории блюд и увеличили зону доставки на весь город. Открыли второе заведение в спальном районе.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
              2023
            </div>
          </div>
          <div className="md:w-3/4">
            <h3 className="font-semibold text-lg mb-2">Сегодня</h3>
            <p className="text-muted-foreground">
              Сегодня СушиМастер - это сеть из трех заведений с собственной службой доставки, широким ассортиментом блюд и тысячами довольных клиентов.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-center">Наша команда</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'Алексей Иванов', position: 'Шеф-повар', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
          { name: 'Елена Петрова', position: 'Су-шеф', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
          { name: 'Дмитрий Сидоров', position: 'Менеджер', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
          { name: 'Анна Козлова', position: 'Администратор', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' }
        ].map((member, index) => (
          <div key={index} className="text-center">
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <Image 
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-muted-foreground">{member.position}</p>
          </div>
        ))}
      </div>
    </div>
  )
}