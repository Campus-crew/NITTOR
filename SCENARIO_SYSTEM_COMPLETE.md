# ✅ Scenario System - Полная Интеграция с Backend!

## 🎯 Что реализовано:

### 1. **ScenarioPanel Component** ✅

**Файл:** `components/scenario/ScenarioPanel.tsx` (NEW)

Полнофункциональный TODO-лист сценария с backend интеграцией!

**Возможности:**
- ✅ **AI генерация сценария** через Azure OpenAI
- ✅ **Управление шагами** (добавить, редактировать, удалить)
- ✅ **Статусы шагов** (pending → in_progress → completed)
- ✅ **Прогресс трекинг** (X / Y completed)
- ✅ **Красивый UI** с иконками и цветами статусов

### 2. **UI/UX Фичи** ✅

#### Генерация Сценария
```typescript
// Диалог генерации
<Dialog>
  <Input placeholder="Title" />
  <Textarea placeholder="Outline" />
  <Button>Generate with AI ✨</Button>
</Dialog>

// Backend call
generateScenario({
  projectId,
  data: {
    title: "Product Video",
    outline: "30s video with intro, features, CTA",
    use_context: true  // Использует контекст проекта
  }
});
```

#### Управление Шагами
```typescript
// Add Step
<Button onClick={showAddDialog}>
  <Plus /> Add Step
</Button>

// Edit Step
<Button onClick={() => handleEdit(step)}>
  <Edit2 />
</Button>

// Delete Step
<Button onClick={() => handleDelete(step.id)}>
  <Trash2 />
</Button>

// Toggle Status (click on checkbox)
pending → in_progress → completed
```

#### Статусы с Визуализацией
```typescript
Status Icons:
✓ completed   → CheckCircle (green)
⏱ in_progress → Clock (yellow)
○ pending     → Circle (gray)
○ skipped     → Circle (dark gray)

Background Colors:
completed   → green-400/5 border-green-400/20
in_progress → yellow-400/5 border-yellow-400/20
pending     → bg-zinc-900 border-zinc-800
```

### 3. **Backend Hooks Используются** ✅

```typescript
// Все hooks интегрированы с React Query
useGenerateScenario()    // AI генерация
useProjectScenario()      // Получить сценарий
useScenarioSteps()        // Получить шаги
useCreateScenarioStep()   // Создать шаг
useUpdateScenarioStep()   // Обновить шаг
useDeleteScenarioStep()   // Удалить шаг
```

### 4. **Project Page Integration** ✅

**Файл:** `app/projects/[id]/page.tsx`

```typescript
// Old sidebar - заменён на ScenarioPanel
<aside>
  {/* Старый код с scenario.steps.map() */}
</aside>

// New sidebar - ScenarioPanel
<aside className="w-80">
  <ScenarioPanel projectId={projectId} />
</aside>
```

**Убрано:**
- ❌ Старый sidebar со scenario steps
- ❌ Дублирующийся useProjectScenario
- ❌ Debug console.logs
- ❌ Неиспользуемые переменные (currentStep, setCurrentStep)
- ❌ showScenario state

**Добавлено:**
- ✅ ScenarioPanel компонент
- ✅ Чистый импорт без дублей
- ✅ Упрощённый код

## 📊 Полный Flow:

### 1. Создание Проекта
```
User creates project
       ↓
Opens /projects/[id]
       ↓
Sidebar: "No Scenario Yet"
       ↓
Button: "Generate Scenario" ✨
```

### 2. Генерация Сценария
```
User clicks "Generate Scenario"
       ↓
Dialog opens:
  - Title: "Product Demo"
  - Outline: "30s video..."
       ↓
Click "Generate" ✨
       ↓
POST /projects/{id}/scenario/generate
{
  "title": "Product Demo",
  "outline": "30s video with intro, features, CTA",
  "use_context": true
}
       ↓
Azure OpenAI generates steps
       ↓
Backend returns ScenarioWithSteps
       ↓
React Query refetch
       ↓
UI updates with steps!
```

### 3. Управление Шагами
```
User sees TODO list:
1. ○ Create intro animation [pending]
2. ○ Show features         [pending]
3. ○ Add call to action    [pending]

User clicks on ○ → changes to ⏱
       ↓
PATCH /projects/{id}/scenario/steps/{step_id}
{ "status": "in_progress" }
       ↓
UI updates: ⏱ [in_progress]

User clicks again → ✓
       ↓
PATCH { "status": "completed" }
       ↓
UI updates: ✓ [completed] (green)
       ↓
Progress: 1 / 3 completed
```

### 4. Добавление Шага
```
User clicks "Add Step"
       ↓
Dialog opens:
  - Title: "Add background music"
  - Description: "Calm music 30s"
       ↓
Click "Add Step"
       ↓
POST /projects/{id}/scenario/steps
{
  "title": "Add background music",
  "description": "Calm music 30s",
  "order_index": 3
}
       ↓
Backend creates step
       ↓
UI updates with new step!
```

### 5. Редактирование Шага
```
User clicks Edit ✏️
       ↓
Dialog opens with current values
       ↓
User changes title/description
       ↓
Click "Update Step"
       ↓
PATCH /projects/{id}/scenario/steps/{step_id}
       ↓
UI updates
```

### 6. Удаление Шага
```
User clicks Delete 🗑️
       ↓
Confirm dialog
       ↓
DELETE /projects/{id}/scenario/steps/{step_id}
       ↓
Backend removes step
       ↓
UI updates (step removed)
```

## 🎨 UI Примеры:

### No Scenario State
```
┌─────────────────────────────────────┐
│  ✨                                  │
│  No Scenario Yet                    │
│  Generate a structured plan         │
│  for your video with AI             │
│                                     │
│  [✨ Generate Scenario]             │
└─────────────────────────────────────┘
```

### With Scenario & Steps
```
┌─────────────────────────────────────┐
│  Product Demo Video        [+ Add]  │
│  2 / 4 completed                    │
│                                     │
│  ✓ Create intro animation           │
│     3s intro with logo reveal       │
│     [✏️] [🗑️]                        │
│                                     │
│  ⏱ Show app features                │
│     Demo of key features            │
│     [✏️] [🗑️]                        │
│                                     │
│  ○ Add call to action               │
│     "Download now" screen           │
│     [✏️] [🗑️]                        │
│                                     │
│  ○ Background music                 │
│     Add calm background track       │
│     [✏️] [🗑️]                        │
└─────────────────────────────────────┘
```

### Generate Dialog
```
┌─────────────────────────────────────┐
│  Generate Scenario                  │
│  Describe your video idea and AI    │
│  will create a structured plan      │
│                                     │
│  Title:                             │
│  [Product Demo Video         ]      │
│                                     │
│  Outline / Description:             │
│  ┌─────────────────────────────┐   │
│  │ 30-second video showing our │   │
│  │ app features: intro, main   │   │
│  │ features, call to action    │   │
│  └─────────────────────────────┘   │
│                                     │
│     [Cancel]  [✨ Generate]         │
└─────────────────────────────────────┘
```

## 🔄 React Query Sync:

```typescript
// Automatic synchronization
generateScenario.mutateAsync()
       ↓
onSuccess: invalidateQueries(["projects", projectId, "scenario"])
       ↓
useProjectScenario() auto refetch
       ↓
useScenarioSteps() auto refetch
       ↓
UI updates automatically! ✨

// Same for all mutations:
createStep → invalidate → refetch → update
updateStep → invalidate → refetch → update
deleteStep → invalidate → refetch → update
```

## 📁 Файлы:

**Созданы:**
```
✅ components/scenario/ScenarioPanel.tsx (NEW)
   - 400+ lines полнофункционального UI
   - AI генерация
   - CRUD операции для шагов
   - Статусы и прогресс
```

**Обновлены:**
```
✅ app/projects/[id]/page.tsx
   - Заменён старый sidebar на ScenarioPanel
   - Убраны дубликаты и debug код
   - Чистые импорты
```

**Backend Integration:**
```
✅ lib/api/scenarios.ts
   - generateScenario() ✅
   - getProjectScenario() ✅
   - getScenarioSteps() ✅
   - createScenarioStep() ✅
   - updateScenarioStep() ✅
   - deleteScenarioStep() ✅

✅ lib/hooks/use-scenarios.ts
   - useGenerateScenario() ✅
   - useProjectScenario() ✅
   - useScenarioSteps() ✅
   - useCreateScenarioStep() ✅
   - useUpdateScenarioStep() ✅
   - useDeleteScenarioStep() ✅
```

## ✅ Checklist:

- [x] ScenarioPanel компонент создан
- [x] AI генерация через Azure OpenAI
- [x] CRUD операции для шагов
- [x] Toggle статусов (pending/in_progress/completed)
- [x] Progress tracking (X / Y completed)
- [x] Красивый UI с иконками
- [x] Backend hooks интегрированы
- [x] React Query auto-sync
- [x] Project page integration
- [x] Убран старый sidebar код
- [x] Убраны debug logs
- [x] TypeScript errors исправлены

## 🚀 Использование:

```typescript
// В любой странице проекта
import { ScenarioPanel } from "@/components/scenario/ScenarioPanel";

<ScenarioPanel projectId={projectId} />

// Всё работает автоматически:
// - Загрузка сценария
// - Генерация через AI
// - Управление шагами
// - Синхронизация с backend
```

## 🎯 Backend API соответствие:

**Согласно agents_system.md:**

✅ **POST /projects/{id}/scenario/generate**
```json
{
  "title": "Product Video",
  "outline": "30s video with intro, features, CTA",
  "use_context": true
}
```

✅ **GET /projects/{id}/scenario**
- Возвращает ScenarioWithSteps

✅ **GET /projects/{id}/scenario/steps**
- Возвращает список шагов

✅ **POST /projects/{id}/scenario/steps**
```json
{
  "title": "Create intro",
  "description": "3s intro animation",
  "order_index": 0
}
```

✅ **PATCH /projects/{id}/scenario/steps/{step_id}**
```json
{
  "status": "completed"
}
```

✅ **DELETE /projects/{id}/scenario/steps/{step_id}**

---

**Status:** ✅ Scenario System полностью работает с backend!

**UI:** Красивый TODO-лист с AI генерацией и управлением шагами.

**Backend:** Полная интеграция через React Query hooks.
