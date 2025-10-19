#!/usr/bin/env python3
"""
Скрипт для разделения api.rtf на файлы по 12,000 символов каждый
"""

import os

def split_rtf_file(input_file, chunk_size=12000):
    """
    Разделяет RTF файл на несколько файлов по chunk_size символов
    
    Args:
        input_file: путь к исходному RTF файлу
        chunk_size: количество символов в каждом файле (по умолчанию 12000)
    """
    # Проверяем существование файла
    if not os.path.exists(input_file):
        print(f"Ошибка: файл {input_file} не найден!")
        return
    
    # Читаем содержимое файла
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    total_chars = len(content)
    print(f"Всего символов в файле: {total_chars}")
    
    # Вычисляем количество файлов
    num_files = (total_chars + chunk_size - 1) // chunk_size
    print(f"Будет создано файлов: {num_files}")
    
    # Разделяем и сохраняем
    base_name = os.path.splitext(input_file)[0]
    
    for i in range(num_files):
        start_pos = i * chunk_size
        end_pos = min((i + 1) * chunk_size, total_chars)
        chunk = content[start_pos:end_pos]
        
        output_file = f"{base_name}_part_{i+1}.rtf"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(chunk)
        
        chunk_len = len(chunk)
        print(f"Создан файл: {output_file} ({chunk_len} символов)")
    
    print("\nГотово!")

if __name__ == "__main__":
    # Путь к файлу
    input_file = "api.rtf"
    
    # Размер чанка - 12,000 символов
    chunk_size = 12000
    
    split_rtf_file(input_file, chunk_size)
