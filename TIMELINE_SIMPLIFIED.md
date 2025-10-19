# ✅ Timeline Упрощён - Фиксированные Дорожки

## 🎯 Что изменено:

### 1. **Убраны кнопки управления треками** ✅

**До:**
```
Timeline UI:
[+ Video Track] [+ Audio Track] [+ Add Text]
```

**После:**
```
Timeline UI:
(Кнопок нет - всё автоматически)
```

### 2. **Автоматическое создание фиксированных дорожек** ✅

**Файл:** `app/projects/[id]/page.tsx`

```typescript
// Auto-create fixed tracks if they don't exist
useEffect(() => {
  if (project && project.tracks) {
    const hasVideoTrack = project.tracks.some(t => 
      t.name.toLowerCase().includes('video')
    );
    const hasAudioTrack = project.tracks.some(t => 
      t.name.toLowerCase().includes('audio')
    );
    
    // Create Video track if missing
    if (!hasVideoTrack) {
      createTrack.mutate({
        projectId,
        data: { 
          name: 'Video Track',
          order_index: 0,
        },
      });
    }
    
    // Create Audio track if missing
    if (!hasAudioTrack) {
      createTrack.mutate({
        projectId,
        data: { 
          name: 'Audio Track',
          order_index: 1,
        },
      });
    }
  }
}, [project?.id]);
```

### 3. **Убрана функциональность Add Text** ✅

**Удалено:**
- ❌ Кнопка "Add Text"
- ❌ TextOverlay диалог
- ❌ handleAddText функция
- ❌ showTextDialog state
- ❌ Импорт TextOverlay компонента

### 4. **Убрана кнопка удаления трека** ✅

**До:**
```tsx
<div className="track-label">
  <span>Video Track</span>
  <Button onClick={deleteTrack}>🗑️</Button>  // Была кнопка
</div>
```

**После:**
```tsx
<div className="track-label">
  <span>Video Track</span>
  // Кнопки удаления нет - трек фиксированный
</div>
```

### 5. **Упрощён интерфейс Timeline** ✅

**Файл:** `components/editor/Timeline.tsx`

**До:**
```typescript
interface TimelineProps {
  onAddTrack?: (type: "video" | "audio") => void;
  onDeleteTrack?: (trackId: number) => void;
  // ...
}
```

**После:**
```typescript
interface TimelineProps {
  projectId: number;
  tracks: TrackWithFiles[];
  onClipSelect?: (clip: TimelineClip | null) => void;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}
```

## 📊 Структура Timeline теперь:

```
Timeline
├── Video Track (фиксированная, order_index: 0)
│   ├── Clip 1 [video]
│   ├── Clip 2 [video]
│   └── ...
│
└── Audio Track (фиксированная, order_index: 1)
    ├── Clip 1 [audio]
    ├── Clip 2 [audio]
    └── ...
```

## 🔄 Как работает:

### При открытии проекта:

```
1. useProject() загружает project
         ↓
2. useEffect проверяет tracks
         ↓
3. Если нет Video Track → создаёт
   Если нет Audio Track → создаёт
         ↓
4. React Query refetch project
         ↓
5. Timeline показывает 2 фиксированные дорожки
```

### При Drag & Drop файла:

```
Video файл → Drop на Video Track → Сохраняется
Audio файл → Drop на Audio Track → Сохраняется
```

## ✅ Преимущества:

1. **Проще UI** - Нет лишних кнопок
2. **Автоматизация** - Дорожки создаются сами
3. **Предсказуемость** - Всегда 2 дорожки: Video и Audio
4. **Чистота** - Нет функций Add Text, Delete Track
5. **Параллельные треки** - Видео и аудио всегда рядом

## 🎨 Visual:

**До:**
```
┌─────────────────────────────────────────┐
│ Timeline                                │
│ [+ Video] [+ Audio] [+ Text]            │ ← Кнопки
│                                         │
│ ┌─ Track 1 ─────────────────── [X]     │
│ │ [clip] [clip]                        │
│ └─────────────────────────────────────│
│                                         │
│ ┌─ Track 2 ─────────────────── [X]     │
│ │ [clip]                               │
│ └─────────────────────────────────────│
└─────────────────────────────────────────┘
```

**После:**
```
┌─────────────────────────────────────────┐
│ Timeline                                │
│                                         │ ← Нет кнопок
│ ┌─ Video Track ───────────────────────┐│
│ │ [clip] [clip]                       ││ ← Фиксированная
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─ Audio Track ───────────────────────┐│
│ │ [clip]                              ││ ← Фиксированная
│ └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

## 📁 Изменённые файлы:

```
✅ components/editor/Timeline.tsx
   - Убраны кнопки Add Track, Add Text
   - Убрана кнопка Delete Track
   - Упрощён интерфейс TimelineProps
   - Убраны импорты Plus, Type, TextOverlay

✅ app/projects/[id]/page.tsx
   - Добавлен auto-create tracks useEffect
   - Убран prop onAddTrack из Timeline
   - Упрощён handleAddTrack (больше не нужен)
```

## 🚀 Использование:

```typescript
// Просто рендерим Timeline - всё автоматически
<Timeline
  projectId={projectId}
  tracks={project.tracks}
  onClipSelect={setSelectedClip}
  currentTime={timelineTime}
  onTimeUpdate={setTimelineTime}
/>

// Дорожки создаются автоматически при загрузке проекта
// Пользователь просто drag & drop файлы на нужную дорожку
```

## ✅ Checklist:

- [x] Убрана кнопка "Add Text"
- [x] Убрана кнопка "Video Track"
- [x] Убрана кнопка "Audio Track"
- [x] Убрана кнопка удаления трека (X)
- [x] Auto-create Video Track при загрузке
- [x] Auto-create Audio Track при загрузке
- [x] Упрощён TimelineProps интерфейс
- [x] Убраны неиспользуемые импорты
- [x] Параллельное отображение Video и Audio треков

---

**Status:** ✅ Timeline упрощён! Фиксированные дорожки Video и Audio.

**UI:** Чистый интерфейс без лишних кнопок, всё автоматически.
