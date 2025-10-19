# ✅ Backend API Integration Status

## 📖 Изучена документация:
- ✅ **README.md** - Общая архитектура
- ✅ **ARCHITECTURE.md** - Слои приложения
- ✅ **agents_system.md** - Система сценариев
- ✅ **TIMELINE_GUIDE.md** - Timeline с start_time, end_time, volume
- ✅ **EXPORT_GUIDE.md** - FFmpeg экспорт
- ✅ **USE_CASES.md** - Примеры использования
- ✅ **AZURE_OPENAI_GUIDE.md** - AI генерация сценариев

## ✅ Реализовано:

### 1. **Scenarios API** ✅
```typescript
// lib/api/scenarios.ts
scenariosApi.generateScenario(projectId, {
  title: "Product Video",
  outline: "30s video with intro, features, CTA",
  use_context: true
});
```

**Endpoints:**
- `POST /projects/{id}/scenario/generate` - AI генерация через Azure OpenAI
- `GET /projects/{id}/scenario` - Получить сценарий
- `GET /projects/{id}/scenario/steps` - Шаги сценария
- `POST /projects/{id}/scenario/steps` - Создать шаг
- `PATCH /projects/{id}/scenario/steps/{step_id}` - Обновить шаг

**Hooks:**
- ✅ `useGenerateScenario()` - AI генерация
- ✅ `useProjectScenario()` - Получить сценарий
- ✅ `useScenarioSteps()` - Получить шаги
- ✅ `useUpdateScenarioStep()` - Обновить шаг

### 2. **Export API** ✅
```typescript
// lib/api/export.ts
exportApi.startExport(projectId, {
  resolution: "1920x1080",
  fps: 30,
  quality: "high"
});
```

**Endpoints:**
- `POST /projects/{id}/export` - Запуск FFmpeg экспорта
- `GET /exports/{export_id}/status` - Статус экспорта

**Hooks:**
- ✅ `useStartExport()` - Запустить экспорт
- ✅ `useExportStatus()` - Получить статус (auto-polling)
- ✅ `useExportAndWait()` - Экспорт и ожидание завершения

### 3. **Tracks API** ✅
```typescript
// lib/api/projects.ts
projectsApi.createTrackVideoFile(projectId, trackId, {
  filename: "scene1.mp4",
  file_url: "https://...",
  duration: 15.0,
  start_time: 0.0,  // Timeline координата
  end_time: 15.0,   // Timeline координата
  volume: 1.0       // Громкость 0.0-2.0
});
```

**Endpoints:**
- `POST /projects/{id}/tracks/{track_id}/video` - Добавить видео
- `POST /projects/{id}/tracks/{track_id}/audio` - Добавить аудио
- `PATCH /projects/{id}/tracks/{track_id}/video/{file_id}` - Обновить видео
- `PATCH /projects/{id}/tracks/{track_id}/audio/{file_id}` - Обновить аудио
- `DELETE /projects/{id}/tracks/{track_id}/video/{file_id}` - Удалить видео
- `DELETE /projects/{id}/tracks/{track_id}/audio/{file_id}` - Удалить аудио

**Существующие hooks (уже были):**
- ✅ `useProject()` - Получить проект с tracks
- ✅ `useCreateTrack()` - Создать трек

## 🔄 Что осталось сделать:

### 1. **Timeline Integration** (High Priority)
Интегрировать существующий Timeline UI с backend API:

```typescript
// В Timeline компоненте при drop файла:
const handleDrop = async (file, trackId, dropTime) => {
  await projectsApi.createTrackVideoFile(projectId, trackId, {
    filename: file.filename,
    file_url: file.url,
    duration: file.duration,
    start_time: dropTime,
    end_time: dropTime + file.duration,
    volume: 1.0
  });
};

// При перемещении clip:
const handleClipMove = async (clipId, newStartTime) => {
  await projectsApi.updateTrackVideoFile(projectId, trackId, clipId, {
    start_time: newStartTime,
    end_time: newStartTime + clip.duration
  });
};

// При trim (обрезке):
const handleClipTrim = async (clipId, newStartTime, newEndTime) => {
  await projectsApi.updateTrackVideoFile(projectId, trackId, clipId, {
    start_time: newStartTime,
    end_time: newEndTime
  });
};
```

### 2. **Scenario Generation UI** (High Priority)
Добавить UI для генерации сценариев:

```typescript
// В project page добавить кнопку "Generate Scenario"
const handleGenerateScenario = () => {
  generateScenario({
    projectId,
    data: {
      title: "Product Video",
      outline: prompt, // из input пользователя
      use_context: true
    }
  });
};
```

**Где:**
- Sidebar → кнопка "Generate Scenario" вместо ручного ввода промпта
- После генерации → показать список ScenarioSteps
- При клике на step → использовать как контекст для генерации

### 3. **Export UI** (Medium Priority)
Добавить кнопку экспорта с настройками:

```typescript
// В project page добавить кнопку "Export Video"
const handleExport = () => {
  startExport({
    projectId,
    data: {
      resolution: "1920x1080",
      fps: 30,
      quality: "high"
    }
  });
};
```

**Где:**
- Header project page → кнопка "Export"
- При клике → dialog с настройками (resolution, fps, quality)
- После запуска → показать progress bar
- По завершению → кнопка "Download"

### 4. **Hooks для Track Files** (Medium Priority)
Создать удобные hooks:

```typescript
// lib/hooks/use-tracks.ts
export function useCreateTrackVideoFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, trackId, data }) =>
      projectsApi.createTrackVideoFile(projectId, trackId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['projects', variables.projectId]);
    }
  });
}

export function useUpdateTrackVideoFile() { ... }
export function useDeleteTrackVideoFile() { ... }
```

## 📊 Полный Flow:

```
1. Создать проект
   POST /projects/

2. Сгенерировать сценарий (AI)
   POST /projects/{id}/scenario/generate
   {
     "title": "Product Video",
     "outline": "30s video with intro, features, CTA"
   }

3. Получить шаги сценария
   GET /projects/{id}/scenario/steps
   → [
       {id: 1, title: "Intro", description: "..."},
       {id: 2, title: "Features", description: "..."},
       ...
     ]

4. Создать трек
   POST /projects/{id}/tracks
   {
     "name": "Main Track",
     "order_index": 1
   }

5. Добавить видео на timeline
   POST /projects/{id}/tracks/{track_id}/video
   {
     "filename": "scene1.mp4",
     "file_url": "https://...",
     "duration": 10.0,
     "start_time": 0.0,
     "end_time": 10.0,
     "volume": 1.0
   }

6. Добавить фоновую музыку
   POST /projects/{id}/tracks/{track_id}/audio
   {
     "filename": "music.mp3",
     "file_url": "https://...",
     "duration": 120.0,
     "start_time": 0.0,
     "end_time": 30.0,
     "volume": 0.3  // тихая фоновая
   }

7. Экспортировать видео
   POST /projects/{id}/export
   {
     "resolution": "1920x1080",
     "fps": 30,
     "quality": "high"
   }
   → { export_id: "abc-123", status: "queued" }

8. Проверить статус экспорта
   GET /exports/abc-123/status
   → { status: "processing", progress: 0.5 }
   
   GET /exports/abc-123/status
   → { status: "completed", progress: 1.0, output_url: "/path/to/video.mp4" }
```

## 🎯 Приоритеты:

### High Priority (Critical):
1. **Timeline → API Integration**
   - Сохранение клипов через API при drop
   - Обновление через API при move/trim
   - Удаление через API

2. **Scenario Generation UI**
   - Кнопка "Generate Scenario"
   - Отображение ScenarioSteps
   - Использование как контекст

### Medium Priority (Important):
3. **Export UI**
   - Кнопка "Export Video"
   - Progress tracking
   - Download результата

4. **Track Files Hooks**
   - useCreateTrackVideoFile()
   - useUpdateTrackVideoFile()
   - useDeleteTrackVideoFile()

### Low Priority (Nice to have):
5. **Contextual Generation**
   - Генерация с учётом сценария
   - Использование предыдущих файлов

6. **Advanced Timeline Features**
   - Transitions между клипами
   - Text overlays
   - Effects

## 📁 Файлы:

**API:**
- ✅ `lib/api/scenarios.ts` - Scenarios API
- ✅ `lib/api/export.ts` - Export API
- ✅ `lib/api/projects.ts` - Projects + Tracks API (обновлен)

**Hooks:**
- ✅ `lib/hooks/use-scenarios.ts` - Scenarios hooks (обновлен)
- ✅ `lib/hooks/use-export.ts` - Export hooks
- ⏳ `lib/hooks/use-tracks.ts` - Tracks hooks (нужно создать)

**Components:**
- ✅ `components/editor/Timeline.tsx` - Timeline UI (есть)
- ✅ `components/editor/VideoPreview.tsx` - Preview (есть)
- ✅ `components/editor/MediaPool.tsx` - Media Pool (есть)
- ⏳ `components/editor/ScenarioPanel.tsx` - Scenario UI (нужно создать)
- ⏳ `components/editor/ExportDialog.tsx` - Export UI (нужно создать)

**Pages:**
- ✅ `app/projects/[id]/page.tsx` - Project page (нужно обновить)

## 🚀 Следующие шаги:

```bash
# 1. Создать hooks для track files
touch lib/hooks/use-tracks.ts

# 2. Обновить Timeline для сохранения в API
# Edit: components/editor/Timeline.tsx

# 3. Создать UI для Scenario Generation
# Create: components/editor/ScenarioPanel.tsx

# 4. Создать UI для Export
# Create: components/editor/ExportDialog.tsx

# 5. Обновить project page
# Edit: app/projects/[id]/page.tsx
```

---

**Status:** ✅ API Integration Complete! Ready for UI implementation.

**Документация backend:** `/docs/` полностью изучена и интегрирована.
