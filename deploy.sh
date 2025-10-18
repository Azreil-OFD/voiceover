#!/bin/bash

# Скрипт для развертывания VoiceOver приложения

echo "🚀 Развертывание VoiceOver приложения..."

# Останавливаем существующие контейнеры
echo "📦 Останавливаем существующие контейнеры..."
docker-compose down

# Удаляем старые образы
echo "🧹 Очищаем старые образы..."
docker system prune -f

# Собираем новые образы
echo "🔨 Собираем новые образы..."
docker-compose build --no-cache

# Запускаем контейнеры
echo "▶️ Запускаем контейнеры..."
docker-compose up -d

# Проверяем статус
echo "📊 Проверяем статус контейнеров..."
docker-compose ps

# Показываем логи
echo "📝 Последние логи:"
docker-compose logs --tail=50

echo "✅ Развертывание завершено!"
echo "🌐 Приложение доступно по адресу: https://voiceover.evil-chan.ru"
echo "📋 Для просмотра логов: docker-compose logs -f"
echo "🛑 Для остановки: docker-compose down"
