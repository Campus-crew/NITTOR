# Архитектура Kernel API

## Общая структура

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│            FastAPI Backend                  │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │  Routes    │──│    Services            │ │
│  │            │  │  - Azure OpenAI        │ │
│  │            │  │  - FFmpeg              │ │
│  └────────────┘  └────────────────────────┘ │
│         │                                    │
│         ▼                                    │
│  ┌────────────────────────────────────────┐ │
│  │        SQLite/PostgreSQL Database      │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌──────────────┐
│ Azure OpenAI│    │    FFmpeg    │
└─────────────┘    └──────────────┘
```

## Слои приложения

### API Layer (app/routes/)
- HTTP запросы/ответы
- Валидация данных (Pydantic)
- Авторизация (JWT)
- Error handling

### Service Layer (app/services/)
- Бизнес-логика
- Интеграции (Azure OpenAI, FFmpeg)
- Обработка данных

### Data Layer (app/models/)
- SQLAlchemy ORM models
- Database transactions
- CRUD операции

## Database Schema

### Core Tables
- `users` - пользователи
- `projects` - проекты
- `project_files` - файлы в проектах
- `tracks` - треки (timeline)

### Scenarios
- `scenarios` - сценарии (1 на проект)
- `scenario_steps` - шаги сценария (ordered)

### Timeline
- `track_video_files` - видео на timeline
- `track_audio_files` - аудио на timeline

### Fields:
```sql
-- Timeline координаты
start_time FLOAT DEFAULT 0.0
end_time FLOAT
volume FLOAT DEFAULT 1.0
```
