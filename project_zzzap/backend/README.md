# Zzzap! Backend 🚀

Mobile-optimized marketplace API для Zzzap!

## 📱 Mobile-First Особенности

- **Оптимизированные ответы** — минимальный размер payload
- **Cursor-based пагинация** — для бесконечной ленты
- **Rate limiting** — защита от злоупотреблений
- **Кэширование** — 1 минута для мобильных клиентов
- **Video-first** — загрузка и сжатие видео

## 🚀 Быстрый Старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка окружения

```bash
cp .env.example .env
# Отредактируйте .env с вашими данными
```

### 3. База данных

```bash
# Создайте БД PostgreSQL
createdb zzzap

# Импортируйте схему
psql -U postgres -d zzzap -f schema.sql
```

### 4. Запуск сервера

```bash
# Development
npm run dev

# Production
npm start
```

Сервер запустится на `http://localhost:3000`

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/login` — Вход по телефону (OTP)
- `POST /api/v1/auth/verify` — Проверка OTP
- `POST /api/v1/auth/logout` — Выход

### Users
- `GET /api/v1/users/me` — Мой профиль
- `PUT /api/v1/users/me` — Обновить профиль
- `GET /api/v1/users/:id` — Чужой профиль
- `POST /api/v1/users/:id/follow` — Подписаться

### Feed
- `GET /api/v1/feed/main` — Основная лента
- `GET /api/v1/feed/search` — Поиск
- `GET /api/v1/feed/trending` — Тренды

### Products
- `POST /api/v1/products` — Создать товар (с видео)
- `GET /api/v1/products/:id` — Детали товара
- `PUT /api/v1/products/:id` — Обновить
- `DELETE /api/v1/products/:id` — Удалить
- `POST /api/v1/products/:id/like` — Лайк

### Orders
- `POST /api/v1/orders/create` — Создать заказ
- `POST /api/v1/orders/:id/pay` — Оплата
- `GET /api/v1/orders/me` — Мои заказы

### Chat
- `GET /api/v1/conversations` — Список чатов
- `GET /api/v1/conversations/:id/messages` — История
- `POST /api/v1/conversations/:id/messages` — Отправить

### Gamification
- `GET /api/v1/gamification/status` — Статус Gold
- `POST /api/v1/gamification/claim-gold` — Получить Gold
- `GET /api/v1/gamification/leaderboard` — Топ пользователей

## 📁 Структура

```
backend/
├── src/
│   ├── server.js          # Точка входа
│   ├── routes/
│   │   ├── auth.js        # Авторизация
│   │   ├── users.js       # Пользователи
│   │   ├── feed.js        # Лента
│   │   ├── products.js    # Товары
│   │   ├── orders.js      # Заказы
│   │   ├── chat.js        # Чат
│   │   └── gamification.js # Геймификация
│   ├── models/            # DB модели (TODO)
│   ├── middleware/        # Middleware (TODO)
│   └── utils/             # Утилиты (TODO)
├── uploads/               # Загруженные файлы
├── schema.sql             # Схема БД
├── api_spec.md            # Спецификация API
├── package.json
└── .env.example
```

## 🔧 TODO для Продакшена

- [ ] Подключить реальную PostgreSQL БД
- [ ] Настроить AWS S3 для видео/изображений
- [ ] Добавить видео-процессинг (ffmpeg)
- [ ] Интегрировать SMS провайдер (Twilio/Firebase)
- [ ] Подключить Kaspi Pay / Stripe
- [ ] Добавить WebSocket для чата
- [ ] Настроить CDN (CloudFront)
- [ ] Добавить логирование (Winston)
- [ ] Настроить мониторинг

## 📱 Тестирование

### Проверка здоровья API
```bash
curl http://localhost:3000/api/v1/health
```

### Вход по телефону
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+77771234567"}'
```

## 🎯 Mobile Optimization

- Максимум 20 items на запрос в ленте
- Cursor-based пагинация (не offset!)
- Сжатые JSON ответы
- Cache-Control: 60 секунд
- Максимум 50MB на загрузку файла

## 📞 Поддержка

Вопросы? Пиши в чат разработчиков Zzzap!
