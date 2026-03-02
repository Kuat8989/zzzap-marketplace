# Supabase Setup для Zzzap! ⚡️

## Шаг 1: Получить DATABASE_URL

1. Зайди на https://supabase.com
2. Выбери свой проект (или создай новый)
3. Перейди в **Settings** → **Database**
4. Найди **Connection string** → **URI**
5. Скопируй строку вида:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Шаг 2: Вставить в .env

Открой `/Users/kuat/.openclaw/workspace/project_zzzap/backend/.env`

Найди строку:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/zzzap
```

Замени на свою из Supabase:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Шаг 3: Создать таблицы в Supabase

1. В Supabase перейди в **SQL Editor**
2. Нажми **New Query**
3. Скопируй всё содержимое `backend/schema.sql`
4. Нажми **Run** (или Cmd+Enter)

Это создаст все таблицы:
- users
- products
- orders
- messages
- conversations
- follows
- likes

## Шаг 4: Проверить

После выполнения SQL, в Supabase перейди в **Table Editor** — должны появиться все таблицы.

---

## 📋 Чеклист

- [ ] DATABASE_URL вставлен в `.env`
- [ ] `schema.sql` выполнен в Supabase SQL Editor
- [ ] Таблицы видны в Table Editor

## 🚀 После этого

Запусти сервер:
```bash
cd /Users/kuat/.openclaw/workspace/project_zzzap/backend
npm run dev
```

Сервер будет на: http://localhost:3001
