<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">VoiceOver</h1>
        <p class="text-gray-600">Введите ваш никнейм для входа</p>
      </div>
      
      <form @submit.prevent="joinRoom" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Никнейм
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Введите ваш никнейм"
            :disabled="isConnecting"
          />
        </div>
        
        <button
          type="submit"
          :disabled="!username.trim() || isConnecting"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span v-if="isConnecting">Подключение...</span>
          <span v-else>Войти в комнату</span>
        </button>
      </form>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
const username = ref('')
const isConnecting = ref(false)
const error = ref('')

const router = useRouter()

const joinRoom = async () => {
  if (!username.value.trim()) return
  
  isConnecting.value = true
  error.value = ''
  
  try {
    // Сохраняем никнейм в localStorage
    localStorage.setItem('username', username.value.trim())
    
    // Переходим на страницу комнаты
    await router.push('/room')
  } catch (err) {
    error.value = 'Ошибка при подключении. Попробуйте еще раз.'
    console.error('Join room error:', err)
  } finally {
    isConnecting.value = false
  }
}

// Проверяем, есть ли сохраненный никнейм
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  if (savedUsername) {
    username.value = savedUsername
  }
})
</script>

<style>
/* Дополнительные стили если нужно */
</style>
