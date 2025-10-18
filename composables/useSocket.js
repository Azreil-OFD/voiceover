import { io } from 'socket.io-client'

let socket = null

export const useSocket = () => {
  if (!socket) {
    const config = useRuntimeConfig()
    const socketUrl = config.public.socketUrl || 'http://localhost:3001'
    console.log('Connecting to socket:', socketUrl)
    
    socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    })
  }
  
  return socket
}
