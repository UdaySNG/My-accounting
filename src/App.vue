<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex w-full">
      <Sidebar v-if="showSidebar" class="flex-shrink-0 z-40" />
      <main class="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 z-0">
        <router-view />
      </main>
    </div>
    <ChatbotButton v-if="showSidebar" />
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import ChatbotButton from './components/ChatbotButton.vue'

const route = useRoute()

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})

const showSidebar = computed(() => {
  const publicRoutes = ['/login', '/register', '/forgot-password']
  return isAuthenticated.value && !publicRoutes.includes(route.path)
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
