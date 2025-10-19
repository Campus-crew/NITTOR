# Flow - AI Video Generator 🎬

Веб-приложение для создания видео с помощью ИИ. Генерируйте сценарии, создавайте кадры и монтируйте всё в одном месте.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Возможности

- 🎯 **Генерация сценария** - ИИ создаёт структуру видео по вашей теме
- 🎨 **Два режима генерации**:
  - Видео по описанию (текстовый промпт)
  - Видео по картинкам (загрузка изображений)
- 💬 **Чат-интерфейс** с сохранением контекста между кадрами
- 🎬 **Таймлайн-редактор** с операциями монтажа
- 📊 **Список сцен** с отслеживанием статуса
- ⌨️ **Горячие клавиши** для быстрой работы
- 💾 **Автосохранение** прогресса в браузере

## 🚀 Быстрый старт

### Установка

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd ai-video

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Использование

1. **Главная страница** → Нажмите "Создать видео"
2. **Сценарий** → Опишите тему вашего видео
3. **Видео** → Выберите режим и генерируйте кадры
4. **Монтаж** → Используйте таймлайн для редактирования
5. **Экспорт** → Скачайте готовое видео

Подробнее см. [QUICK_START.md](./QUICK_START.md)

## 🛠 Технологии

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Структура проекта

```
ai-video/
├── app/
│   ├── api/              # Mock API routes
│   ├── generate/         # Editor page
│   └── page.tsx          # Landing page
├── components/
│   ├── editor/           # Editor components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api.ts            # API hooks
│   ├── store.ts          # Zustand store
│   └── providers.tsx     # React Query provider
└── public/               # Static assets
```

## 🔌 Интеграция с AI API

Приложение интегрировано с:
- **OpenAI** - для генерации сценариев
- **Higgsfield** - для генерации видео

Создайте `.env.local`:
```env
# OpenAI для умных сценариев
OPENAI_API_KEY=sk-ваш-ключ

# Higgsfield для генерации видео
HIGGSFIELD_API_KEY=ваш-ключ
HIGGSFIELD_API_URL=https://api.higgsfield.ai/v1
```

**Без API ключей** приложение работает в fallback режиме с демо данными.

Подробнее см. [API_SETUP.md](./API_SETUP.md)

## 📝 Скрипты

```bash
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для продакшена
npm start            # Запуск продакшен-сервера
npm run lint         # Проверка кода
```

## ⌨️ Горячие клавиши

- `Пробел` / `K` - Воспроизведение/Пауза
- `Enter` - Отправить сообщение в чате
- `Shift + Enter` - Новая строка в чате

## 📚 Документация

- **[START_HERE.md](./START_HERE.md)** - 👈 Начните отсюда!
- **[API_SETUP.md](./API_SETUP.md)** - Настройка OpenAI и Higgsfield
- [SETUP.md](./SETUP.md) - Детальная установка
- [VERIFICATION.md](./VERIFICATION.md) - Проверка функций
- [NO_DB_MODE.md](./NO_DB_MODE.md) - Работа без БД

## 🎨 Дизайн

- **Тема**: Тёмная по умолчанию
- **Акценты**: Жёлтый (#F5D90A, #E6B400)
- **Вдохновение**: Higgsfield, Google Veo

## 📋 TODO

- [x] Интеграция с OpenAI для сценариев
- [x] Интеграция с Higgsfield для видео
- [x] Загрузка изображений (FormData)
- [x] Отслеживание прогресса генерации
- [ ] Настройка PostgreSQL для персистентности
- [ ] Аутентификация пользователей
- [ ] Экспорт готового видео
- [ ] Тесты (Vitest + Playwright)

## 🤝 Вклад

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 Лицензия

MIT License - см. [LICENSE](./LICENSE)

## 🙏 Благодарности

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

Создано с ❤️ для генерации видео с помощью ИИ
