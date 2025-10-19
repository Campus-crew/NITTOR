# API Integration Guide

Полная документация по интеграции с Kernel Video Generation API.

## Структура

```
lib/
├── api/              # API клиенты
│   ├── client.ts     # Базовый HTTP клиент
│   ├── auth.ts       # Аутентификация
│   ├── projects.ts   # Проекты и треки
│   ├── scenarios.ts  # Сценарии и шаги
│   ├── generation.ts # Генерация контента
│   └── index.ts      # Экспорты
├── hooks/            # React Query хуки
│   ├── use-auth.ts
│   ├── use-projects.ts
│   ├── use-scenarios.ts
│   ├── use-generation.ts
│   └── index.ts
├── types/
│   └── api.ts        # TypeScript типы из OpenAPI
└── store.ts          # Zustand стор
```

## Настройка

### 1. Environment Variables

Скопируйте `.env.local.example` в `.env.local`:

```bash
cp .env.local.example .env.local
```

Настройте URL бэкенда:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Providers

Провайдеры уже настроены в `app/layout.tsx` через `lib/providers.tsx`:
- React Query для кэширования и синхронизации данных
- Theme Provider для темной/светлой темы

## Использование

### Аутентификация

```typescript
import { useLogin, useCurrentUser, useLogout } from "@/lib/hooks";

function LoginForm() {
  const login = useLogin();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const handleLogin = async (email: string, password: string) => {
    await login.mutateAsync({ email, password });
    // Токен автоматически сохраняется
  };

  return (
    <div>
      {user ? (
        <button onClick={() => logout.mutate()}>Logout</button>
      ) : (
        <button onClick={() => handleLogin("user@example.com", "password")}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Проекты

```typescript
import { useProjects, useProject, useCreateProject } from "@/lib/hooks";

function ProjectsList() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();

  const handleCreate = async () => {
    const newProject = await createProject.mutateAsync({
      name: "My Video Project",
      description: "Description here",
    });
    console.log("Created:", newProject);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Project</button>
      {projects?.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Сценарии

```typescript
import {
  useProjectScenario,
  useCreateScenarioStep,
  useCurrentStep,
} from "@/lib/hooks";

function ScenarioEditor({ projectId }: { projectId: number }) {
  const { data: scenario } = useProjectScenario(projectId);
  const { data: currentStep } = useCurrentStep(projectId);
  const createStep = useCreateScenarioStep();

  const handleAddStep = async () => {
    await createStep.mutateAsync({
      projectId,
      data: {
        title: "Scene 1",
        description: "A beautiful landscape",
        step_type: "scene",
        order_index: scenario?.steps?.length || 0,
      },
    });
  };

  return (
    <div>
      <h2>{scenario?.title}</h2>
      <p>Current Step: {currentStep?.title || "None"}</p>
      <button onClick={handleAddStep}>Add Step</button>
      {scenario?.steps?.map((step) => (
        <div key={step.id}>
          {step.order_index}. {step.title} - {step.status}
        </div>
      ))}
    </div>
  );
}
```

### Генерация контента

```typescript
import {
  useTextToImage,
  useImageToVideo,
  useJobStatusPolling,
} from "@/lib/hooks";

function Generator() {
  const textToImage = useTextToImage();
  const [jobId, setJobId] = useState<string | null>(null);

  // Автоматический polling статуса
  const { status, progress, result } = useJobStatusPolling(
    jobId,
    (result) => {
      console.log("Generation complete!", result);
      // Здесь можно добавить файл в проект
    },
    (error) => {
      console.error("Generation failed:", error);
    }
  );

  const handleGenerate = async () => {
    const response = await textToImage.mutateAsync({
      prompt: "A beautiful sunset over mountains",
      quality: "1080p",
      enhance_prompt: true,
    });
    setJobId(response.job_id);
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={textToImage.isPending}>
        Generate Image
      </button>
      {jobId && (
        <div>
          Status: {status}
          {progress !== undefined && <div>Progress: {progress}%</div>}
          {result && (
            <img src={result.output_url} alt="Generated" />
          )}
        </div>
      )}
    </div>
  );
}
```

### Генерация с ожиданием

```typescript
import { useTextToImageAndWait } from "@/lib/hooks";

function GeneratorWithProgress() {
  const { mutateAsync, progress } = useTextToImageAndWait();

  const handleGenerate = async () => {
    const result = await mutateAsync({
      prompt: "A beautiful sunset",
      quality: "1080p",
    });
    console.log("Done!", result);
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      {progress > 0 && <progress value={progress} max={100} />}
    </div>
  );
}
```

### Image-to-Video

```typescript
import { useImageToVideoAndWait } from "@/lib/hooks";

function VideoGenerator({ imageUrl }: { imageUrl: string }) {
  const { mutateAsync, progress } = useImageToVideoAndWait();

  const handleGenerate = async () => {
    const result = await mutateAsync({
      prompt: "Smooth camera movement",
      input_images: [
        {
          type: "url",
          image_url: imageUrl,
        },
      ],
      model: "dop-turbo",
    });
    console.log("Video generated!", result);
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate Video</button>
      {progress > 0 && <div>Progress: {progress}%</div>}
    </div>
  );
}
```

### Zustand Store

```typescript
import { useAppStore } from "@/lib/store";

function ProjectContext() {
  const currentProject = useAppStore((state) => state.currentProject);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const user = useAppStore((state) => state.user);

  return (
    <div>
      <p>User: {user?.email}</p>
      <p>Project: {currentProject?.name || "None"}</p>
    </div>
  );
}
```

## API Endpoints

### Authentication
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/google/login` - Google OAuth URL
- `GET /auth/callback` - Google OAuth callback
- `GET /auth/me` - Текущий пользователь
- `GET /auth/credits` - Баланс кредитов
- `POST /auth/logout` - Выход

### Projects
- `GET /projects/` - Список проектов
- `POST /projects/` - Создать проект
- `GET /projects/{id}` - Получить проект
- `PUT /projects/{id}` - Обновить проект
- `DELETE /projects/{id}` - Удалить проект

### Project Files
- `GET /projects/{id}/files` - Файлы проекта
- `POST /projects/{id}/files` - Добавить файл
- `DELETE /projects/{id}/files/{file_id}` - Удалить файл

### Tracks
- `GET /projects/{id}/tracks` - Треки проекта
- `POST /projects/{id}/tracks` - Создать трек
- `GET /projects/{id}/tracks/{track_id}` - Получить трек
- `DELETE /projects/{id}/tracks/{track_id}` - Удалить трек

### Track Files
- `POST /projects/{id}/tracks/{track_id}/video` - Добавить видео
- `POST /projects/{id}/tracks/{track_id}/audio` - Добавить аудио

### Scenarios
- `GET /projects/{id}/scenario` - Получить сценарий
- `POST /projects/{id}/scenario` - Создать сценарий
- `PUT /projects/{id}/scenario` - Обновить сценарий
- `DELETE /projects/{id}/scenario` - Удалить сценарий

### Scenario Steps
- `GET /projects/{id}/scenario/steps` - Все шаги
- `POST /projects/{id}/scenario/steps` - Создать шаг
- `GET /projects/{id}/scenario/steps/{step_id}` - Получить шаг
- `PUT /projects/{id}/scenario/steps/{step_id}` - Обновить шаг
- `DELETE /projects/{id}/scenario/steps/{step_id}` - Удалить шаг
- `GET /projects/{id}/scenario/next-step` - Следующий шаг
- `GET /projects/{id}/scenario/current-step` - Текущий шаг

### Generation
- `POST /generation/text-to-image` - Генерация изображения
- `POST /generation/image-to-video` - Генерация видео
- `GET /generation/jobs/{job_id}` - Статус задачи
- `GET /generation/motions` - Доступные эффекты движения

## Типы данных

Все типы импортируются из `@/lib/types/api`:

```typescript
import type {
  User,
  Project,
  Scenario,
  ScenarioStep,
  TextToImageRequest,
  ImageToVideoRequest,
  JobStatusResponse,
} from "@/lib/types/api";
```

## Обработка ошибок

Все хуки автоматически показывают toast уведомления через `sonner`:

```typescript
const createProject = useCreateProject();

createProject.mutate(
  { name: "Test" },
  {
    onSuccess: (data) => {
      // Автоматический toast: "Project created successfully!"
      console.log(data);
    },
    onError: (error) => {
      // Автоматический toast: "Failed to create project: ..."
      console.error(error);
    },
  }
);
```

## React Query Features

### Кэширование
Данные автоматически кэшируются по ключам:
- `["auth", "me"]` - текущий пользователь
- `["projects"]` - список проектов
- `["projects", projectId]` - конкретный проект
- `["generation", "jobs", jobId]` - статус задачи

### Инвалидация
При изменениях данные автоматически инвалидируются:
```typescript
// При создании проекта автоматически обновляется список
const createProject = useCreateProject();
// После успешного создания список проектов перезагрузится
```

### Refetch
```typescript
const { data, refetch } = useProjects();

// Ручное обновление
refetch();
```

## Production Deployment

Перед деплоем убедитесь:

1. ✅ `.env.local` не коммитится (в .gitignore)
2. ✅ `NEXT_PUBLIC_API_BASE_URL` указывает на prod API
3. ✅ Все секреты настроены в hosting provider
4. ✅ CORS настроен на бэкенде для вашего домена
5. ✅ Webhook URLs указывают на prod домен

## Troubleshooting

### Ошибка 401 Unauthorized
- Проверьте токен в localStorage
- Токен истек - нужен повторный вход
- Автоматический редирект на /login

### CORS ошибки
- Убедитесь что бэкенд разрешает запросы с вашего домена
- В dev режиме можно использовать прокси Next.js

### Типы не импортируются
- Проверьте `tsconfig.json` - настроен `@/*` alias
- Перезапустите TypeScript сервер в IDE

## Next Steps

1. Создайте UI компоненты используя эти хуки
2. Добавьте формы с валидацией (Zod уже установлен)
3. Реализуйте загрузку файлов
4. Добавьте timeline редактор для треков
5. Интегрируйте preview для generated контента
