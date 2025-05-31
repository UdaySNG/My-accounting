<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <nav class="bg-white dark:bg-slack-black border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <RouterLink to="/" class="text-xl font-bold text-slack-purple dark:text-white hover:opacity-90 transition-opacity">
          MyAccounting
        </RouterLink>
        
        <div class="flex items-center space-x-6">
          <button 
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-opacity-10 dark:hover:bg-white transition-colors"
            aria-label="Toggle theme"
          >
            <span v-if="isDark" class="text-white text-lg">🌞</span>
            <span v-else class="text-slack-black text-lg">🌙</span>
          </button>
          <RouterLink 
            to="/dashboard" 
            class="nav-link"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/login" 
            class="btn btn-primary"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template> 