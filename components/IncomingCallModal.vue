<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <div class="text-center">
        <!-- Avatar -->
        <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-white">{{ caller.username.charAt(0).toUpperCase() }}</span>
        </div>
        
        <!-- Caller Info -->
        <h2 class="text-xl font-bold text-gray-800 mb-2">Входящий звонок</h2>
        <p class="text-gray-600 mb-6">{{ caller.username }} хочет начать видеозвонок</p>
        
        <!-- Controls -->
        <div class="flex justify-center space-x-4">
          <button
            @click="$emit('decline')"
            class="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <button
            @click="$emit('accept')"
            class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  caller: {
    type: Object,
    required: true
  }
})

defineEmits(['accept', 'decline'])
</script>
