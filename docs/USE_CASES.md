# Use Cases - Примеры использования

## Use Case 1: Создание продуктового видео от А до Я

### Задача
Создать 30-секундное видео для продукта с intro, features, testimonial, CTA.

### Решение

```bash
TOKEN="your_access_token"

# 1. Создаём проект
PROJECT=$(curl -X POST http://api.nittor.com/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Product Video","description":"30s promo"}' \
  | jq -r '.id')

echo "Project ID: $PROJECT"

# 2. Генерируем сценарий через AI
curl -X POST http://api.nittor.com/projects/$PROJECT/scenario/generate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title":"Product Launch Video",
    "outline":"30s video with: animated logo intro, 3 product features with text overlays, customer testimonial, call to action with website URL"
  }' | jq

# AI вернёт ~6-8 шагов

# 3. Создаём трек
TRACK=$(curl -X POST http://api.nittor.com/projects/$PROJECT/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Main Track","order_index":1}' \
  | jq -r '.id')

# 4. Добавляем видео клипы на timeline

# Intro (0-3s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"logo_animation.mp4",
    "file_url":"https://storage.com/logo.mp4",
    "duration":3.0,
    "start_time":0.0,
    "end_time":3.0,
    "volume":1.0
  }'

# Feature 1 (3-11s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"feature1.mp4",
    "file_url":"https://storage.com/f1.mp4",
    "duration":8.0,
    "start_time":3.0,
    "end_time":11.0,
    "volume":0.8
  }'

# Feature 2 (11-19s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"feature2.mp4",
    "file_url":"https://storage.com/f2.mp4",
    "duration":8.0,
    "start_time":11.0,
    "end_time":19.0,
    "volume":0.8
  }'

# Testimonial (19-27s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"testimonial.mp4",
    "file_url":"https://storage.com/testimonial.mp4",
    "duration":8.0,
    "start_time":19.0,
    "end_time":27.0,
    "volume":1.0
  }'

# CTA (27-30s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"cta.mp4",
    "file_url":"https://storage.com/cta.mp4",
    "duration":3.0,
    "start_time":27.0,
    "end_time":30.0,
    "volume":1.0
  }'

# 5. Добавляем фоновую музыку
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"background_music.mp3",
    "file_url":"https://storage.com/music.mp3",
    "duration":120.0,
    "start_time":0.0,
    "end_time":30.0,
    "volume":0.25
  }'

# 6. Экспортируем финальное видео
EXPORT=$(curl -X POST http://api.nittor.com/projects/$PROJECT/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1920x1080",
    "fps":30,
    "quality":"high",
    "output_filename":"product_video_final.mp4"
  }' | jq -r '.export_id')

echo "Export ID: $EXPORT"

# 7. Проверяем статус
while true; do
  STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://api.nittor.com/exports/$EXPORT/status | jq -r '.status')
  echo "Export status: $STATUS"
  [ "$STATUS" = "completed" ] && break
  sleep 5
done

echo "✅ Video ready!"
```

**Результат:** Готовое 30-секундное видео с 5 сценами и фоновой музыкой.

---

## Use Case 2: Подкаст с несколькими спикерами

### Задача
Записать подкаст с 2 спикерами, добавить intro/outro музыку, экспортировать.

### Решение

```bash
# 1. Создаём проект
PROJECT=$(curl -X POST http://api.nittor.com/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Podcast Episode 5"}' \
  | jq -r '.id')

TRACK=$(curl -X POST http://api.nittor.com/projects/$PROJECT/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Audio Track"}' \
  | jq -r '.id')

# 2. Intro музыка (0-5s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"intro_jingle.mp3",
    "file_url":"https://storage.com/intro.mp3",
    "start_time":0.0,
    "end_time":5.0,
    "volume":0.8
  }'

# 3. Основная запись подкаста (5-1805s = ~30min)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"podcast_main.mp3",
    "file_url":"https://storage.com/recording.mp3",
    "start_time":5.0,
    "end_time":1805.0,
    "volume":1.0
  }'

# 4. Outro музыка (1805-1810s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"outro_jingle.mp3",
    "file_url":"https://storage.com/outro.mp3",
    "start_time":1805.0,
    "end_time":1810.0,
    "volume":0.8
  }'

# 5. Экспорт (аудио only, но с black video)
curl -X POST http://api.nittor.com/projects/$PROJECT/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1280x720",
    "fps":24,
    "quality":"medium"
  }'
```

**Результат:** 30-минутный подкаст с intro/outro музыкой.

---

## Use Case 3: Превью видео для Instagram

### Задача
Взять длинное видео, вырезать лучший момент, добавить текст, экспортировать в вертикальном формате.

### Решение

```bash
# 1. Создаём проект
PROJECT=$(curl -X POST http://api.nittor.com/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Instagram Preview"}' \
  | jq -r '.id')

TRACK=$(curl -X POST http://api.nittor.com/projects/$PROJECT/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Instagram Track"}' \
  | jq -r '.id')

# 2. Используем фрагмент длинного видео
# У нас есть 5-минутное видео, берём самый интересный момент (1:30-1:45)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"highlight.mp4",
    "file_url":"https://storage.com/long_video.mp4",
    "duration":300.0,
    "start_time":0.0,
    "end_time":15.0,
    "volume":1.0
  }'

# 3. Добавляем энергичную музыку
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"trendy_music.mp3",
    "file_url":"https://storage.com/music.mp3",
    "start_time":0.0,
    "end_time":15.0,
    "volume":0.4
  }'

# 4. Экспорт в вертикальном формате (9:16)
curl -X POST http://api.nittor.com/projects/$PROJECT/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1080x1920",
    "fps":30,
    "quality":"high",
    "output_filename":"instagram_reel.mp4"
  }'
```

**Результат:** 15-секундный вертикальный клип для Instagram Reels.

---

## Use Case 4: Образовательный курс

### Задача
Склеить 5 уроков в один длинный курс с intro перед каждым уроком.

### Решение

```bash
PROJECT=$(curl -X POST http://api.nittor.com/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Course: Python Basics"}' \
  | jq -r '.id')

TRACK=$(curl -X POST http://api.nittor.com/projects/$PROJECT/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Course Track"}' \
  | jq -r '.id')

# Lesson 1
# Intro (0-3s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"lesson1_intro.mp4",
    "file_url":"https://storage.com/l1_intro.mp4",
    "start_time":0.0,
    "end_time":3.0,
    "volume":1.0
  }'

# Content (3-303s = 5min)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"lesson1_content.mp4",
    "file_url":"https://storage.com/l1.mp4",
    "start_time":3.0,
    "end_time":303.0,
    "volume":1.0
  }'

# Lesson 2
# Intro (303-306s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"lesson2_intro.mp4",
    "file_url":"https://storage.com/l2_intro.mp4",
    "start_time":303.0,
    "end_time":306.0,
    "volume":1.0
  }'

# Content (306-606s)
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"lesson2_content.mp4",
    "file_url":"https://storage.com/l2.mp4",
    "start_time":306.0,
    "end_time":606.0,
    "volume":1.0
  }'

# ... ещё 3 урока аналогично

# Фоновая музыка на весь курс
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"background.mp3",
    "file_url":"https://storage.com/bg.mp3",
    "start_time":0.0,
    "end_time":1500.0,
    "volume":0.15
  }'

# Экспорт
curl -X POST http://api.nittor.com/projects/$PROJECT/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1920x1080",
    "fps":30,
    "quality":"high"
  }'
```

**Результат:** 25-минутный курс с 5 уроками и тихой фоновой музыкой.

---

## Use Case 5: Многоязычная версия видео

### Задача
Одно видео, но с разными голосовыми дорожками для разных языков.

### Решение

```bash
PROJECT=$(curl -X POST http://api.nittor.com/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Multilingual Video"}' \
  | jq -r '.id')

# Track 1: English version
TRACK_EN=$(curl -X POST http://api.nittor.com/projects/$PROJECT/tracks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"English Version","order_index":1}' \
  | jq -r '.id')

# Видео без звука
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK_EN/video \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"video_nosound.mp4",
    "file_url":"https://storage.com/video.mp4",
    "start_time":0.0,
    "end_time":60.0,
    "volume":0.0
  }'

# English voiceover
curl -X POST http://api.nittor.com/projects/$PROJECT/tracks/$TRACK_EN/audio \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filename":"voice_en.mp3",
    "file_url":"https://storage.com/en.mp3",
    "start_time":0.0,
    "end_time":60.0,
    "volume":1.0
  }'

# Экспорт English version
curl -X POST http://api.nittor.com/projects/$PROJECT/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1920x1080",
    "fps":30,
    "quality":"high",
    "output_filename":"video_en.mp4"
  }'

# Track 2: Spanish version
# Повторяем то же самое, но с испанским аудио
# ...
```

**Результат:** Несколько версий одного видео с разными языками.

---

## Use Case 6: Быстрый превью для клиента

### Задача
Клиент хочет увидеть черновик быстро. Экспортируем в low quality для preview.

### Решение

```bash
# Быстрый экспорт
curl -X POST http://api.nittor.com/projects/1/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution":"1280x720",
    "fps":24,
    "quality":"low",
    "output_filename":"preview_draft.mp4"
  }'

# Займёт ~10-20 секунд вместо 2-3 минут
```

**Результат:** Быстрый превью для согласования с клиентом.

---

## Use Case 7: Исправление громкости

### Задача
Видео получилось со слишком громкой музыкой. Нужно переэкспортировать с другой громкостью.

### Решение

```bash
# 1. Находим аудио клип
curl -H "Authorization: Bearer $TOKEN" \
  http://api.nittor.com/projects/1/tracks/1 | jq

# Response:
# {
#   "audio_files": [
#     {"id": 5, "filename": "music.mp3", "volume": 0.8}  # Слишком громко!
#   ]
# }

# 2. Обновляем громкость
curl -X PATCH http://api.nittor.com/projects/1/tracks/1/audio/5 \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"volume":0.3}'  # Уменьшаем

# 3. Переэкспортируем
curl -X POST http://api.nittor.com/projects/1/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"resolution":"1920x1080","fps":30,"quality":"high"}'
```

**Результат:** Новая версия с правильной громкостью музыки.

---

## Общие паттерны

### Паттерн 1: Intro + Content + Outro
```
[Intro 3s] → [Main Content 30s] → [Outro 3s]
Total: 36s
```

### Паттерн 2: Chapters
```
[Chapter 1: 5min] → [Transition 2s] → [Chapter 2: 5min] → ...
```

### Паттерн 3: Background Music
```
Video clips (volume: 0.7-1.0)
+ Background music (volume: 0.2-0.4)
```

### Паттерн 4: Voiceover
```
Video (volume: 0.3)  # приглушить встроенный звук
+ Voiceover (volume: 1.0)  # чёткий голос
```

### Паттерн 5: Multi-track mixing
```
Track 1: Main video
Track 2: Background music
Track 3: Sound effects
Track 4: Voiceover
```
