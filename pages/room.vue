<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-gray-800 p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold">VoiceOver</h1>
        <span class="text-sm text-gray-400">Пользователь: {{ currentUser }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-sm">{{ onlineUsers.length }} онлайн</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <!-- User List (показывается когда больше 1 пользователя) -->
      <div v-if="onlineUsers.length > 1" class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Выберите пользователя для звонка:</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="user in otherUsers"
            :key="user.id"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            @click="startCall(user)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-medium">{{ user.username }}</h3>
                <p class="text-sm text-gray-400">Нажмите для звонка</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Waiting Message -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v2M7 8h10"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Ожидание других пользователей</h2>
        <p class="text-gray-400">Когда кто-то еще присоединится, вы сможете начать видеозвонок</p>
      </div>

      <!-- Call Interface -->
      <CallInterface
        v-if="isInCall"
        :remote-user="callPartner"
        :is-caller="isCaller"
        @end-call="endCall"
      />

      <!-- Incoming Call Modal -->
      <IncomingCallModal
        v-if="incomingCall"
        :caller="incomingCall.caller"
        @accept="acceptCall"
        @decline="declineCall"
      />
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'

// Reactive data
const currentUser = ref('')
const onlineUsers = ref([])
const isInCall = ref(false)
const callPartner = ref(null)
const isCaller = ref(false)
const incomingCall = ref(null)
const socket = ref(null)

// Computed
const otherUsers = computed(() => {
  return onlineUsers.value.filter(user => user.username !== currentUser.value)
})

// Methods
const startCall = (user) => {
  if (socket.value) {
    isCaller.value = true
    callPartner.value = user
    isInCall.value = true
    socket.value.emit('call-user', {
      to: user.id,
      from: currentUser.value
    })
  }
}

const acceptCall = () => {
  if (socket.value && incomingCall.value) {
    isCaller.value = false
    callPartner.value = incomingCall.value.caller
    isInCall.value = true
    socket.value.emit('call-accepted', {
      to: incomingCall.value.caller.id,
      from: currentUser.value
    })
    incomingCall.value = null
  }
}

const declineCall = () => {
  if (socket.value && incomingCall.value) {
    socket.value.emit('call-declined', {
      to: incomingCall.value.caller.id,
      from: currentUser.value
    })
    incomingCall.value = null
  }
}

const endCall = () => {
  isInCall.value = false
  callPartner.value = null
  isCaller.value = false
  if (socket.value) {
    socket.value.emit('end-call')
  }
}

// Socket setup
const setupSocket = () => {
  socket.value = useSocket()
  
  socket.value.on('connect', () => {
    console.log('Connected to server')
    // Отправляем информацию о пользователе
    socket.value.emit('user-join', {
      username: currentUser.value
    })
  })

  socket.value.on('users-updated', (users) => {
    onlineUsers.value = users
  })

  socket.value.on('incoming-call', (data) => {
    incomingCall.value = data
  })

  socket.value.on('call-accepted', () => {
    // Звонок принят, начинаем WebRTC соединение
    console.log('Call accepted')
  })

  socket.value.on('call-declined', () => {
    // Звонок отклонен
    isInCall.value = false
    callPartner.value = null
    isCaller.value = false
    alert('Звонок отклонен')
  })

  socket.value.on('call-ended', () => {
    endCall()
  })

  // WebRTC signaling events
  socket.value.on('offer', (data) => {
    // Обрабатываем offer от другого пользователя
    console.log('Received offer:', data)
  })

  socket.value.on('answer', (data) => {
    // Обрабатываем answer от другого пользователя
    console.log('Received answer:', data)
  })

  socket.value.on('ice-candidate', (data) => {
    // Обрабатываем ICE candidate от другого пользователя
    console.log('Received ICE candidate:', data)
  })

  socket.value.on('disconnect', () => {
    console.log('Disconnected from server')
  })
}

// Lifecycle
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  if (!savedUsername) {
    navigateTo('/')
    return
  }
  
  currentUser.value = savedUsername
  setupSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>
