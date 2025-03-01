import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="container py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Спасибо за ваш заказ! В ближайшее время с вами свяжется оператор для подтверждения заказа.
        Вы также получите SMS-уведомление о статусе вашего заказа.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/">Вернуться на главную</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/menu">Продолжить покупки</Link>
        </Button>
      </div>
    </div>
  )
}