# Timeline система - Подробное руководство

## Зачем это нужно?

**Проблема:** При монтаже видео нужно контролировать:
- Когда начинается каждый клип
- Когда заканчивается
- Громкость каждого клипа
- Наложение аудиодорожек

**Решение:** Каждый видео/аудио файл хранит свои координаты на timeline и настройки.

## Визуализация Timeline

```
Timeline (секунды):
0    5    10   15   20   25   30   35   40
├────┼────┼────┼────┼────┼────┼────┼────┤

Video Track 1:
│ intro.mp4 [0.0 ────── 10.0]        │ vol: 1.0
│          main_scene.mp4 [10.0 ──────── 25.0] vol: 0.8
│                   outro.mp4 [25.0 ── 35.0]  vol: 1.0

Audio Track 1 (background):
│ music.mp3 [0.0 ────────────────────── 35.0]  vol: 0.3

Audio Track 2 (voiceover):
│       narrator.mp3 [5.0 ──── 20.0]           vol: 1.0
```

## Database Schema

### TrackVideoFile
```sql
CREATE TABLE track_video_files (
  id INTEGER PRIMARY KEY,
  track_id INTEGER,
  filename VARCHAR,
  file_url VARCHAR,
  
  -- Timeline координаты
  start_time FLOAT DEFAULT 0.0,  -- Начало на timeline
  end_time FLOAT,                 -- Конец (nullable)
  
  -- Audio control
  volume FLOAT DEFAULT 1.0,       -- Громкость 0.0-2.0
  
  -- Video metadata
  duration FLOAT,
  resolution VARCHAR,
  fps FLOAT
);
```

### TrackAudioFile
```sql
CREATE TABLE track_audio_files (
  id INTEGER PRIMARY KEY,
  track_id INTEGER,
  filename VARCHAR,
  file_url VARCHAR,
  
  -- Timeline координаты
  start_time FLOAT DEFAULT 0.0,
  end_time FLOAT,
  
  -- Audio control
  volume FLOAT DEFAULT 1.0,
  
  -- Audio metadata
  duration FLOAT,
  sample_rate INTEGER,
  bitrate INTEGER
);
```

## Параметры

### start_time
- **Тип:** Float (seconds)
- **Default:** 0.0
- **Описание:** Позиция начала клипа на timeline
- **Примеры:**
  - `0.0` - начало с самого начала
  - `5.5` - начало на 5.5 секунде
  - `120.0` - начало на 2 минуте

### end_time
- **Тип:** Float (seconds), nullable
- **Default:** null
- **Описание:** Позиция конца клипа на timeline
- **Примеры:**
  - `10.0` - закончить на 10-й секунде
  - `null` - использовать полную длительность файла
  
**Вычисление длительности на timeline:**
```python
if end_time is not None:
    clip_duration = end_time - start_time
else:
    clip_duration = file.duration  # используем полную длительность
```

### volume
- **Тип:** Float
- **Default:** 1.0
- **Диапазон:** 0.0 - 2.0
- **Описание:** Уровень громкости

**Значения:**
```
0.0  = полная тишина (mute)
0.25 = очень тихо (фоновая музыка)
0.5  = половина громкости
0.75 = приглушённо
1.0  = оригинальная громкость
1.25 = усиление +25%
1.5  = усиление +50%
2.0  = двойная громкость (максимум)
```

**⚠️ Предупреждения:**
- `volume > 1.5` может вызвать искажения
- `volume > 2.0` не рекомендуется
- Для микширования аудио используйте низкие значения (0.2-0.4) для фона

## Примеры использования

### Пример 1: Последовательные клипы

**Задача:** Склеить 3 видео друг за другом

```bash
# Clip 1: 0-10 секунд
POST /projects/1/tracks/1/video
{
  "filename": "intro.mp4",
  "file_url": "https://storage.com/intro.mp4",
  "duration": 10.0,
  "start_time": 0.0,
  "end_time": 10.0,
  "volume": 1.0
}

# Clip 2: 10-25 секунд (сразу после первого)
POST /projects/1/tracks/1/video
{
  "filename": "main.mp4",
  "file_url": "https://storage.com/main.mp4",
  "duration": 15.0,
  "start_time": 10.0,
  "end_time": 25.0,
  "volume": 1.0
}

# Clip 3: 25-35 секунд
POST /projects/1/tracks/1/video
{
  "filename": "outro.mp4",
  "file_url": "https://storage.com/outro.mp4",
  "duration": 10.0,
  "start_time": 25.0,
  "end_time": 35.0,
  "volume": 1.0
}
```

**Результат:** Три клипа идут друг за другом, общая длительность 35 секунд

### Пример 2: Фоновая музыка

**Задача:** Добавить тихую фоновую музыку на весь ролик

```bash
POST /projects/1/tracks/1/audio
{
  "filename": "background.mp3",
  "file_url": "https://storage.com/music.mp3",
  "duration": 180.0,        # файл длится 3 минуты
  "start_time": 0.0,
  "end_time": 35.0,          # но используем только 35 секунд
  "volume": 0.25             # тихая фоновая музыка
}
```

**Результат:** Музыка играет с начала до конца ролика на низкой громкости

### Пример 3: Voiceover поверх видео

**Задача:** Видео с приглушённым звуком + громкий голос диктора

```bash
# Видео с приглушённым встроенным звуком
POST /projects/1/tracks/1/video
{
  "filename": "scene.mp4",
  "file_url": "https://storage.com/scene.mp4",
  "duration": 30.0,
  "start_time": 0.0,
  "end_time": 30.0,
  "volume": 0.3             # приглушаем встроенный звук видео
}

# Voiceover поверх видео
POST /projects/1/tracks/1/audio
{
  "filename": "narration.mp3",
  "file_url": "https://storage.com/voice.mp3",
  "duration": 28.0,
  "start_time": 1.0,        # начало через 1 секунду
  "end_time": 29.0,
  "volume": 1.0             # полная громкость для голоса
}
```

**Результат:** Видео с приглушённым звуком + чёткий голос диктора

### Пример 4: Музыкальная вставка

**Задача:** Энергичная музыка только в середине видео

```bash
# Основное видео
POST /projects/1/tracks/1/video
{
  "filename": "video.mp4",
  "file_url": "https://storage.com/video.mp4",
  "start_time": 0.0,
  "end_time": 60.0,
  "volume": 0.5             # приглушаем встроенный звук
}

# Энергичная музыка только в середине
POST /projects/1/tracks/1/audio
{
  "filename": "energetic.mp3",
  "file_url": "https://storage.com/music.mp3",
  "start_time": 20.0,       # начало на 20-й секунде
  "end_time": 40.0,         # конец на 40-й
  "volume": 0.7
}
```

**Результат:** 
- 0-20s: только видео со звуком
- 20-40s: видео + энергичная музыка
- 40-60s: снова только видео

### Пример 5: Использование части файла

**Задача:** Использовать только середину длинного видео

```bash
# У нас есть 5-минутное видео, но нужны только 10-15 секунды
POST /projects/1/tracks/1/video
{
  "filename": "long_video.mp4",
  "file_url": "https://storage.com/long.mp4",
  "duration": 300.0,        # файл длится 5 минут
  
  # Но на timeline мы используем только фрагмент
  "start_time": 0.0,        # размещаем в начале timeline
  "end_time": 5.0,          # и берём только 5 секунд
  
  # FFmpeg сам вырежет нужный фрагмент из исходного файла
  "volume": 1.0
}
```

**Результат:** Используется только нужный фрагмент большого файла

## Правила и рекомендации

### Обязательные правила:
1. ✅ `start_time >= 0`
2. ✅ `end_time > start_time` (если указан)
3. ✅ `0.0 <= volume <= 2.0`
4. ✅ Клипы могут перекрываться (для mixing)

### Рекомендации по volume:

**Для фоновой музыки:**
```
volume: 0.2 - 0.4  (очень тихо, не отвлекает)
```

**Для голоса (voiceover, диалоги):**
```
volume: 1.0  (полная громкость, чтобы слышно было чётко)
```

**Для основной музыки:**
```
volume: 0.6 - 0.8  (слышно, но не перекрывает голос)
```

**Для звуковых эффектов:**
```
volume: 0.5 - 1.0  (зависит от эффекта)
```

**Избегайте:**
```
volume > 1.5  (риск искажений и перегрузки)
```

### Рекомендации по timeline:

**Последовательные клипы:**
```python
# Clip 1
start_time: 0.0
end_time: 10.0

# Clip 2 (сразу после)
start_time: 10.0  # = end_time предыдущего
end_time: 25.0
```

**Перекрывающиеся клипы (crossfade):**
```python
# Clip 1
start_time: 0.0
end_time: 12.0

# Clip 2 (с перекрытием)
start_time: 10.0  # перекрытие 2 секунды
end_time: 20.0
```

## API Examples

### Добавить видео
```bash
curl -X POST http://api.nittor.com/projects/1/tracks/1/video \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "scene1.mp4",
    "file_url": "https://storage.com/video.mp4",
    "duration": 15.0,
    "start_time": 0.0,
    "end_time": 15.0,
    "volume": 1.0,
    "resolution": "1920x1080",
    "fps": 30
  }'
```

### Добавить аудио
```bash
curl -X POST http://api.nittor.com/projects/1/tracks/1/audio \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "music.mp3",
    "file_url": "https://storage.com/audio.mp3",
    "duration": 120.0,
    "start_time": 0.0,
    "end_time": 60.0,
    "volume": 0.3
  }'
```

### Получить все клипы трека
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://api.nittor.com/projects/1/tracks/1
```

Response:
```json
{
  "id": 1,
  "name": "Main Track",
  "video_files": [
    {
      "id": 1,
      "filename": "scene1.mp4",
      "start_time": 0.0,
      "end_time": 15.0,
      "volume": 1.0
    }
  ],
  "audio_files": [
    {
      "id": 1,
      "filename": "music.mp3",
      "start_time": 0.0,
      "end_time": 60.0,
      "volume": 0.3
    }
  ]
}
```

## Troubleshooting

### Клипы не в том порядке
**Проблема:** Клипы воспроизводятся не по порядку
**Решение:** Проверьте `start_time` - они должны увеличиваться

### Слишком громко/тихо
**Проблема:** Звук слишком громкий или тихий
**Решение:** Настройте `volume`:
- Фон: 0.2-0.4
- Голос: 1.0
- Музыка: 0.6-0.8

### Звук искажается
**Проблема:** Слышны искажения, перегрузка
**Решение:** Уменьшите `volume` всех треков. Суммарная громкость не должна превышать ~2.0

### Неправильная длительность
**Проблема:** Клип длится не столько, сколько ожидалось
**Решение:** Проверьте:
```python
actual_duration = end_time - start_time
# Должно совпадать с ожидаемым
```
