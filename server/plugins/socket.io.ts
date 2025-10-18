import { Server as SocketIOServer } from 'socket.io'

export default async (nitroApp: any) => {
  const io = new SocketIOServer(nitroApp.h3App.websocket, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // Хранилище пользователей
  const users = new Map()

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Пользователь присоединяется
    socket.on('user-join', (data) => {
      const user = {
        id: socket.id,
        username: data.username,
        socket: socket
      }
      
      users.set(socket.id, user)
      console.log('User joined:', user.username)
      
      // Отправляем обновленный список пользователей всем
      broadcastUsers()
    })

    // Инициация звонка
    socket.on('call-user', (data) => {
      const caller = users.get(socket.id)
      const targetUser = Array.from(users.values()).find(u => u.id === data.to)
      
      if (targetUser) {
        console.log(`${caller.username} calling ${targetUser.username}`)
        targetUser.socket.emit('incoming-call', {
          caller: {
            id: caller.id,
            username: caller.username
          }
        })
      }
    })

    // Принятие звонка
    socket.on('call-accepted', (data) => {
      const accepter = users.get(socket.id)
      const caller = Array.from(users.values()).find(u => u.id === data.to)
      
      if (caller) {
        console.log(`${accepter.username} accepted call from ${caller.username}`)
        caller.socket.emit('call-accepted', {
          accepter: {
            id: accepter.id,
            username: accepter.username
          }
        })
      }
    })

    // Отклонение звонка
    socket.on('call-declined', (data) => {
      const decliner = users.get(socket.id)
      const caller = Array.from(users.values()).find(u => u.id === data.to)
      
      if (caller) {
        console.log(`${decliner.username} declined call from ${caller.username}`)
        caller.socket.emit('call-declined')
      }
    })

    // Завершение звонка
    socket.on('end-call', () => {
      const user = users.get(socket.id)
      if (user) {
        console.log(`${user.username} ended call`)
        // Уведомляем всех пользователей о завершении звонка
        socket.broadcast.emit('call-ended')
      }
    })

    // WebRTC signaling
    socket.on('offer', (data) => {
      const targetUser = Array.from(users.values()).find(u => u.id === data.to)
      if (targetUser) {
        targetUser.socket.emit('offer', {
          offer: data.offer,
          from: socket.id
        })
      }
    })

    socket.on('answer', (data) => {
      const targetUser = Array.from(users.values()).find(u => u.id === data.to)
      if (targetUser) {
        targetUser.socket.emit('answer', {
          answer: data.answer,
          from: socket.id
        })
      }
    })

    socket.on('ice-candidate', (data) => {
      const targetUser = Array.from(users.values()).find(u => u.id === data.to)
      if (targetUser) {
        targetUser.socket.emit('ice-candidate', {
          candidate: data.candidate,
          from: socket.id
        })
      }
    })

    // Отключение пользователя
    socket.on('disconnect', () => {
      const user = users.get(socket.id)
      if (user) {
        console.log('User disconnected:', user.username)
        users.delete(socket.id)
        broadcastUsers()
      }
    })

    // Функция для отправки списка пользователей
    function broadcastUsers() {
      const userList = Array.from(users.values()).map(user => ({
        id: user.id,
        username: user.username
      }))
      
      io.emit('users-updated', userList)
    }
  })

  console.log('Socket.io server initialized')
}
