import { Promotion } from '@/types'
import PromotionDetail from '@/components/features/PromotionDetail'

// Используем временное решение с мокированными данными, пока не настроено API
const mockPromotions: Promotion[] = [
  {
    id: "02c9808c-180e-4b7a-b17b-c08faa28ce6b",
    title: "Скидка 10% на первый заказ",
    description: "Скидка 10% для новых клиентов. Используйте этот промокод при оформлении первого заказа и получите приятную скидку. Предложение действительно только для новых клиентов и не может быть использовано с другими акциями.",
    promo_code: "FIRST10",
    discount_percent: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    start_date: "2023-01-01",
    end_date: "2025-12-31"
  },
  {
    id: "28cf6a47-bd86-4548-ab58-70ae86f75d8f",
    title: "Скидка 15% на сеты",
    description: "Скидка на все сеты до конца недели. Большой выбор сетов для любой компании со специальной скидкой. Воспользуйтесь этим промокодом при заказе любого сета из нашего меню и получите приятную скидку 15%.",
    promo_code: "SETS15",
    discount_percent: 15,
    is_active: true,
    created_at: new Date().toISOString(),
    start_date: "2023-01-01",
    end_date: "2025-12-31"
  }
];

// Функция для генерации статических путей (используется в серверном рендеринге)
export function generateStaticParams() {
  // Возвращаем массив объектов с параметрами для каждой акции
  return mockPromotions.map((promo) => ({
    id: promo.id,
  }));
}

// Это серверный компонент
export default function PromotionDetailPage({ params }: { params: { id: string } }) {
  // Находим акцию по ID
  const promotion = mockPromotions.find(promo => promo.id === params.id) || null;
  
  // Используем клиентский компонент для отображения страницы
  return <PromotionDetail initialPromotion={promotion} promotionId={params.id} />;
} 