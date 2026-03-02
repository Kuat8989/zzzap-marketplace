# Zzzap! — Design & Architecture Spec

## 1. Структура приложения (Sitemap)

### 0. Onboarding & Auth (Вход)
*Бэкенд: User Auth, JWT Tokens*
- **Splash Screen:** Логотип Zzzap! (анимация молнии).
- **Login/Register:** Вход по номеру телефона / Google / Apple.
- **OTP Verification:** Ввод кода из SMS.
- **Profile Setup:** Имя, юзернейм, выбор города (Астана/Алматы и т.д.), интересы.

### 1. Tab: Home (Лента) 🏠
*Бэкенд: Feed Algorithm, Video Streaming*
- **Main Feed:** Вертикальная лента (как TikTok/Reels), но с товарами.
  - *Элементы:* Видео товара, цена, кнопка "Купить", лайк, шер.
- **Item Detail (Modal):** Если нажать на описание — открывается карточка товара с подробностями.

### 2. Tab: Discover (Поиск) 🧭
*Бэкенд: Search Engine (Elasticsearch), Categories*
- **Search Page:** Поисковая строка, популярные теги.
- **Categories:** Электроника, Дом, Одежда и т.д.
- **Filter Modal:** Фильтр по цене, состоянию (новое/б/у), локации.
- **Search Results:** Сетка товаров (Grid View).

### 3. Tab: Create (+) (Создание) 📹
*Бэкенд: Media Upload (S3), Video Processing*
- **Camera:** Съемка видео/фото.
- **Editor:** Обрезка, наложение фильтров (Zzzap FX).
- **Listing Details:**
  - Название товара.
  - Цена.
  - Описание.
  - Категория.
  - Локация.
- **Success Screen:** "Товар опубликован!" + "Поделиться".

### 4. Tab: Saved / Notifications (Избранное) 🔖
*Бэкенд: Wishlist, Push Notifications*
- **Saved Items:** Товары, которые лайкнули.
- **Notifications:** "Ваш товар купили", "Новый подписчик", "Цена снижена".

### 5. Tab: Profile (Профиль) 👤
*Бэкенд: User Profile, Orders, Rating System*
- **Profile Header:** (То, что уже есть на дизайне) Аватар, Followers/Following, Sold count.
- **Gold Status Widget:** Прогресс-бар или условия получения статуса.
- **My Listings:** Сетка моих товаров (Active / Sold).
- **Settings:** Редактировать профиль, Доставка, Платежные данные.

---

## 2. Важные дополнительные флоу (Бэкенд + Дизайн)

### 🛒 Checkout Flow (Покупка)
*Самое важное для денег!*
1. **Cart / Buy Now:** Экран подтверждения заказа.
2. **Delivery Address:** Выбор адреса.
3. **Payment:** Выбор карты / Apple Pay.
4. **Order Status:** "Ожидает отправки" -> "В пути" -> "Доставлено".

### 💬 Chat (Сообщения)
*Для кнопки "Message"*
1. **Chat List:** Список диалогов.
2. **Chat Room:** Переписка покупателя и продавца. Возможность отправить оффер ("Куплю за 5000").

### 🏆 Gamification (Gold Status)
1. **Status Page:** Экран, объясняющий преимущества Gold (меньше комиссия, бейджик).
2. **Achievements:** Список заданий (например, "Продай 5 товаров").

---

## 3. Data Models (Для бэкенда)

Разработчикам нужно будет создать такие сущности:
- **User:** `id`, `username`, `is_gold`, `location`, `rating`.
- **Product:** `id`, `seller_id`, `price`, `video_url`, `status` (active/sold).
- **Order:** `id`, `buyer_id`, `product_id`, `amount`, `delivery_status`.
- **Chat:** `id`, `participants`, `messages`.
