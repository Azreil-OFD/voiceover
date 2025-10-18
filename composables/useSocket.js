import { io } from 'socket.io-client'

let socket = null

export const useSocket = () => {
  if (!socket) {
    // Подключаемся к тому же порту, что и Nuxt приложение
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    })
  }
  
  return socket
}
