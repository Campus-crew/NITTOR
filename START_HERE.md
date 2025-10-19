# 🚀 Быстрый старт NITTOR

## Текущий статус

- ✅ Работает БЕЗ базы данных (in-memory)
- ✅ Интегрирован с **OpenAI** для генерации сценариев
- ✅ Интегрирован с **Higgsfield** для генерации видео
- ⚠️ Без API ключей работает в fallback режиме (демо данные)

## 🔑 Настройка API (опционально, но рекомендуется)

Для реальной AI генерации создайте `.env.local`:

```env
# OpenAI для умных сценариев
OPENAI_API_KEY=sk-ваш-ключ

# Higgsfield для генерации видео
HIGGSFIELD_API_KEY=ваш-ключ
HIGGSFIELD_API_URL=https://api.higgsfield.ai/v1
```

**Подробнее:** см. [API_SETUP.md](./API_SETUP.md)

## Запуск

```bash
npm run dev
```

Откройте: **http://localhost:3000/generate**

## Что работает прямо сейчас

### ✅ Создание сценария
1. Откройте вкладку **"Scenario"**
2. Введите тему видео (например: "Промо видео для продукта")
3. Нажмите **Send**
4. Получите 3 готовые сцены

### ✅ Генерация видео
1. Переключитесь на вкладку **"Video"**
2. Выберите режим:
   - **Description** - текстовое описание
   - **Images** - загрузка изображений

3. **Если выбрали Images:**
   - Нажмите "Upload images"
   - Выберите 1-10 изображений (макс 10MB каждое)
   - Увидите превью

4. Введите описание кадра
5. Нажмите **Send**
6. Наблюдайте прогресс генерации
7. Через ~10 секунд появится демо видео

### ✅ Монтажная область (Timeline)
- Внизу экрана видите timeline
- После генерации видео можно добавить на timeline
- Управление воспроизведением: Space / K

## Что НЕ работает без БД

- ❌ Сохранение проектов
- ❌ История генераций
- ❌ Персистентность между сессиями
- ❌ Каталог проектов пользователя

## Включить базу данных

### 1. Установите PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Или используйте Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

### 2. Создайте `.env.local`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nittor?schema=public"
```

### 3. Примените схему
```bash
npm run db:push
```

### 4. Раскомментируйте код

В файле `lib/prisma.ts` раскомментируйте весь код и удалите строку:
```typescript
export const prisma = null as any;
```

В API routes раскомментируйте код с пометкой:
```typescript
// TODO: Uncomment when DATABASE_URL is configured
```

Файлы для редактирования:
- `app/api/scene/generate/route.ts`
- `app/api/scenario/generate/route.ts`
- `app/api/jobs/[id]/route.ts`
- `app/api/projects/route.ts`
- `app/api/projects/[id]/route.ts`

### 5. Перезапустите
```bash
npm run dev
```

## Структура проекта

```
NITTOR/
├── app/
│   ├── api/              # API endpoints
│   │   ├── scene/        # Генерация видео
│   │   ├── scenario/     # Создание сценариев
│   │   ├── jobs/         # Статус задач
│   │   └── projects/     # Управление проектами
│   └── generate/         # Главная страница редактора
│
├── components/
│   └── editor/           # UI компоненты
│       ├── ChatPanel.tsx      # Чат для ввода
│       ├── ImageUpload.tsx    # Загрузка файлов
│       ├── VideoPreview.tsx   # Превью видео
│       ├── TimelineEditor.tsx # Монтажная область
│       └── SceneList.tsx      # Список сцен
│
├── lib/
│   ├── api.ts            # API клиент (React Query)
│   ├── store.ts          # Zustand state
│   └── prisma.ts         # Prisma client
│
├── prisma/
│   └── schema.prisma     # Database schema
│
└── public/
    └── uploads/          # Загруженные изображения
```

## API Endpoints

### Сценарии
- `POST /api/scenario/generate` - создать сценарий
  ```json
  { "topic": "Тема видео" }
  ```

### Генерация видео
- `POST /api/scene/generate` - начать генерацию (FormData)
  - `sceneId` - ID сцены
  - `mode` - "text" или "images"
  - `prompt` - описание
  - `images` - файлы (File[])

### Статус
- `GET /api/jobs/{jobId}` - прогресс генерации

### Проекты (требуется БД)
- `GET /api/projects?userId={id}` - список проектов
- `POST /api/projects` - создать проект
- `GET /api/projects/{id}` - детали проекта

## Технологии

- **Next.js 15** - React framework
- **TypeScript** - типизация
- **Tailwind CSS** - стили
- **Prisma** - ORM (опционально)
- **React Query** - data fetching
- **Zustand** - state management
- **shadcn/ui** - UI компоненты

## Troubleshooting

### Ошибка "Module not found: @prisma/client"
```bash
npm run db:generate
```

### Ошибка "Failed to start scene generation"
- Проверьте что сервер запущен
- Откройте DevTools → Console для деталей
- Проверьте Network tab

### Изображения не загружаются
- Создайте папку: `mkdir public/uploads`
- Проверьте права доступа

### Видео не появляется
- Подождите 10-15 секунд
- Проверьте вкладку Network → `/api/jobs/...`
- Статус должен стать "succeeded"

## Следующие шаги

1. ✅ Попробуйте создать сценарий
2. ✅ Сгенерируйте видео с изображениями
3. ✅ Проверьте timeline
4. 📚 Изучите код в `components/editor/`
5. 🗄️ Настройте БД для персистентности

## Документация

- **SETUP.md** - детальная установка
- **VERIFICATION.md** - проверка функций
- **NO_DB_MODE.md** - работа без БД
- **prisma/schema.prisma** - схема БД

---

**🎬 Готово к созданию видео!**
