<template>
  <div>
    <button
      @click="isOpen = true"
      class="fixed top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-[100]"
      title="Changelog"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] overflow-y-auto"
        @click.self="isOpen = false"
      >
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="isOpen = false"></div>
        
        <div class="flex min-h-screen items-center justify-center p-4 relative">
          <div
            class="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 shadow-xl"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Changelog
                </h2>
                <button
                  @click="isOpen = false"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="space-y-4">
                <div
                  v-for="(log, index) in changelogs"
                  :key="index"
                  class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >{{ log.version }}</span
                    >
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                      log.date
                    }}</span>
                  </div>
                  <ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                    <li v-for="(change, changeIndex) in log.changes" :key="changeIndex">
                      {{ change }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Changelog {
  version: string
  date: string
  changes: string[]
}

const isOpen = ref(false)

const changelogs = ref<Changelog[]>([
  {
    version: 'v1.0.0',
    date: '2024-03-20',
    changes: [
      'Initial release of the platform',
      'Added user authentication',
      'Implemented dashboard',
      'Added basic accounting features'
    ]
  }
  // Add more changelogs as needed
])
</script> 