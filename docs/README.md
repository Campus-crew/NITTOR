# Kernel API - Полная документация

## 📚 Навигация по документам

### Для начинающих
1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Общая архитектура системы
2. **[USE_CASES.md](./USE_CASES.md)** - Примеры реальных задач

### Детальные гайды
3. **[AZURE_OPENAI_GUIDE.md](./AZURE_OPENAI_GUIDE.md)** - AI генерация сценариев
4. **[TIMELINE_GUIDE.md](./TIMELINE_GUIDE.md)** - Timeline система
5. **[EXPORT_GUIDE.md](./EXPORT_GUIDE.md)** - Экспорт видео

### В корне проекта
- **[SCENARIO_GENERATION.md](../SCENARIO_GENERATION.md)** - Быстрый старт с AI
- **[VIDEO_EXPORT.md](../VIDEO_EXPORT.md)** - Быстрый старт с экспортом
- **[TESTING.md](../TESTING.md)** - Как тестировать
- **[IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)** - Что реализовано

---

## 🎯 Основные возможности

### 1. AI Генерация сценариев
```bash
POST /projects/{id}/scenario/generate
{
  "title": "Product Video",
  "outline": "30s video with intro, features, CTA"
}
```

**Зачем:** Автоматически разбивает текстовую идею на структурированные шаги.

**Подробнее:** [AZURE_OPENAI_GUIDE.md](./AZURE_OPENAI_GUIDE.md)

---

### 2. Timeline система
```bash
POST /projects/{id}/tracks/{track_id}/video
{
  "filename": "scene1.mp4",
  "start_time": 0.0,    # начало на timeline
  "end_time": 10.0,     # конец на timeline
  "volume": 0.8         # громкость
}
```

**Зачем:** Точное позиционирование клипов и контроль громкости.

**Подробнее:** [TIMELINE_GUIDE.md](./TIMELINE_GUIDE.md)

---

### 3. Video Export
```bash
POST /projects/{id}/export
{
  "resolution": "1920x1080",
  "fps": 30,
  "quality": "high"
}
```

**Зачем:** Склеить все клипы в готовый mp4 файл.

**Подробнее:** [EXPORT_GUIDE.md](./EXPORT_GUIDE.md)

---

## 🚀 Быстрый старт

### 1. Установка
```bash
# Clone repo
git clone https://github.com/Campus-crew/higgs
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup .env
cp .env.example .env
# Заполните Azure OpenAI credentials

# Install FFmpeg
sudo apt-get install ffmpeg  # Ubuntu
brew install ffmpeg          # macOS
```

### 2. Запуск
```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Тестирование
```bash
# Test imports
python3 test_imports.py

# Full test
python3 test_features.py

# Or manually
open http://localhost:8000/docs
```

---

## 📊 Flow пользователя

```
1. Создать проект
   POST /projects/

2. Сгенерировать сценарий (AI)
   POST /projects/{id}/scenario/generate

3. Посмотреть шаги
   GET /projects/{id}/scenario/steps

4. Создать трек
   POST /projects/{id}/tracks

5. Добавить видео на timeline
   POST /projects/{id}/tracks/{track_id}/video

6. Добавить аудио
   POST /projects/{id}/tracks/{track_id}/audio

7. Экспортировать
   POST /projects/{id}/export

8. Проверить статус
   GET /exports/{export_id}/status

9. Скачать готовое видео
   output_url из response
```

---

## 🎬 Типичные сценарии

### Продуктовое видео
1. Генерируем сценарий через AI
2. Добавляем клипы по сценарию
3. Фоновая музыка на 30%
4. Экспортируем в Full HD

**Детали:** [USE_CASES.md#use-case-1](./USE_CASES.md)

### Подкаст
1. Intro музыка (5s)
2. Основная запись (30min)
3. Outro музыка (5s)
4. Экспорт

**Детали:** [USE_CASES.md#use-case-2](./USE_CASES.md)

### Instagram Reel
1. Вырезаем лучший момент
2. Добавляем трендовую музыку
3. Экспорт в вертикальном формате (1080x1920)

**Детали:** [USE_CASES.md#use-case-3](./USE_CASES.md)

---

## 🔧 Конфигурация

### Обязательные настройки
```bash
# Database
DATABASE_URL=sqlite:///./data/kernel.db

# Security
SECRET_KEY=your-secret-key

# API
API_HOST=0.0.0.0
API_PORT=8000
```

### Для AI сценариев
```bash
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Для экспорта
```bash
# Установите FFmpeg
sudo apt-get install ffmpeg
```

---

## 📋 Database Schema

```sql
-- Проекты
projects (id, name, description, owner_id)

-- Треки (timeline)
tracks (id, project_id, name, order_index)

-- Видео на timeline
track_video_files (
  id, track_id, filename, file_url,
  start_time, end_time, volume,
  duration, resolution, fps
)

-- Аудио на timeline
track_audio_files (
  id, track_id, filename, file_url,
  start_time, end_time, volume,
  duration, sample_rate
)

-- Сценарии
scenarios (
  id, project_id, title, prompt,
  generated_by_ai, ai_model_used
)

-- Шаги сценария
scenario_steps (
  id, scenario_id, title, description,
  step_type, order_index, estimated_duration
)
```

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/me` - Текущий пользователь

### Projects
- `POST /projects/` - Создать проект
- `GET /projects/` - Все проекты
- `GET /projects/{id}` - Один проект
- `PATCH /projects/{id}` - Обновить
- `DELETE /projects/{id}` - Удалить

### Scenarios (AI)
- `POST /projects/{id}/scenario/generate` - Генерация AI
- `GET /projects/{id}/scenario` - Получить сценарий
- `GET /projects/{id}/scenario/steps` - Получить шаги
- `POST /projects/{id}/scenario/steps` - Добавить шаг
- `PATCH /projects/{id}/scenario/steps/{step_id}` - Обновить шаг

### Tracks (Timeline)
- `POST /projects/{id}/tracks` - Создать трек
- `GET /projects/{id}/tracks` - Все треки
- `POST /projects/{id}/tracks/{track_id}/video` - Добавить видео
- `POST /projects/{id}/tracks/{track_id}/audio` - Добавить аудио
- `PATCH /projects/{id}/tracks/{track_id}/video/{file_id}` - Обновить видео
- `PATCH /projects/{id}/tracks/{track_id}/audio/{file_id}` - Обновить аудио

### Export
- `POST /projects/{id}/export` - Запуск экспорта
- `GET /exports/{export_id}/status` - Статус экспорта

### Health
- `GET /health` - Проверка API
- `GET /` - Информация
- `GET /docs` - Swagger UI

---

## 🧪 Тестирование

### Автоматическое
```bash
python3 test_features.py
```

Тестирует:
- ✅ Health check
- ✅ Authentication
- ✅ Projects
- ✅ Scenario generation (AI)
- ✅ Tracks
- ✅ Video files
- ✅ Export

### Ручное через Swagger
```
http://localhost:8000/docs
http://20.170.114.8/docs  (production)
```

### Ручное через curl
См. [TESTING.md](../TESTING.md)

---

## 🐛 Troubleshooting

### AI не генерирует сценарий
**Проблема:** Error: 401 Unauthorized
**Решение:** Проверьте Azure OpenAI credentials в .env

**Подробнее:** [AZURE_OPENAI_GUIDE.md#troubleshooting](./AZURE_OPENAI_GUIDE.md#troubleshooting)

### Export не работает
**Проблема:** FFmpeg not found
**Решение:**
```bash
sudo apt-get install ffmpeg
ffmpeg -version  # проверка
```

**Подробнее:** [EXPORT_GUIDE.md#troubleshooting](./EXPORT_GUIDE.md#troubleshooting)

### Неправильная громкость
**Проблема:** Звук слишком громкий/тихий
**Решение:** Настройте `volume`:
- Фон: 0.2-0.4
- Голос: 1.0
- Музыка: 0.6-0.8

**Подробнее:** [TIMELINE_GUIDE.md#troubleshooting](./TIMELINE_GUIDE.md#troubleshooting)

---

## 📦 Деплой

### Development
```bash
uvicorn app.main:app --reload
```

### Production (Docker)
```bash
docker build -t kernel-api .
docker run -d -p 8000:8000 kernel-api
```

### Production (Azure VM)
```bash
# Push to GitHub
git push origin prod

# GitHub Actions автоматически:
# 1. Build Docker image
# 2. Deploy to VM
# 3. Restart containers
```

---

## 📈 Performance

### Timeline
- Операции в памяти: мгновенные
- Database queries: <50ms
- Нет лимита на количество клипов

### AI Generation
- Время ответа: 2-10 секунд
- Зависит от outline длины
- Retry on timeout

### Export
- 30s video: ~30-90s render
- 2min video: ~2-6min render
- Зависит от quality preset и CPU

**Подробнее:** [EXPORT_GUIDE.md#производительность](./EXPORT_GUIDE.md#производительность)

---

## 🔐 Security

- JWT authentication
- API key для Azure OpenAI
- File URL validation
- CORS настройки
- Rate limiting (planned)

---

## 🛠 Tech Stack

**Backend:**
- FastAPI 0.104+
- SQLAlchemy 2.0+
- Pydantic 2.5+

**AI:**
- Azure OpenAI (GPT-4)
- openai==1.12.0

**Video:**
- FFmpeg 4.0+
- subprocess для рендера

**Database:**
- SQLite (dev)
- PostgreSQL (prod ready)

**Deployment:**
- Docker
- GitHub Actions
- Azure VM

---

## 📞 Поддержка

- **API Docs:** http://20.170.114.8/docs
- **Health:** http://20.170.114.8/health
- **GitHub:** https://github.com/Campus-crew/higgs

---

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Azure OpenAI scenario generation
- ✅ Timeline system (start_time, end_time, volume)
- ✅ FFmpeg video export
- ✅ Background processing
- ✅ Export status tracking
- ✅ Full documentation

### Planned
- Azure Blob Storage integration
- Webhooks for export completion
- Progress tracking during render
- Transitions between clips
- Text overlays
- Multiple export formats

---

## 🎓 Learning Path

**Новичок:**
1. Прочитайте [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Попробуйте [USE_CASES.md#use-case-1](./USE_CASES.md)
3. Запустите `test_features.py`

**Разработчик:**
1. [AZURE_OPENAI_GUIDE.md](./AZURE_OPENAI_GUIDE.md) - понять AI интеграцию
2. [TIMELINE_GUIDE.md](./TIMELINE_GUIDE.md) - понять timeline систему
3. [EXPORT_GUIDE.md](./EXPORT_GUIDE.md) - понять FFmpeg

**DevOps:**
1. [TESTING.md](../TESTING.md) - как тестировать
2. [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) - деплой

---

**🎉 Всё готово к использованию!**
