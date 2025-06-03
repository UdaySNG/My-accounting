<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chatbot Button -->
    <button 
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full bg-slack-purple text-white shadow-lg hover:bg-slack-pink transition-colors duration-300 flex items-center justify-center relative"
    >
      <span v-if="!isOpen" class="material-icons text-2xl">chat</span>
      <span v-else class="material-icons text-2xl">close</span>
      
      <!-- Notification dot -->
      <div v-if="hasNewMessage" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
    </button>

    <!-- Chat Window -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div 
        v-if="isOpen"
        ref="chatWindow"
        class="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 origin-bottom-right"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Hulp nodig?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Stel je vraag of neem contact op</p>
        </div>

        <!-- Quick Actions -->
        <div class="p-4 space-y-2">
          <button 
            v-for="action in quickActions" 
            :key="action.id"
            @click="handleQuickAction(action.id)"
            class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="material-icons text-gray-600 dark:text-gray-300 mr-3">{{ action.icon }}</span>
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ action.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ action.description }}</div>
            </div>
          </button>
        </div>

        <!-- Contact Options -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Neem contact op</h4>
          <div class="space-y-2">
            <a 
              href="mailto:support@mijnbedrijf.nl"
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="material-icons text-gray-600 dark:text-gray-300 mr-3">email</span>
              <span class="text-sm text-gray-700 dark:text-gray-300">support@mijnbedrijf.nl</span>
            </a>
            <a 
              href="tel:+31201234567"
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="material-icons text-gray-600 dark:text-gray-300 mr-3">phone</span>
              <span class="text-sm text-gray-700 dark:text-gray-300">+31 20 123 4567</span>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const hasNewMessage = ref(false)
const chatWindow = ref<HTMLElement | null>(null)

// Handle outside click
const handleClickOutside = (event: MouseEvent) => {
  if (!chatWindow.value) return
  
  const target = event.target as Node
  if (!chatWindow.value.contains(target) && !(target as HTMLElement).closest('button')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const quickActions = [
  {
    id: 'appointment',
    icon: 'calendar_today',
    title: 'Afspraak Maken',
    description: 'Plan een afspraak met je boekhouder'
  },
  {
    id: 'help',
    icon: 'help_outline',
    title: 'Hulp nodig?',
    description: 'Bekijk onze handleidingen'
  },
  {
    id: 'invoice',
    icon: 'receipt_long',
    title: 'Facturen',
    description: 'Ga naar facturen overzicht'
  },
  {
    id: 'settings',
    icon: 'settings',
    title: 'Instellingen',
    description: 'Beheer je account'
  }
]

const handleQuickAction = (id: string) => {
  switch (id) {
    case 'appointment':
      router.push('/agenda')
      break
    case 'help':
      // Implementeer help navigatie
      break
    case 'invoice':
      router.push('/facturen')
      break
    case 'settings':
      router.push('/instellingen')
      break
  }
  isOpen.value = false
}
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}

/* Add transform origin for the popup animation */
.origin-bottom-right {
  transform-origin: bottom right;
}
</style> 