# Frontend API Integration Structure

Полная структура для работы с Kernel Video Generation API.

## 📁 Структура файлов

```
lib/
├── api/                      # API клиенты
│   ├── client.ts            # HTTP клиент с перехватчиками
│   ├── auth.ts              # Аутентификация (login, register, OAuth)
│   ├── projects.ts          # Проекты, треки, файлы
│   ├── scenarios.ts         # Сценарии и шаги
│   ├── generation.ts        # Text-to-Image, Image-to-Video
│   └── index.ts             # Централизованные экспорты
│
├── hooks/                   # React Query хуки
│   ├── use-auth.ts          # useLogin, useCurrentUser, useLogout
│   ├── use-projects.ts      # useProjects, useCreateProject, useTracks
│   ├── use-scenarios.ts     # useProjectScenario, useScenarioSteps
│   ├── use-generation.ts    # useTextToImage, useJobStatus, polling
│   └── index.ts
│
├── types/
│   └── api.ts               # TypeScript типы из OpenAPI spec
│
├── store.ts                 # Zustand state management
├── providers.tsx            # React Query Provider
├── utils.ts                 # Утилиты
└── API_GUIDE.md            # Подробная документация
```

## 🚀 Быстрый старт

### 1. Настройка окружения

```bash
# Создайте .env.local (пример в .env.local.example)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Аутентификация

```typescript
import { useLogin, useCurrentUser } from "@/lib/hooks";

const { data: user } = useCurrentUser();
const login = useLogin();

login.mutate({ email: "user@example.com", password: "pass" });
```

### 3. Работа с проектами

```typescript
import { useProjects, useCreateProject } from "@/lib/hooks";

const { data: projects } = useProjects();
const createProject = useCreateProject();

createProject.mutate({ 
  name: "My Project",
  description: "Description" 
});
```

### 4. Генерация контента

```typescript
import { useTextToImageAndWait } from "@/lib/hooks";

const { mutateAsync, progress } = useTextToImageAndWait();

const result = await mutateAsync({
  prompt: "Beautiful landscape",
  quality: "1080p",
});
```

## 📚 Ключевые возможности

### ✅ API Клиент
- Автоматическое добавление Bearer токена
- Обработка 401 ошибок с редиректом
- Type-safe запросы
- Централизованная обработка ошибок

### ✅ React Query Хуки
- Автоматическое кэширование
- Optimistic updates
- Refetch on window focus
- Toast уведомления
- TypeScript типизация

### ✅ Генерация контента
- Text-to-Image (Soul, Kling модели)
- Image-to-Video (DOP-Turbo)
- Автоматический polling статуса
- Progress tracking
- Batch генерация

### ✅ Zustand Store
- Глобальное состояние приложения
- Persistent storage (settings, UI state)
- User, Project, Scenario management
- Active jobs tracking

### ✅ TypeScript типы
- Полная типизация из OpenAPI spec
- Enums для статусов
- Request/Response интерфейсы
- Null-safe типы

## 🎯 Основные сущности

### User & Auth
```typescript
User, Token, UserCreate, UserLogin
```

### Projects
```typescript
Project, ProjectCreate, ProjectUpdate, ProjectWithTracksAndFiles
Track, TrackCreate, TrackVideoFile, TrackAudioFile
ProjectFile, ProjectFileCreate
```

### Scenarios
```typescript
Scenario, ScenarioCreate, ScenarioWithSteps
ScenarioStep, ScenarioStepCreate, StepStatus, StepType
```

### Generation
```typescript
TextToImageRequest, ImageToVideoRequest
GenerationResponse, JobStatusResponse
ContextualGenerationRequest
```

## 📖 API Endpoints

### Аутентификация
- **POST** `/auth/register` - Регистрация
- **POST** `/auth/login` - Вход (email/password)
- **GET** `/auth/google/login` - Google OAuth
- **GET** `/auth/me` - Текущий пользователь
- **GET** `/auth/credits` - Баланс кредитов
- **POST** `/auth/logout` - Выход

### Проекты
- **GET** `/projects/` - Список проектов
- **POST** `/projects/` - Создать проект
- **GET** `/projects/{id}` - Детали проекта
- **PUT** `/projects/{id}` - Обновить
- **DELETE** `/projects/{id}` - Удалить

### Файлы проекта
- **GET** `/projects/{id}/files` - Список файлов
- **POST** `/projects/{id}/files` - Добавить файл
- **DELETE** `/projects/{id}/files/{file_id}` - Удалить

### Треки
- **GET** `/projects/{id}/tracks` - Список треков
- **POST** `/projects/{id}/tracks` - Создать трек
- **DELETE** `/projects/{id}/tracks/{track_id}` - Удалить

### Сценарии
- **GET** `/projects/{id}/scenario` - Получить сценарий
- **POST** `/projects/{id}/scenario` - Создать сценарий
- **PUT** `/projects/{id}/scenario` - Обновить
- **DELETE** `/projects/{id}/scenario` - Удалить

### Шаги сценария
- **GET** `/projects/{id}/scenario/steps` - Все шаги
- **POST** `/projects/{id}/scenario/steps` - Создать шаг
- **PUT** `/projects/{id}/scenario/steps/{step_id}` - Обновить
- **GET** `/projects/{id}/scenario/next-step` - Следующий шаг
- **GET** `/projects/{id}/scenario/current-step` - Текущий шаг

### Генерация
- **POST** `/generation/text-to-image` - Генерация изображения
- **POST** `/generation/image-to-video` - Генерация видео
- **GET** `/generation/jobs/{job_id}` - Статус задачи
- **GET** `/generation/motions` - Доступные эффекты

## 🔧 Утилиты

### Token Management
```typescript
import { tokenManager } from "@/lib/api";

tokenManager.getToken();
tokenManager.setToken(token);
tokenManager.removeToken();
tokenManager.hasToken();
```

### Store Actions
```typescript
import { useAppStore } from "@/lib/store";

const setUser = useAppStore(state => state.setUser);
const setCurrentProject = useAppStore(state => state.setCurrentProject);
const addJob = useAppStore(state => state.addJob);
```

## 📝 Примеры использования

Смотрите подробные примеры в [API_GUIDE.md](./API_GUIDE.md)

## 🏗️ Архитектура

```
┌─────────────────┐
│  React Components │
└────────┬─────────┘
         │
         ├─────► React Query Hooks (lib/hooks/)
         │               │
         │               ▼
         │       API Functions (lib/api/)
         │               │
         │               ▼
         │       HTTP Client (lib/api/client.ts)
         │               │
         │               ▼
         │       Backend API (Django/FastAPI)
         │
         └─────► Zustand Store (lib/store.ts)
```

## 🎨 Стек технологий

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

## 📦 Что уже настроено

✅ TypeScript типы из OpenAPI  
✅ HTTP клиент с перехватчиками  
✅ Автоматическая аутентификация  
✅ React Query хуки для всех endpoints  
✅ Job polling для генерации  
✅ Zustand стор для глобального состояния  
✅ Toast уведомления  
✅ Error handling  
✅ Type-safe API вызовы  

## 🚧 Что нужно доработать

- [ ] UI компоненты для форм (используя shadcn/ui)
- [ ] File upload функционал
- [ ] Timeline editor для треков
- [ ] Preview для generated контента
- [ ] Drag & drop для файлов
- [ ] Real-time updates (WebSockets)
- [ ] Offline mode support
- [ ] Unit tests

## 📚 Дополнительная документация

- [API_GUIDE.md](./API_GUIDE.md) - Подробные примеры использования
- Backend API docs - Swagger UI на `/docs`

## 🤝 Contributing

При добавлении новых API endpoints:

1. Добавьте типы в `lib/types/api.ts`
2. Добавьте функции в соответствующий `lib/api/*.ts`
3. Экспортируйте из `lib/api/index.ts`
4. Создайте хуки в `lib/hooks/use-*.ts`
5. Обновите документацию

---

**Автор:** Generated for Kernel AI Video Platform  
**Дата:** 2025-01-19
