# Azure OpenAI - Генерация сценариев

## Зачем это нужно?

**Проблема:** Пользователь хочет создать видео, но не знает как разбить идею на конкретные шаги.

**Решение:** AI автоматически генерирует структурированный сценарий из текстового описания.

## Как работает?

### 1. Flow генерации

```
User → API → Context Service → Azure OpenAI → Validation → Database → Response
```

### 2. Пошагово

**Шаг 1: User отправляет запрос**
```bash
POST /projects/1/scenario/generate
{
  "title": "Product Launch Video",
  "outline": "30s video: intro, 3 features, testimonial, CTA",
  "use_context": true
}
```

**Шаг 2: Собираем контекст проекта**
```python
# Если use_context = true
context = ContextService.build_generation_context(
    project_id=1,
    use_project_context=True
)

# context содержит:
# - Существующие файлы проекта
# - Предыдущие сценарии (если есть)
# - Метаданные проекта
```

**Шаг 3: Формируем промпт**
```python
system_prompt = """
You are a video production planner.
Convert outlines into structured scenarios.
Return ONLY JSON with:
{
  "scenario": {"title": "...", "description": "..."},
  "steps": [
    {"title": "...", "description": "...", 
     "step_type": "scene", "order_index": 1}
  ]
}
"""

user_prompt = f"""
Create scenario for: {title}
Outline: {outline}
Context: {context.context_summary}
"""
```

**Шаг 4: Вызываем Azure OpenAI**
```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    response_format={"type": "json_object"}
)
```

**Шаг 5: AI возвращает JSON**
```json
{
  "scenario": {
    "title": "Product Launch Video",
    "description": "30-second promotional video"
  },
  "steps": [
    {
      "title": "Logo Animation",
      "description": "Animated company logo with fade-in",
      "step_type": "scene",
      "order_index": 1,
      "estimated_duration": 3
    },
    {
      "title": "Product Showcase",
      "description": "Show product with 3 key features",
      "step_type": "scene",
      "order_index": 2,
      "estimated_duration": 15
    },
    {
      "title": "Customer Testimonial",
      "description": "Happy customer review",
      "step_type": "dialogue",
      "order_index": 3,
      "estimated_duration": 8
    },
    {
      "title": "Call to Action",
      "description": "Website URL and buy button",
      "step_type": "other",
      "order_index": 4,
      "estimated_duration": 4
    }
  ]
}
```

**Шаг 6: Валидация**
```python
# Проверяем структуру
if "scenario" not in result or "steps" not in result:
    raise ValueError("Invalid AI response")

# Валидируем step_type
for step in steps:
    if step["step_type"] not in StepType.values():
        step["step_type"] = "other"  # fallback

# Проверяем order_index
for i, step in enumerate(steps, 1):
    step["order_index"] = i  # нормализуем
```

**Шаг 7: Сохраняем в БД**
```python
# Создаём Scenario
scenario = Scenario(
    project_id=1,
    title="Product Launch Video",
    prompt="30s video: intro, 3 features, testimonial, CTA",
    generated_by_ai=True,
    ai_model_used="gpt-4"
)
db.add(scenario)

# Создаём Steps
for step_data in ai_result["steps"]:
    step = ScenarioStep(
        scenario_id=scenario.id,
        title=step_data["title"],
        description=step_data["description"],
        step_type=step_data["step_type"],
        order_index=step_data["order_index"]
    )
    db.add(step)

db.commit()
```

**Шаг 8: Возвращаем пользователю**
```json
{
  "id": 1,
  "title": "Product Launch Video",
  "prompt": "30s video: intro, 3 features, testimonial, CTA",
  "generated_by_ai": true,
  "steps": [
    {"id": 1, "title": "Logo Animation", ...},
    {"id": 2, "title": "Product Showcase", ...},
    {"id": 3, "title": "Customer Testimonial", ...},
    {"id": 4, "title": "Call to Action", ...}
  ]
}
```

## Типы шагов

```python
SCENE       = "scene"        # Основная сцена
CHARACTER   = "character"    # Представление персонажа
LOCATION    = "location"     # Локация
DIALOGUE    = "dialogue"     # Диалог
ACTION      = "action"       # Действие
TRANSITION  = "transition"   # Переход
EFFECT      = "effect"       # Эффект
MUSIC       = "music"        # Музыка
VOICEOVER   = "voiceover"    # Закадровый голос
OTHER       = "other"        # Другое
```

## Контекст проекта

**Зачем нужен?**
- AI понимает что уже есть в проекте
- Генерирует шаги с учётом существующих файлов
- Предлагает использовать имеющиеся ресурсы

**Пример с контекстом:**
```
Проект уже содержит:
- logo.mp4 (video, 5s)
- product_demo.mp4 (video, 20s)
- background_music.mp3 (audio, 120s)

AI сгенерирует шаги, учитывающие эти файлы:
Step 1: "Use logo.mp4 for intro animation"
Step 2: "Use product_demo.mp4 for feature showcase"
Step 3: "Add background_music.mp3 at 30% volume"
```

## Примеры использования

### Пример 1: Простой сценарий
```bash
curl -X POST http://api.nittor.com/projects/1/scenario/generate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Company Overview",
    "outline": "2 minute video about company history and team",
    "use_context": false
  }'
```

### Пример 2: С контекстом проекта
```bash
# В проекте уже есть файлы
curl -X POST http://api.nittor.com/projects/1/scenario/generate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Product Demo",
    "outline": "Show product features and benefits",
    "use_context": true
  }'
```

### Пример 3: Кастомная модель
```bash
curl -X POST http://api.nittor.com/projects/1/scenario/generate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Quick Ad",
    "outline": "15s Facebook ad with CTA",
    "model": "gpt-4-turbo",
    "use_context": true
  }'
```

## Конфигурация

### .env файл
```bash
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Где взять credentials?
1. Azure Portal → Azure OpenAI Service
2. Create resource → OpenAI
3. Deploy model (gpt-4)
4. Copy Keys and Endpoint

## Ограничения

- **Один сценарий на проект** (нужно удалить старый перед созданием нового)
- **Timeout:** 30 секунд на ответ от AI
- **Max tokens:** 2000 для ответа
- **Rate limits:** зависят от Azure подписки

## Troubleshooting

### Error: "Project already has a scenario"
**Решение:** Удалите существующий сценарий
```bash
DELETE /projects/1/scenario
```

### Error: "Azure OpenAI error: 401 Unauthorized"
**Решение:** Проверьте API key в .env

### Error: "Invalid AI response"
**Решение:** AI вернул некорректный JSON. Попробуйте:
- Упростить outline
- Убрать спецсимволы
- Использовать другую модель

### AI генерирует слишком мало/много шагов
**Решение:** Уточните в outline:
```
Плохо: "Make a video"
Хорошо: "30s video with exactly 5 steps: intro, 3 features, CTA"
```
