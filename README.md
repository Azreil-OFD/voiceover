# VoiceOver - WebRTC Video Chat Application

Приложение для видеозвонков на базе Nuxt 3 и WebRTC с real-time коммуникацией через Socket.io.

## Возможности

- 🔐 Простой вход по никнейму
- 👥 Список онлайн пользователей
- 📞 Инициация видеозвонков
- ✅ Подтверждение входящих звонков
- 🎥 Видео и аудио передача через WebRTC
- 🎛️ Управление микрофоном и камерой
- 📱 Адаптивный дизайн

## Технологии

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Node.js, Socket.io
- **WebRTC**: Peer-to-peer видеозвонки
- **Real-time**: Socket.io для signaling

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
npm install
```

## Запуск

### Разработка

Запустите клиент и сервер одновременно:

```bash
npm run dev:all
```

Или запустите отдельно:

```bash
# Терминал 1 - Socket.io сервер
npm run dev:socket

# Терминал 2 - Nuxt клиент
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

### Продакшн

```bash
# Сборка приложения (включает серверную часть)
npm run build

# Запуск продакшн сервера
node .output/server/index.mjs

# Или предварительный просмотр
npm run preview
```

**Важно:** Используйте `npm run build` для продакшн сборки, так как `npm run generate` создает только статическую версию без серверной части (Socket.io не будет работать).

## Использование

1. Откройте `http://localhost:3000`
2. Введите ваш никнейм
3. Дождитесь других пользователей
4. Выберите пользователя для звонка
5. Примите или отклоните входящий звонок
6. Наслаждайтесь видеозвонком!

## Структура проекта

```
voiceover/
├── components/          # Vue компоненты
│   ├── CallInterface.vue    # Интерфейс видеозвонка
│   └── IncomingCallModal.vue # Модальное окно входящего звонка
├── composables/         # Vue composables
│   └── useSocket.js         # Socket.io интеграция
├── pages/              # Страницы приложения
│   ├── index.vue           # Главная страница (вход)
│   └── room.vue            # Страница комнаты
├── server/             # Nitro сервер
│   └── plugins/            # Серверные плагины
│       └── socket.io.ts        # Socket.io сервер
└── public/             # Статические файлы
```

## WebRTC Signaling

Приложение использует Socket.io для WebRTC signaling:
- `offer` - Предложение соединения
- `answer` - Ответ на предложение
- `ice-candidate` - ICE кандидаты для NAT traversal

## Безопасность

- Приложение работает только по HTTPS в продакшне
- WebRTC требует HTTPS для доступа к камере/микрофону
- Используются STUN серверы Google для NAT traversal

## Развертывание

### Локальная разработка с ngrok

Для тестирования с внешними пользователями используйте ngrok:

```bash
# Установите ngrok
npm install -g ngrok

# Запустите приложение
npm run dev:all

# В другом терминале запустите ngrok для Nuxt (порт 3000)
ngrok http 3000

# В третьем терминале запустите ngrok для Socket.io (порт 3001)
ngrok http 3001
```

ngrok предоставит два публичных URL:
- Для Nuxt приложения (например, `https://abc123.ngrok.io`)
- Для Socket.io сервера (например, `https://def456.ngrok.io`)

Обновите `socketUrl` в `nuxt.config.ts` на URL Socket.io сервера.

### Продакшн развертывание

1. Настройте HTTPS
2. Используйте TURN серверы для корпоративных сетей
3. Настройте переменные окружения

## Лицензия

MIT License
