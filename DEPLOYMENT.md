# Развертывание VoiceOver

## Docker контейнеры

Приложение состоит из трех сервисов:
- **nuxt** - основное приложение на Nuxt 3
- **socket** - Socket.io сервер для WebRTC signaling
- **caddy** - веб-сервер с автоматическим HTTPS

## Варианты развертывания

### 1. Основной (рекомендуемый)
```bash
docker-compose up -d
```

### 2. Упрощенный (если основной не работает)
```bash
docker-compose -f docker-compose.simple.yml up -d
```

### 3. С встроенной конфигурацией
```bash
docker-compose -f docker-compose.embedded.yml up -d
```

## Настройка домена

1. Убедитесь, что домен `voiceover.evil-chan.ru` указывает на ваш сервер
2. Caddy автоматически получит SSL сертификат от Let's Encrypt
3. Приложение будет доступно по адресу: `https://voiceover.evil-chan.ru`

## Проверка работы

```bash
# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f nuxt
docker-compose logs -f socket
docker-compose logs -f caddy
```

## Обновление

```bash
# Остановка
docker-compose down

# Пересборка и запуск
docker-compose up -d --build
```

## Устранение проблем

### Если volumes не поддерживаются
Используйте `docker-compose.simple.yml` или `docker-compose.embedded.yml`

### Если healthcheck не поддерживается
Удалите секции `healthcheck` из docker-compose.yml

### Если порты заблокированы
Убедитесь, что порты 80 и 443 открыты в файрволе

## Структура

```
voiceover/
├── Dockerfile              # Nuxt приложение
├── Dockerfile.socket       # Socket.io сервер
├── Dockerfile.caddy        # Caddy с конфигурацией
├── Caddyfile              # Конфигурация Caddy
├── docker-compose.yml     # Основной compose файл
├── docker-compose.simple.yml    # Упрощенная версия
├── docker-compose.embedded.yml  # С встроенной конфигурацией
└── deploy.sh              # Скрипт развертывания
```
