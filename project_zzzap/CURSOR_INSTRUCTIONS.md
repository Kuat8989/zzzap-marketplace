# Zzzap! Backend + Frontend — Полное ТЗ для Cursor ⚡️

**Версия:** 1.0  
**Дата:** 2026-02-22  
**Для:** Cursor AI (код-ассистент)

---

## 🎯 Цель

Создать **полностью рабочий** бэкенд + фронтенд для Zzzap! — маркетплейса с видео-лентой (TikTok-style).

---

## 📁 Структура проекта

```
project_zzzap/
├── backend/
│   ├── src/
│   │   ├── server.js          # Точка входа (Express)
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # DB модели
│   │   ├── middleware/        # Auth, upload, etc.
│   │   └── utils/             # Helpers
│   ├── uploads/               # Загруженные файлы
│   ├── schema.sql             # PostgreSQL схема
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html             # Mobile-first приложение
│   └── mobile-app.html        # PWA версия
└── docs/
    └── CURSOR_INSTRUCTIONS.md # Этот файл
```

---

## 🔧 Backend Требования

### 1. Стек технологий
- **Node.js** + **Express**
- **PostgreSQL** (база данных)
- **JWT** (авторизация)
- **Multer** (загрузка файлов)
- **nodemon** (dev server)

### 2. API Endpoints (ВСЕ должны работать!)

#### Auth (Авторизация)
```
POST /api/v1/auth/login      # Отправить OTP на телефон
POST /api/v1/auth/verify     # Проверить OTP, вернуть JWT
POST /api/v1/auth/logout     # Выход
```

#### Users (Пользователи)
```
GET  /api/v1/users/me        # Мой профиль (требует JWT)
PUT  /api/v1/users/me        # Обновить профиль
GET  /api/v1/users/:id       # Чужой профиль
POST /api/v1/users/:id/follow    # Подписаться
DELETE /api/v1/users/:id/follow  # Отписаться
```

#### Feed (Лента)
```
GET /api/v1/feed/main        # Основная лента (cursor pagination)
GET /api/v1/feed/search      # Поиск (q, category, price range)
GET /api/v1/feed/trending    # Тренды (по лайкам/просмотрам)
```

#### Products (Товары)
```
POST   /api/v1/products            # Создать (с видео!)
GET    /api/v1/products/:id        # Детали товара
PUT    /api/v1/products/:id        # Обновить
DELETE /api/v1/products/:id        # Удалить
POST   /api/v1/products/:id/like   # Лайк
DELETE /api/v1/products/:id/like   # Убрать лайк
```

#### Orders (Заказы)
```
POST /api/v1/orders/create    # Создать заказ
POST /api/v1/orders/:id/pay   # Оплатить (Kaspi/Stripe)
GET  /api/v1/orders/me        # Мои заказы (покупки + продажи)
GET  /api/v1/orders/:id       # Детали заказа
```

#### Chat (Сообщения)
```
GET    /api/v1/conversations           # Список чатов
POST   /api/v1/conversations           # Новый чат
GET    /api/v1/conversations/:id/messages  # История
POST   /api/v1/conversations/:id/messages  # Отправить сообщение
PUT    /api/v1/conversations/:id/read    # Прочитано
```

#### Gamification (Gold статус)
```
GET  /api/v1/gamification/status      # Мой прогресс
POST /api/v1/gamification/claim-gold  # Получить Gold
GET  /api/v1/gamification/leaderboard # Топ пользователей
```

### 3. База данных (PostgreSQL)

Использовать `backend/schema.sql` — там уже есть все таблицы:
- `users` — пользователи
- `products` — товары (с video_url!)
- `orders` — заказы
- `messages` — сообщения
- `conversations` — чаты
- `follows`, `likes` — социалка

**Важно:** Подключить реальную БД, не mock-данные!

### 4. Загрузка файлов
- Видео: MP4, MOV (макс. 50MB)
- Фото: JPEG, PNG, WebP (макс. 10MB)
- Хранить: локально в `uploads/` (потом S3)

### 5. Авторизация
- JWT токен (7 дней)
- Middleware `authMiddleware` для защищённых routes
- Токен передаётся в заголовке: `Authorization: Bearer <token>`

---

## 📱 Frontend Требования

### 1. Mobile-First Design
- Адаптивно под любой телефон
- Нижняя навигация (4 вкладки)
- TikTok-style вертикальная лента

### 2. Экраны

#### Главная (Feed)
- Вертикальный скролл видео-карточек
- Кнопки: ❤️ Like, 💬 Comment, 🔗 Share
- Инфо: цена, название, продавец (с Gold бейджем)

#### Поиск (Discover)
- Поисковая строка
- Категории (Electronics, Fashion, Home...)
- Фильтры: цена, состояние, локация

#### Создание (+)
- Загрузка видео (с камеры или галереи)
- Форма: название, цена, описание, категория
- Предпросмотр перед публикацией

#### Заказы (Orders)
- Вкладки: Покупки / Продажи
- Статусы: pending, paid, shipped, delivered
- Трекинг заказа

#### Профиль (Profile)
- Аватар, имя, bio, город
- Gold статус (прогресс-бар)
- Мои товары (активные / проданные)
- Followers / Following

### 3. API Integration
- Все запросы через `fetch()`
- Базовый URL: `http://localhost:3001/api/v1`
- JWT токен хранить в `localStorage`
- Обработка ошибок (показывать toast/alert)

---

## 🚀 Команды для запуска

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Отредактировать .env (DATABASE_URL, JWT_SECRET)
npm run dev
# Сервер на http://localhost:3001
```

### Frontend
```bash
# Просто открыть в браузере
open frontend/index.html
# Или через live server
npx serve frontend
```

---

## ✅ Чеклист готовности

### Backend
- [ ] Сервер запускается без ошибок
- [ ] Все 7 модулей routes работают
- [ ] PostgreSQL подключена
- [ ] JWT авторизация работает
- [ ] Загрузка видео работает
- [ ] Health check: `GET /api/v1/health`

### Frontend
- [ ] Лента загружается с API
- [ ] Вход по телефону (OTP)
- [ ] Создание товара (с видео)
- [ ] Лайки/комментарии работают
- [ ] Профиль редактируется
- [ ] Адаптивно под мобильные

---

## 🎨 Дизайн-референсы

Смотреть файлы:
- `dashboard.html` — стиль карточек агентов
- `pixel_office.html` — pixel-art стиль (опционально)
- `frontend/index.html` — текущая заглушка

**Основной стиль:**
- Тёмная тема (#000 фон)
- Неоновые акценты (#00ffff, #ff00ff)
- Градиенты
- Анимации (pulse, glow)

---

## 📞 Если что-то непонятно

1. Спроси у пользователя (Куат)
2. Посмотри `backend/schema.sql` — там структура БД
3. Посмотри `backend/api_spec.md` — там спецификация API
4. Посмотри `ZZZAP_ARCHITECTURE.md` — там user flows

---

## ⚠️ Частые ошибки (не делай так!)

❌ Не используй mock-данные там, где нужна БД  
❌ Не забывай middleware `authMiddleware` для защищённых routes  
❌ Не делай frontend без API integration  
❌ Не забывай обработку ошибок (try/catch)  
❌ Не игнорируй mobile-first (проверяй на узком экране)

---

**Готово! Теперь Cursor поймёт, что нужно сделать.** 🍶
