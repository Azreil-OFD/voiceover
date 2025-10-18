<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
    <div class="bg-gray-900 rounded-lg p-6 w-full max-w-4xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold">Видеозвонок с {{ remoteUser?.username }}</h2>
          <p class="text-gray-400">{{ isCaller ? 'Исходящий звонок' : 'Входящий звонок' }}</p>
        </div>
        <button
          @click="$emit('end-call')"
          class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Video Container -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Remote Video -->
        <div class="relative">
          <h3 class="text-sm font-medium mb-2">Удаленный пользователь</h3>
          <div class="bg-gray-800 rounded-lg aspect-video relative overflow-hidden">
            <video
              ref="remoteVideo"
              autoplay
              playsinline
              class="w-full h-full object-cover"
            ></video>
            <div v-if="!remoteStream" class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span class="text-2xl font-bold">{{ remoteUser?.username?.charAt(0).toUpperCase() }}</span>
                </div>
                <p class="text-gray-400">Ожидание видео...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Local Video -->
        <div class="relative">
          <h3 class="text-sm font-medium mb-2">Ваше видео</h3>
          <div class="bg-gray-800 rounded-lg aspect-video relative overflow-hidden">
            <video
              ref="localVideo"
              autoplay
              playsinline
              muted
              class="w-full h-full object-cover"
            ></video>
            <div v-if="!localStream" class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <p class="text-gray-400">Загрузка камеры...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center space-x-4">
        <button
          @click="toggleMute"
          :class="[
            'p-4 rounded-full transition-colors',
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          <svg v-if="isMuted" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
        </button>

        <button
          @click="toggleVideo"
          :class="[
            'p-4 rounded-full transition-colors',
            !isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          <svg v-if="!isVideoEnabled" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>

        <button
          @click="$emit('end-call')"
          class="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  remoteUser: {
    type: Object,
    required: true
  },
  isCaller: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['end-call'])

// Reactive data
const localVideo = ref(null)
const remoteVideo = ref(null)
const localStream = ref(null)
const remoteStream = ref(null)
const isMuted = ref(false)
const isVideoEnabled = ref(true)
const peerConnection = ref(null)

// WebRTC configuration
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

// Methods
const initializeWebRTC = async () => {
  try {
    // Получаем доступ к камере и микрофону
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    
    if (localVideo.value) {
      localVideo.value.srcObject = localStream.value
    }

    // Создаем peer connection
    peerConnection.value = new RTCPeerConnection(rtcConfig)

    // Добавляем локальный поток
    localStream.value.getTracks().forEach(track => {
      peerConnection.value.addTrack(track, localStream.value)
    })

    // Обработка удаленного потока
    peerConnection.value.ontrack = (event) => {
      remoteStream.value = event.streams[0]
      if (remoteVideo.value) {
        remoteVideo.value.srcObject = remoteStream.value
      }
    }

    // Обработка ICE candidates
    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        // Отправляем ICE candidate через socket
        const socket = useSocket()
        if (socket) {
          socket.emit('ice-candidate', {
            to: props.remoteUser.id,
            candidate: event.candidate
          })
        }
      }
    }

    // Если мы инициатор звонка, создаем offer
    if (props.isCaller) {
      await createOffer()
    }

  } catch (error) {
    console.error('Error accessing media devices:', error)
    alert('Не удалось получить доступ к камере и микрофону')
  }
}

const createOffer = async () => {
  try {
    const offer = await peerConnection.value.createOffer()
    await peerConnection.value.setLocalDescription(offer)
    
    const socket = useSocket()
    if (socket) {
      socket.emit('offer', {
        to: props.remoteUser.id,
        offer: offer
      })
    }
  } catch (error) {
    console.error('Error creating offer:', error)
  }
}

const createAnswer = async (offer) => {
  try {
    await peerConnection.value.setRemoteDescription(offer)
    const answer = await peerConnection.value.createAnswer()
    await peerConnection.value.setLocalDescription(answer)
    
    const socket = useSocket()
    if (socket) {
      socket.emit('answer', {
        to: props.remoteUser.id,
        answer: answer
      })
    }
  } catch (error) {
    console.error('Error creating answer:', error)
  }
}

const handleOffer = async (offer) => {
  await createAnswer(offer)
}

const handleAnswer = async (answer) => {
  await peerConnection.value.setRemoteDescription(answer)
}

const handleIceCandidate = async (candidate) => {
  await peerConnection.value.addIceCandidate(candidate)
}

const toggleMute = () => {
  if (localStream.value) {
    const audioTrack = localStream.value.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      isMuted.value = !audioTrack.enabled
    }
  }
}

const toggleVideo = () => {
  if (localStream.value) {
    const videoTrack = localStream.value.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      isVideoEnabled.value = videoTrack.enabled
    }
  }
}

const cleanup = () => {
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop())
  }
  if (peerConnection.value) {
    peerConnection.value.close()
  }
}

// Lifecycle
onMounted(() => {
  initializeWebRTC()
})

onUnmounted(() => {
  cleanup()
})
</script>
