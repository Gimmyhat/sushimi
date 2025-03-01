# СушиМи - Доставка суши и роллов в Иркутске

Сайт для заказа суши и роллов в Иркутске с возможностью доставки.

## Технологии

- Next.js 13
- TypeScript
- Tailwind CSS
- PostgreSQL
- Docker

## Установка и запуск

1. Клонировать репозиторий:
```bash
git clone <репозиторий>
cd project
```

2. Установить зависимости:
```bash
npm install
```

3. Настроить переменные окружения:
```
Файл .env.local уже должен содержать следующие переменные:
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=sushi_db
```

4. Запустить базу данных PostgreSQL через Docker:
```bash
docker-compose up -d
```

5. Запустить проект в режиме разработки:
```bash
npm run dev
```

6. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

- `/app` - страницы приложения (Next.js App Router)
- `/components` - компоненты React
- `/hooks` - пользовательские React-хуки
- `/lib` - утилиты и функции для работы с базой данных
- `/public` - статические файлы
- `/sql` - SQL-скрипты для инициализации базы данных
- `/types` - типы TypeScript 