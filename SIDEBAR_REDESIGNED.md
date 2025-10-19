# ✅ Sidebar Переделан - Большой Input + Селекторы!

## 🎯 Что изменено:

### 1. **Валидация Outline** ✅

**Файл:** `components/scenario/ScenarioPanel.tsx`

**Проблема:**
```
Failed to generate scenario: [422] 
String should have at least 10 characters
```

**Решение:**
```typescript
// Валидация минимум 10 символов
disabled={outline.trim().length < 10}

// Показываем ошибку
{outline.trim().length > 0 && outline.trim().length < 10 && (
  <p className="text-xs text-red-400">
    Outline must be at least 10 characters
  </p>
)}
```

### 2. **Sidebar Redesign** ✅

**Файл:** `app/projects/[id]/page.tsx`

#### До:
```
┌─────────────────────────────┐
│ Scenario Panel              │
│                             │
│ ─────────────────────────── │
│ [input text]                │
│ [Text→Video][Image][Edit]   │
│ [Model ▼]  [Send →]         │
└─────────────────────────────┘
```

#### После:
```
┌─────────────────────────────┐
│ Scenario Panel (scrollable) │
│                             │
│                             │
│ ─────────────────────────── │
│ [Mode ▼] [Model ▼]          │
│                             │
│ ┌─────────────────────────┐ │
│ │ Large textarea          │ │
│ │ Multiple lines...       │ │
│ │                         │ │
│ │                  [Send] │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. **Новые Фичи** ✅

#### Large Textarea
```typescript
<textarea
  rows={4}
  placeholder="Describe what you want to generate...
Shift+Enter for new line"
  className="..."
/>
```

**Возможности:**
- ✅ Многострочный ввод
- ✅ Enter = отправить
- ✅ Shift+Enter = новая строка
- ✅ Кнопка Send внутри (bottom-right)

#### Mode Selector
```typescript
<select value={generationMode}>
  <option value="text-to-video">Text → Video</option>
  <option value="image-to-video">Image → Video</option>
</select>
```

**Варианты:**
- Text → Video
- Image → Video

#### Model Selector
```typescript
<select value={selectedModel}>
  <option value="kling">Kling</option>
  <option value="veo3">Veo 3</option>
  <option value="stable-diffusion">Stable Diffusion</option>
  <option value="runway">Runway</option>
</select>
```

**Модели:**
- Kling
- Veo 3
- Stable Diffusion
- Runway

### 4. **Layout Structure** ✅

```typescript
<aside className="w-80 flex flex-col">
  {/* Top - Scrollable */}
  <div className="flex-1 overflow-y-auto p-4">
    <ScenarioPanel projectId={projectId} />
  </div>

  {/* Bottom - Fixed */}
  <div className="border-t p-4">
    {/* Selectors */}
    <div className="flex gap-2 mb-3">
      <select>Mode</select>
      <select>Model</select>
    </div>

    {/* Large Input */}
    <div className="relative">
      <textarea rows={4} />
      <button className="absolute bottom-2 right-2">
        <Send />
      </button>
    </div>
  </div>
</aside>
```

**Структура:**
- ✅ **Top section** - ScenarioPanel (scrollable)
- ✅ **Bottom section** - Generation (fixed)
  - Mode & Model селекторы (flex row)
  - Large textarea с кнопкой внутри

## 🎨 Visual Design:

### Selectors Row
```
┌────────────────┬────────────────┐
│ Text → Video ▼ │ Kling ▼        │
└────────────────┴────────────────┘
```

**Styling:**
- bg-zinc-800
- hover:bg-zinc-750
- focus:ring-[#B4E031]/50
- Custom dropdown arrow (SVG)
- Equal width (flex-1)
- Small font (text-xs)

### Textarea with Button
```
┌─────────────────────────────────┐
│ Describe what you want...       │
│                                 │
│ Multiple lines supported        │
│                                 │
│                        ┌───────┐│
│                        │ Send →││
│                        └───────┘│
└─────────────────────────────────┘
```

**Styling:**
- bg-zinc-800
- border-zinc-700
- focus:border-[#B4E031]
- focus:ring-[#B4E031]/20
- Button: absolute bottom-2 right-2
- Button: bg-[#B4E031] (yellow-green)
- Button: shadow-[#B4E031]/30
- Button: hover:scale-105

### Keyboard Shortcuts
```
Enter           → Submit (if text not empty)
Shift + Enter   → New line
```

## 📊 Comparison:

### До:
```
❌ Маленький input (1 линия)
❌ Кнопки режима (занимают место)
❌ Селектор модели отдельно
❌ Кнопка Send отдельно
```

### После:
```
✅ Большой textarea (4 линии)
✅ Компактные селекторы (dropdown)
✅ Mode + Model в одной строке
✅ Кнопка Send внутри textarea
✅ Shift+Enter для новой строки
✅ Cleaner UI
```

## 🔄 Responsive Behavior:

```typescript
// Sidebar fixed width
w-80 (320px)

// ScenarioPanel scrollable
flex-1 overflow-y-auto

// Generation fixed at bottom
border-t (always visible)

// Textarea fixed height
rows={4} resize-none

// Button always visible
absolute bottom-2 right-2
```

## 📁 Изменённые файлы:

```
✅ components/scenario/ScenarioPanel.tsx
   - Добавлена валидация outline (min 10 chars)
   - Показ ошибки валидации

✅ app/projects/[id]/page.tsx
   - Redesigned sidebar layout (flex-col)
   - Replaced mode buttons with select
   - Added model select (Kling, Veo3, etc)
   - Large textarea instead of input
   - Send button inside textarea
   - Keyboard shortcuts (Enter/Shift+Enter)
   - Removed unused imports
```

## 🎯 UX Improvements:

1. **More Writing Space** ✅
   - 4 lines vs 1 line
   - Easier to see full prompt
   - Natural for longer descriptions

2. **Compact Controls** ✅
   - Selectors instead of buttons
   - More space for content
   - Professional look

3. **Better Ergonomics** ✅
   - Send button right next to text
   - Keyboard shortcut (Enter)
   - Multi-line support (Shift+Enter)

4. **Visual Hierarchy** ✅
   - Scenario panel on top (main content)
   - Generation tools at bottom (tools)
   - Clear separation (border-t)

## ✅ Checklist:

- [x] Валидация outline (min 10 chars)
- [x] Показ ошибки валидации
- [x] Sidebar flex-col layout
- [x] ScenarioPanel scrollable
- [x] Generation section fixed
- [x] Mode selector (dropdown)
- [x] Model selector (Kling, Veo3, etc)
- [x] Large textarea (4 rows)
- [x] Send button inside textarea
- [x] Enter shortcut
- [x] Shift+Enter new line
- [x] Убраны неиспользуемые импорты
- [x] Clean code

---

**Status:** ✅ Sidebar переделан! Большой input с кнопкой внутри + селекторы mode/model.

**UX:** Больше места для промпта, компактные контролы, keyboard shortcuts.
