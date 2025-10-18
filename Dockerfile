# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# Меняем владельца файлов
RUN chown -R nuxt:nodejs /app
USER nuxt

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", ".output/server/index.mjs"]
