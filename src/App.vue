<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex h-screen">
      <Sidebar />
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
    <ChatbotButton />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { RouterView } from 'vue-router'
import ChatbotButton from './components/ChatbotButton.vue'
</script>

<style>
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
