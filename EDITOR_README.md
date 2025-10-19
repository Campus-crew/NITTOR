# 🎬 Nittor - AI Video Editor

## 🚀 Що нового

### Монтажна область з повним функціоналом!

Тепер у тебе є професійний video editor з можливістю:

✅ **Drag & Drop** - перетягуй медіа з Media Pool на timeline  
✅ **Переміщення кліпів** - рухай відео/аудіо по таймлайну  
✅ **Обрізка** - тягни за краї кліпу щоб обрізати  
✅ **Зміна швидкості** - 0.5x, 1x, 2x (правий клік → Speed)  
✅ **Дублювання** - швидке копіювання кліпів  
✅ **Текстові накладки** - додай текст з налаштуваннями шрифту, кольору, позиції  
✅ **Zoom** - масштабуй таймлайн для точної роботи  
✅ **Контекстне меню** - правий клік для швидких операцій

---

## 📁 Структура компонентів

```
components/editor/
├── Timeline.tsx        # Основний timeline з drag & drop
├── MediaPool.tsx       # Пул медіа файлів
├── TextOverlay.tsx     # Діалог додавання тексту
├── VideoPreview.tsx    # Превью відео
├── ChatPanel.tsx       # AI чат для промптів
└── SceneList.tsx       # Список сцен
```

---

## 🎮 Як користуватися

### 1️⃣ Додати трек

Натисни **"+ Video Track"** або **"+ Audio Track"** внизу timeline

### 2️⃣ Додати медіа

Перетягни файл з **Media Pool** на трек

### 3️⃣ Редагувати кліп

- **Перемістити**: клік і тягни
- **Обрізати**: тягни за краї кліпу
- **Швидкість**: правий клік → Speed → 0.5x/1x/2x
- **Дублювати**: правий клік → Duplicate
- **Видалити**: правий клік → Delete

### 4️⃣ Додати текст

Натисни **"Add Text"** → налаштуй → добав

### 5️⃣ Масштабування

Іконки **+/-** для zoom in/out

---

## 🎨 Features Overview

| Feature             | Status | Description                  |
| ------------------- | ------ | ---------------------------- |
| 🎞️ Video Clips      | ✅     | Drag & drop, move, trim      |
| 🎵 Audio Clips      | ✅     | Drag & drop, move, trim      |
| 🖼️ Image Clips      | ✅     | Drag & drop, move            |
| ✏️ Text Overlays    | ✅     | Custom font, color, position |
| ⚡ Speed Control    | ✅     | 0.5x, 1x, 2x                 |
| 📋 Context Menu     | ✅     | Right-click operations       |
| 🔍 Zoom             | ✅     | Timeline scaling             |
| 🎬 Playhead         | ✅     | Current time indicator       |
| 🎯 Track Management | ✅     | Add/remove tracks            |

---

## 🔗 API Integration

Використовується API з `http://20.170.114.8:8000/docs`

### Основні ендпоінти:

- `GET /projects/` - список проектів
- `POST /projects/` - створити проект
- `GET /projects/{id}` - деталі проекту з треками
- `POST /projects/{id}/tracks` - додати трек
- `POST /projects/{id}/tracks/{track_id}/video` - додати відео
- `POST /projects/{id}/tracks/{track_id}/audio` - додати аудіо

---

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide Icons** - Icons
- **Zustand** - State management (lib/store.ts)

---

## 📝 TODO

Базовий функціонал готовий! Опціонально можна додати:

- [ ] Audio waveform visualization
- [ ] Video thumbnail previews на кліпах
- [ ] Keyboard shortcuts (Delete, Ctrl+C/V)
- [ ] Snapping між кліпами
- [ ] Multi-select кліпів
- [ ] Undo/Redo
- [ ] Transitions між кліпами
- [ ] Markers на timeline
- [ ] Export фінального відео

---

## 🎯 Детальна документація

Дивись **[TIMELINE_FEATURES.md](./TIMELINE_FEATURES.md)** для повного опису функцій

---

**Happy editing! 🎬✨**
