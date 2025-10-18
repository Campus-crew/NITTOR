"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Keyboard } from "lucide-react";

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Справка и горячие клавиши</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Узнайте, как эффективно работать с редактором
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Workflow */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#B4E031]">📋</span>
              Рабочий процесс
            </h3>
            <ol className="space-y-2 text-sm text-zinc-300 list-decimal list-inside">
              <li>Создайте сценарий на вкладке "Сценарий"</li>
              <li>Перейдите на вкладку "Видео"</li>
              <li>Выберите режим: "Видео по описанию" или "Видео по картинкам"</li>
              <li>Выберите сцену из списка справа</li>
              <li>Опишите кадр или загрузите изображения</li>
              <li>Дождитесь генерации и нажмите "Сцена готова → Следующая"</li>
              <li>Повторите для всех сцен</li>
              <li>Используйте таймлайн для монтажа</li>
            </ol>
          </div>

          {/* Keyboard shortcuts */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-[#B4E031]" />
              Горячие клавиши
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2">
                <span className="text-zinc-300">Воспроизведение/Пауза</span>
                <kbd className="bg-zinc-700 px-2 py-1 rounded text-xs font-mono">Пробел</kbd>
              </div>
              <div className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2">
                <span className="text-zinc-300">Воспроизведение/Пауза</span>
                <kbd className="bg-zinc-700 px-2 py-1 rounded text-xs font-mono">K</kbd>
              </div>
              <div className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2">
                <span className="text-zinc-300">Отправить сообщение</span>
                <kbd className="bg-zinc-700 px-2 py-1 rounded text-xs font-mono">Enter</kbd>
              </div>
              <div className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2">
                <span className="text-zinc-300">Новая строка в чате</span>
                <kbd className="bg-zinc-700 px-2 py-1 rounded text-xs font-mono">Shift+Enter</kbd>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#B4E031]">✨</span>
              Возможности
            </h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <strong>Сохранение общих черт</strong> - включите чекбокс, чтобы сохранить
                  стиль, персонажей и другие элементы между кадрами
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <strong>Загрузка изображений</strong> - в режиме "Видео по картинкам"
                  можно загрузить до 10MB на изображение
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <strong>Таймлайн-редактор</strong> - вырезайте, вставляйте, ускоряйте
                  и замедляйте клипы
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <strong>Автосохранение</strong> - ваш прогресс сохраняется автоматически
                  в браузере
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#B4E031]">💡</span>
              Советы
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300 list-disc list-inside">
              <li>Будьте конкретны в описаниях кадров для лучших результатов</li>
              <li>Используйте "Сохранять общие черты" для последовательности стиля</li>
              <li>Проверяйте каждый кадр перед переходом к следующему</li>
              <li>Используйте таймлайн для точной настройки длительности</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
