# NITTOR Setup Guide

## Основной функционал

Система включает:
- ✅ **Каталог проектов** для каждого пользователя
- ✅ **Сценарии с несколькими сценами** в каждом проекте
- ✅ **Генерация видео** для каждой сцены
- ✅ **Сохранение результатов** в базе данных
- ✅ **Загрузка изображений** через FormData
- ✅ **Монтажная область** (timeline) для работы с видео

## Установка

### 1. Установите зависимости

```bash
pnpm install
```

### 2. Настройте базу данных

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Отредактируйте `.env.local` и укажите URL вашей PostgreSQL базы данных:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nittor?schema=public"
```

### 3. Примените схему базы данных

```bash
pnpm db:push
```

Это создаст все необходимые таблицы:
- `User` - пользователи
- `Project` - проекты пользователей
- `Scenario` - сценарии в проектах
- `Scene` - сцены в сценариях
- `GeneratedResult` - результаты генерации видео
- `UploadedImage` - загруженные изображения

### 4. Запустите проект

```bash
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`

## Структура API

### Проекты

**GET** `/api/projects?userId={userId}` - получить все проекты пользователя

**POST** `/api/projects` - создать новый проект
```json
{
  "name": "Мой проект",
  "description": "Описание",
  "userId": "user-id"
}
```

**GET** `/api/projects/{id}` - получить проект с сценариями и сценами

**PATCH** `/api/projects/{id}` - обновить проект

**DELETE** `/api/projects/{id}` - удалить проект

### Сценарии

**POST** `/api/scenario/generate` - создать сценарий
```json
{
  "topic": "Тема видео",
  "projectId": "project-id"
}
```

### Генерация сцен

**POST** `/api/scene/generate` - начать генерацию видео для сцены

Отправляется как **FormData**:
- `sceneId` - ID сцены
- `mode` - "text" или "images"
- `prompt` - текстовое описание (опционально)
- `traits` - JSON с характеристиками (опционально)
- `images` - файлы изображений (массив File[])

### Статус задачи

**GET** `/api/jobs/{jobId}` - получить статус генерации

Ответ:
```json
{
  "success": true,
  "jobId": "job-123",
  "status": "queued|running|succeeded|failed",
  "progress": 50,
  "assetUrl": "https://...",
  "error": null
}
```

## Функции фронтенда

### Загрузка файлов

Компонент `ImageUpload` (`components/editor/ImageUpload.tsx`):
- ✅ Валидация типов файлов (только изображения)
- ✅ Ограничение размера (макс. 10MB)
- ✅ Превью загруженных изображений
- ✅ Удаление изображений
- ✅ Передача File[] в родительский компонент

### Отправка данных

Функция `generateScene` в `lib/api.ts`:
- ✅ Создает FormData
- ✅ Добавляет текстовые поля
- ✅ Добавляет файлы изображений
- ✅ Отправляет без заголовка Content-Type (браузер устанавливает автоматически)

### Получение данных

- ✅ `useProjects(userId)` - список проектов
- ✅ `useGenerateScenario()` - создание сценария
- ✅ `useGenerateScene()` - запуск генерации
- ✅ `useJobStatus(jobId)` - отслеживание прогресса (polling каждые 2 сек)

## Workflow генерации видео

1. **Создание проекта** → `POST /api/projects`
2. **Генерация сценария** → `POST /api/scenario/generate` с `projectId`
3. **Для каждой сцены:**
   - Пользователь загружает изображения (опционально)
   - Вводит текстовое описание
   - Нажимает "Generate" → `POST /api/scene/generate` (FormData)
   - Получает `jobId`
   - Фронтенд автоматически опрашивает `GET /api/jobs/{jobId}`
   - Когда `status === "succeeded"`, получает `assetUrl`
   - Видео отображается в `VideoPreview`
4. **Монтаж** - пользователь размещает сгенерированные видео на timeline

## База данных

Схема находится в `prisma/schema.prisma`

Полезные команды:
```bash
pnpm db:generate  # Генерация Prisma Client
pnpm db:push      # Применение схемы к БД
pnpm db:studio    # Открыть Prisma Studio (GUI для БД)
```

## Проверка функций отправки/получения файлов

### ✅ Фронтенд
- `ImageUpload.tsx` - корректно обрабатывает File[]
- `ChatPanel.tsx` - передает images в `generateScene`
- `lib/api.ts` - создает FormData и отправляет файлы

### ✅ Бэкенд
- `app/api/scene/generate/route.ts` - принимает FormData
- Извлекает файлы через `formData.getAll("images")`
- Сохраняет файлы в `public/uploads/`
- Создает записи в БД

### ✅ Типы данных
- Все интерфейсы определены в `lib/api.ts`
- TypeScript проверяет типы на этапе компиляции

## Следующие шаги

1. **Аутентификация** - добавить NextAuth.js
2. **Реальная генерация видео** - интеграция с Higgsfield API
3. **Облачное хранилище** - S3/Cloudinary для файлов
4. **WebSocket** - real-time обновления прогресса
5. **Экспорт видео** - финальный рендеринг timeline

## Troubleshooting

**Ошибка "Cannot find module '@prisma/client'"**
```bash
pnpm db:generate
```

**Ошибка подключения к БД**
- Проверьте `DATABASE_URL` в `.env.local`
- Убедитесь, что PostgreSQL запущен

**Файлы не загружаются**
- Проверьте, что папка `public/uploads` существует
- Проверьте права доступа к папке
