# Flow - AI Video Generator

Веб-приложение для создания видео с помощью ИИ. Генерируйте сценарии, создавайте кадры и монтируйте всё в одном месте.

## Возможности

### ✅ Реализовано

- **Лендинг** (`/`) - главная страница с призывом к действию
- **Рабочее пространство** (`/generate`) - основной редактор
- **Генерация сценария** - ИИ создаёт структуру видео по теме
- **Два режима генерации кадров**:
  - Видео по описанию (текстовый промпт)
  - Видео по картинкам (загрузка изображений)
- **Чат-интерфейс** с двумя вкладками:
  - Сценарий - создание структуры видео
  - Видео - генерация отдельных кадров
- **Сохранение общих черт** между кадрами (персонажи, стиль)
- **Список сцен** с отображением статуса
- **Таймлайн-редактор** с тремя дорожками:
  - Видео
  - Аудио
  - Текст
- **Операции монтажа**:
  - Вырезать
  - Вставить
  - Ускорить
  - Замедлить
- **Плеер** с волновой формой аудио
- **Mock API** для тестирования без бэкенда
- **Zustand** для управления состоянием
- **React Query** для API-запросов
- **Zod** для валидации (готово к интеграции)
- **Темная тема** по умолчанию с жёлтыми акцентами

## Технологии

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** для стилей
- **shadcn/ui** для UI-компонентов
- **Zustand** для состояния
- **React Query** для серверных запросов
- **Zod** для валидации
- **Lucide React** для иконок
- **Sonner** для уведомлений

## Структура проекта

```
ai-video/
├── app/
│   ├── api/                    # Mock API routes
│   │   ├── scenario/generate/  # Генерация сценария
│   │   ├── scene/generate/     # Генерация кадра
│   │   └── jobs/[id]/          # Статус задачи
│   ├── generate/               # Страница редактора
│   ├── layout.tsx              # Root layout с Providers
│   └── page.tsx                # Лендинг
├── components/
│   ├── editor/                 # Компоненты редактора
│   │   ├── ChatPanel.tsx       # Чат для сценария/видео
│   │   ├── ImageUpload.tsx     # Загрузка изображений
│   │   ├── ModeSelector.tsx    # Выбор режима
│   │   ├── SceneList.tsx       # Список сцен
│   │   ├── TimelineEditor.tsx  # Таймлайн-редактор
│   │   └── VideoPreview.tsx    # Плеер с волной
│   └── ui/                     # shadcn/ui компоненты
├── lib/
│   ├── api.ts                  # API hooks (React Query)
│   ├── providers.tsx           # QueryClient + Toaster
│   ├── store.ts                # Zustand store
│   └── utils.ts                # Утилиты
└── public/                     # Статические файлы
```

## Запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен-сервера
npm start
```

Приложение будет доступно на `http://localhost:3000`

## Интеграция с бэкендом

### Текущее состояние
Сейчас используются mock API routes в `app/api/*` для демонстрации функционала.

### Для подключения реального бэкенда:

1. **Обновите API endpoints** в `lib/api.ts`:
   - Замените `/api/scenario/generate` на ваш endpoint
   - Замените `/api/scene/generate` на ваш endpoint
   - Замените `/api/jobs/:id` на ваш endpoint для статуса

2. **Добавьте переменные окружения** в `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com
   API_SECRET_KEY=your-secret-key
   ```

3. **Обновите типы** в `lib/api.ts` под ваши API-контракты

4. **Добавьте обработку файлов**:
   - Для загрузки изображений (mode="images")
   - Для загрузки аудио
   - Для скачивания готового видео

## API Контракты (ожидаемые)

### POST /api/scenario/generate
```typescript
Request: {
  topic?: string;
  brief?: string;
}

Response: {
  success: boolean;
  scenario: {
    topic: string;
    scenes: Array<{
      id: string;
      title: string;
      description: string;
      durationSec: number;
    }>;
    totalDuration: number;
  };
}
```

### POST /api/scene/generate
```typescript
Request: {
  sceneId: string;
  mode: "text" | "images";
  prompt?: string;
  images?: File[];
  traits?: Record<string, string | number>;
}

Response: {
  success: boolean;
  jobId: string;
  sceneId: string;
  status: string;
}
```

### GET /api/jobs/:id
```typescript
Response: {
  success: boolean;
  jobId: string;
  status: "queued" | "running" | "succeeded" | "failed";
  progress?: number;
  assetUrl?: string;
  error?: string;
}
```

## Следующие шаги

- [ ] Интеграция с реальным бэкендом
- [ ] Загрузка аудио-файлов
- [ ] Экспорт готового видео
- [ ] Продвинутые операции таймлайна (split, fade, transitions)
- [ ] Добавление текстовых оверлеев
- [ ] История изменений (undo/redo)
- [ ] Сохранение проектов
- [ ] Аутентификация пользователей
- [ ] Тесты (Vitest + Playwright)

## Лицензия

MIT
