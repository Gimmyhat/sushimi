import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react'

export default function ContactsPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Контакты</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Телефон</h2>
            <p className="text-muted-foreground mb-4">Для заказов и вопросов</p>
            <a href="tel:+73952123456" className="text-primary font-medium">+7 (3952) 12-34-56</a>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-muted-foreground mb-4">Для предложений и сотрудничества</p>
            <a href="mailto:info@sushimaster-irk.ru" className="text-primary font-medium">info@sushimaster-irk.ru</a>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground p-4 rounded-full mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Время работы</h2>
            <p className="text-muted-foreground mb-4">Ежедневно</p>
            <p className="font-medium">10:00 - 23:00</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Наши адреса</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">СушиМастер в центре</h3>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>г. Иркутск, ул. Ленина, 1</span>
                </div>
                <div className="flex items-start mb-4">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>+7 (3952) 12-34-56</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Показать на карте</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">СушиМастер на Университетском</h3>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>г. Иркутск, мкр. Университетский, 100</span>
                </div>
                <div className="flex items-start mb-4">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>+7 (3952) 12-34-57</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Показать на карте</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">СушиМастер в Солнечном</h3>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>г. Иркутск, мкр. Солнечный, 50</span>
                </div>
                <div className="flex items-start mb-4">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>+7 (3952) 12-34-58</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Показать на карте</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Имя</label>
                    <input 
                      id="name" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input 
                      id="email" 
                      type="email" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Тема</label>
                  <input 
                    id="subject" 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Сообщение</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Отправить</Button>
              </form>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-semibold mt-8 mb-6">Мы в социальных сетях</h2>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </a>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}