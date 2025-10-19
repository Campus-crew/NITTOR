# Video Export - Подробное руководство

## Зачем это нужно?

**Проблема:** У пользователя есть несколько видео и аудио клипов на timeline. Нужно склеить их в один готовый mp4 файл.

**Решение:** FFmpeg экспорт, который:
- Склеивает видео в последовательность
- Обрезает клипы по timeline координатам
- Микширует аудиодорожки
- Применяет volume настройки
- Экспортирует финальный файл

## Как это работает?

### Полный процесс экспорта

```
User Request → Create Job → Background Processing → FFmpeg Render → Complete
     ↓              ↓                ↓                    ↓            ↓
  запрос      export_id        status:queued        обработка    ready
```

### Пошагово

**Шаг 1: Пользователь запускает экспорт**
```bash
POST /projects/1/export
{
  "resolution": "1920x1080",
  "fps": 30,
  "quality": "high"
}
```

**Шаг 2: Backend создаёт export job**
```python
export_id = str(uuid.uuid4())  # "550e8400-e29b-41d4-a716-446655440000"

export_jobs[export_id] = {
    "status": "queued",
    "progress": 0.0,
    "message": "Export queued"
}

# Запускаем в фоне
background_tasks.add_task(process_export, export_id, ...)

# Сразу возвращаем ответ пользователю
return {
    "export_id": export_id,
    "status": "queued",
    "message": "Export started in background"
}
```

**Шаг 3: Фоновая обработка**

Пользователь уже получил ответ и может делать другие запросы, а в это время:

```python
# 3.1. Собираем все клипы из треков
video_clips = []
audio_clips = []

for track in project.tracks:
    for video_file in track.video_files:
        video_clips.append({
            "file_url": video_file.file_url,
            "start_time": video_file.start_time,
            "end_time": video_file.end_time,
            "volume": video_file.volume
        })
    
    for audio_file in track.audio_files:
        audio_clips.append({
            "file_url": audio_file.file_url,
            "start_time": audio_file.start_time,
            "end_time": audio_file.end_time,
            "volume": audio_file.volume
        })

# video_clips = [
#     {"file_url": "https://.../intro.mp4", "start_time": 0.0, "end_time": 10.0, "volume": 1.0},
#     {"file_url": "https://.../main.mp4", "start_time": 10.0, "end_time": 25.0, "volume": 0.8}
# ]
# 
# audio_clips = [
#     {"file_url": "https://.../music.mp3", "start_time": 0.0, "end_time": 35.0, "volume": 0.3}
# ]
```

**Шаг 4: Генерация FFmpeg filter_complex**

Это самая сложная часть. Создаём инструкции для FFmpeg:

```python
# Для каждого видео клипа:
# 1. Trim (обрезка по времени)
# 2. Scale (масштабирование до целевого разрешения)
# 3. Volume (применение громкости к встроенному аудио)

filter_complex = []

# Видео 1
filter_complex.append(
    "[0:v]trim=start=0:end=10,setpts=PTS-STARTPTS,scale=1920:1080[v0];"
)
filter_complex.append(
    "[0:a]atrim=start=0:end=10,asetpts=PTS-STARTPTS,volume=1.0[a0];"
)

# Видео 2
filter_complex.append(
    "[1:v]trim=start=10:end=25,setpts=PTS-STARTPTS,scale=1920:1080[v1];"
)
filter_complex.append(
    "[1:a]atrim=start=10:end=25,asetpts=PTS-STARTPTS,volume=0.8[a1];"
)

# Склеиваем видео
filter_complex.append(
    "[v0][v1]concat=n=2:v=1:a=0[outv];"
)

# Склеиваем аудио из видео
filter_complex.append(
    "[a0][a1]concat=n=2:v=0:a=1[outa];"
)

# Добавляем отдельную аудиодорожку
filter_complex.append(
    "[2:a]atrim=start=0:end=35,volume=0.3[aud2];"
)

# Микшируем аудио (видео аудио + фоновая музыка)
filter_complex.append(
    "[outa][aud2]amix=inputs=2:duration=longest[finalaud]"
)

filter_complex_str = " ".join(filter_complex)
```

**Шаг 5: Запуск FFmpeg**

```bash
ffmpeg -y \
  -i https://storage.com/intro.mp4 \
  -i https://storage.com/main.mp4 \
  -i https://storage.com/music.mp3 \
  -filter_complex "[filter_complex_from_above]" \
  -map [outv] -map [finalaud] \
  -c:v libx264 \
  -preset slow \            # quality: high
  -crf 23 \
  -c:a aac \
  -b:a 192k \
  -r 30 \                   # fps
  /tmp/kernel_exports/project_1_abc123.mp4
```

**Параметры FFmpeg:**
- `-y` - перезаписать файл если существует
- `-i` - входные файлы
- `-filter_complex` - сложная цепочка фильтров
- `-map` - какие потоки использовать
- `-c:v libx264` - кодек видео (H.264)
- `-preset` - скорость/качество
- `-crf 23` - качество (0=lossless, 51=worst, 23=good)
- `-c:a aac` - кодек аудио
- `-b:a 192k` - bitrate аудио
- `-r 30` - fps

**Шаг 6: FFmpeg рендерит видео**

Это занимает время (от секунд до минут):

```python
export_jobs[export_id]["status"] = "processing"
export_jobs[export_id]["progress"] = 0.5

# FFmpeg работает...
# Типичное время: 1-3x realtime
# (30s видео = 30-90s рендера)

result = subprocess.run(
    ffmpeg_cmd,
    timeout=600,  # 10 минут максимум
    capture_output=True
)
```

**Шаг 7: Завершение**

```python
if result.returncode == 0:
    export_jobs[export_id]["status"] = "completed"
    export_jobs[export_id]["progress"] = 1.0
    export_jobs[export_id]["output_url"] = output_path
else:
    export_jobs[export_id]["status"] = "failed"
    export_jobs[export_id]["message"] = result.stderr
```

**Шаг 8: Пользователь проверяет статус**

```bash
GET /exports/550e8400-e29b-41d4-a716-446655440000/status

Response:
{
  "status": "completed",
  "progress": 1.0,
  "message": "Export completed",
  "output_url": "/tmp/kernel_exports/project_1_abc123.mp4"
}
```

## Параметры экспорта

### resolution
**Формат:** "WIDTHxHEIGHT"
**Примеры:**
- `"1920x1080"` - Full HD
- `"1280x720"` - HD
- `"3840x2160"` - 4K
- `"640x480"` - SD

### fps (Frames Per Second)
**Тип:** Integer
**Примеры:**
- `24` - кинематографический
- `30` - стандартный (default)
- `60` - плавный (gaming, спорт)

### quality
**Тип:** String (preset)
**Значения:**

| Quality | FFmpeg Preset | Скорость | Размер файла | Качество |
|---------|---------------|----------|--------------|----------|
| low     | fast          | быстро   | большой      | среднее  |
| medium  | medium        | средне   | средний      | хорошее  |
| high    | slow          | медленно | меньший      | отличное |
| ultra   | veryslow      | очень медленно | минимальный | максимальное |

**Рекомендации:**
- `low` - для превью, черновиков
- `medium` - для обычных роликов
- `high` - для публикации
- `ultra` - для важных проектов

### format
**Тип:** String
**Default:** "mp4"
**Поддерживается:** mp4 (пока только)

## Примеры использования

### Пример 1: Простой экспорт

```bash
# Есть проект с 2 видео и 1 аудио
# Экспортируем в HD с хорошим качеством

curl -X POST http://api.nittor.com/projects/1/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution": "1920x1080",
    "fps": 30,
    "quality": "high"
  }'

# Response:
{
  "export_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Export started in background"
}
```

### Пример 2: Быстрый экспорт для превью

```bash
# Низкое разрешение, быстрый рендер
curl -X POST http://api.nittor.com/projects/1/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution": "1280x720",
    "fps": 24,
    "quality": "low",
    "output_filename": "preview.mp4"
  }'
```

### Пример 3: 4K максимальное качество

```bash
# Для финальной версии
curl -X POST http://api.nittor.com/projects/1/export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resolution": "3840x2160",
    "fps": 60,
    "quality": "ultra",
    "output_filename": "final_4k.mp4"
  }'
```

### Пример 4: Проверка статуса

```bash
# Сохраняем export_id
EXPORT_ID="550e8400-e29b-41d4-a716-446655440000"

# Проверяем каждые 5 секунд
while true; do
  STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://api.nittor.com/exports/$EXPORT_ID/status \
    | jq -r '.status')
  
  echo "Status: $STATUS"
  
  if [ "$STATUS" = "completed" ]; then
    echo "Export ready!"
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "Export failed!"
    break
  fi
  
  sleep 5
done
```

## Состояния экспорта

```
queued → processing → completed
   ↓
  failed
```

**queued**
- Экспорт в очереди
- Ожидает начала обработки
- `progress: 0.0`

**processing**
- FFmpeg рендерит видео
- Может занять от секунд до минут
- `progress: 0.1 - 0.9`

**completed**
- Экспорт завершён успешно
- Файл готов
- `progress: 1.0`
- `output_url` содержит путь к файлу

**failed**
- Произошла ошибка
- `message` содержит описание ошибки

## Производительность

### Время рендера

Зависит от:
1. **Длительность видео**
   - 30s video ≈ 30-90s render (high quality)
   - 2min video ≈ 2-6min render

2. **Quality preset**
   - low: ~1x realtime
   - medium: ~1-2x realtime
   - high: ~2-3x realtime
   - ultra: ~5-10x realtime

3. **Resolution**
   - 720p: быстрее
   - 1080p: средне
   - 4K: медленнее в 4 раза

4. **CPU сервера**
   - Больше cores = быстрее
   - FFmpeg использует multi-threading

### Оптимизация

**Для быстрого рендера:**
```json
{
  "resolution": "1280x720",
  "fps": 24,
  "quality": "low"
}
```

**Для баланса:**
```json
{
  "resolution": "1920x1080",
  "fps": 30,
  "quality": "medium"
}
```

**Для максимального качества:**
```json
{
  "resolution": "1920x1080",
  "fps": 30,
  "quality": "high"
}
```

## Требования

### FFmpeg установка

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Проверка:**
```bash
ffmpeg -version
# Должно показать версию 4.0+
```

### Disk Space

Экспортированные файлы сохраняются в:
```
/tmp/kernel_exports/
```

**Примерный размер:**
- 30s 1080p high: ~10-20 MB
- 2min 1080p high: ~40-80 MB
- 5min 4K ultra: ~500-1000 MB

**Очистка:**
```bash
# Удалить старые экспорты
find /tmp/kernel_exports/ -type f -mtime +7 -delete
```

## Troubleshooting

### Error: "Project has no tracks to export"
**Проблема:** В проекте нет треков или видео клипов
**Решение:** Добавьте хотя бы один видео клип

### Error: "FFmpeg timeout"
**Проблема:** Рендер занял больше 10 минут
**Решение:**
- Уменьшите разрешение
- Используйте lower quality preset
- Разбейте на несколько частей

### Error: "FFmpeg error: ..."
**Проблема:** FFmpeg не смог обработать файлы
**Частые причины:**
- Недоступные URLs файлов
- Corrupted video files
- Несовместимые кодеки

**Решение:**
- Проверьте доступность file_url
- Убедитесь что файлы корректные
- Проверьте логи FFmpeg в error message

### Status остаётся "processing" долго
**Проблема:** Экспорт застрял
**Причины:**
- Большое видео (это нормально)
- Много клипов
- Ultra quality preset

**Решение:**
- Подождите (рендер может занять время)
- Проверьте логи сервера
- Если >30min - возможно зависло, перезапустите

### Выходной файл слишком большой
**Проблема:** Размер файла больше ожидаемого
**Решение:**
- Используйте higher quality preset (парадоксально, но slow preset даёт меньший размер при лучшем качестве)
- Уменьшите разрешение
- Уменьшите bitrate аудио

### Звук рассинхронизирован
**Проблема:** Аудио не совпадает с видео
**Причина:** Некорректные start_time/end_time
**Решение:** Проверьте timeline координаты всех клипов

## Будущие улучшения

Планируется добавить:
- ✅ Upload в Azure Blob Storage
- ✅ Webhooks при завершении
- ✅ Progress percentage во время рендера
- ✅ Transitions между клипами
- ✅ Text overlays
- ✅ Watermarks
- ✅ Multiple formats (webm, mov)
