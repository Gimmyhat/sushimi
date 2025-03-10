# Sushimi - Веб-приложение для доставки суши

Современный сайт доставки суши и роллов, разработанный с использованием Next.js и PostgreSQL.

## Технологии

- **Фронтенд**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS
- **База данных**: PostgreSQL
- **Хостинг**: Vercel + Neon PostgreSQL

## Функциональность

- Просмотр меню по категориям
- Детальные страницы товаров
- Корзина покупок
- Оформление заказа
- Акции и промокоды

## Установка и запуск

### Локальная разработка

1. **Клонирование репозитория**

```bash
git clone https://github.com/your-username/sushimi.git
cd sushimi
```

2. **Установка зависимостей**

```bash
npm install
```

3. **Настройка локальной базы данных**

- Запустите PostgreSQL локально или в контейнере Docker
- Создайте базу данных с именем `sushimi`
- Скопируйте файл `.env.local.example` в `.env.local` и заполните настройки подключения

```bash
cp .env.local.example .env.local
```

4. **Инициализация базы данных**

```bash
npm run db:init
```

5. **Запуск приложения**

```bash
npm run dev
```

После этого приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

### Развертывание на Vercel

1. **Настройка базы данных**

- Создайте базу данных в Neon (https://neon.tech)
- Скопируйте строку подключения (`DATABASE_URL`)

2. **Настройка проекта на Vercel**

- Подключите ваш GitHub репозиторий к Vercel
- В настройках проекта добавьте следующие переменные окружения:
  * `DATABASE_URL` - строка подключения к базе данных Neon
  * `USE_SSL` - установите в `true` для Neon

3. **Запустите развертывание**

Vercel автоматически запустит скрипт `npm run vercel-build`, который инициализирует базу данных и выполнит сборку приложения.

## Структура проекта

```
sushimi/
├── app/                # Next.js App Router
│   ├── api/            # API маршруты
│   ├── cart/           # Страница корзины
│   ├── checkout/       # Страница оформления заказа
│   ├── menu/           # Страница меню
│   ├── promotions/     # Страница акций
│   └── page.tsx        # Главная страница
├── components/         # React компоненты
│   ├── features/       # Функциональные компоненты
│   ├── layouts/        # Компоненты макетов
│   ├── shared/         # Общие компоненты
│   └── ui/             # UI компоненты
├── lib/                # Утилиты и библиотеки
│   ├── api.ts          # API функции
│   └── db.ts           # Функции для работы с базой данных
├── public/             # Статические файлы
│   └── images/         # Изображения
├── scripts/            # Вспомогательные скрипты
│   └── init-db.js      # Скрипт инициализации БД
└── types/              # TypeScript типы
```

## Разработка

Проект следует дорожной карте, описанной в файле ROADMAP.md. Основные направления разработки:

1. Декомпозиция компонентов
2. Улучшение типизации
3. Оптимизация управления состоянием
4. API и обработка ошибок
5. Улучшение UX и производительности
6. Безопасность и валидация данных
7. Тестирование
8. CI/CD и мониторинг

## Лицензия

MIT 