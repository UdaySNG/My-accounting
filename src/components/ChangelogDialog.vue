<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with blur effect -->
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeDialog"></div>
    
    <!-- Dialog -->
    <div ref="dialogRef" class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl mx-4">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Changelog</h2>
        <button @click="closeDialog" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="max-h-[60vh] overflow-y-auto p-4">
        <div class="space-y-6">
          <div v-for="(changelog, index) in changelogs" :key="index" class="relative">
            <!-- Version header -->
            <div class="flex items-center justify-between cursor-pointer" @click="toggleVersion(index)">
              <div class="flex items-center">
                <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">v{{ changelog.version }}</span>
                </div>
                <div class="ml-3">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ changelog.version }}</h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ changelog.date }}</span>
                </div>
              </div>
              <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg 
                  class="w-5 h-5 transform transition-transform duration-200"
                  :class="{ 'rotate-180': expandedVersions[index] }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Changes -->
            <transition
              enter-active-class="transition-all duration-600 ease-out-quart"
              enter-from-class="max-h-0"
              enter-to-class="max-h-[500px]"
              leave-active-class="transition-all duration-600 ease-in-quart"
              leave-from-class="max-h-[500px]"
              leave-to-class="max-h-0"
            >
              <div 
                v-if="expandedVersions[index]"
                class="ml-4 mt-3 space-y-4"
              >
                <!-- Features -->
                <div v-if="changelog.features?.length" class="relative">
                  <div class="flex items-center mb-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <h4 class="ml-2 text-xs font-medium text-green-600 dark:text-green-400">Nieuwe Features</h4>
                  </div>
                  <ul class="space-y-1">
                    <li v-for="(feature, fIndex) in changelog.features" :key="fIndex" 
                        class="flex items-start">
                      <div class="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-green-500"></div>
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Fixes -->
                <div v-if="changelog.fixes?.length" class="relative">
                  <div class="flex items-center mb-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <h4 class="ml-2 text-xs font-medium text-red-600 dark:text-red-400">Bug Fixes</h4>
                  </div>
                  <ul class="space-y-1">
                    <li v-for="(fix, fIndex) in changelog.fixes" :key="fIndex" 
                        class="flex items-start">
                      <div class="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-red-500"></div>
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">{{ fix }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Improvements -->
                <div v-if="changelog.improvements?.length" class="relative">
                  <div class="flex items-center mb-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h4 class="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400">Verbeteringen</h4>
                  </div>
                  <ul class="space-y-1">
                    <li v-for="(improvement, iIndex) in changelog.improvements" :key="iIndex" 
                        class="flex items-start">
                      <div class="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500"></div>
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">{{ improvement }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>

            <!-- Vertical line between versions -->
            <div v-if="index < changelogs.length - 1" 
                 class="absolute left-3.5 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Changelog {
  version: string
  date: string
  features?: string[]
  fixes?: string[]
  improvements?: string[]
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const dialogRef = ref<HTMLElement | null>(null)
const expandedVersions = ref<boolean[]>([])

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Expand only the latest version by default
    expandedVersions.value = changelogs.value.map((_, index) => index === 0)
  }
})

const changelogs = ref<Changelog[]>([
  {
    version: '1.1.0',
    date: '2024-03-21',
    features: [
      'Toegevoegd: Changelog dialog met versiegeschiedenis',
      'Toegevoegd: Dark mode ondersteuning',
      'Toegevoegd: Verbeterde navigatie met breadcrumbs'
    ],
    improvements: [
      'Verbeterde laadtijd van het dashboard',
      'Geoptimaliseerde database queries',
      'Verbeterde mobiele weergave'
    ]
  },
  {
    version: '1.0.1',
    date: '2024-03-20',
    fixes: [
      'Opgelost: Probleem met factuur generatie',
      'Opgelost: BTW berekening in rapportages',
      'Opgelost: Login probleem op mobiele apparaten'
    ],
    improvements: [
      'Verbeterde foutmeldingen',
      'Toegevoegde validatie voor factuurgegevens'
    ]
  },
  {
    version: '1.0.0',
    date: '2024-03-19',
    features: [
      'Eerste release van het platform',
      'Dashboard met key metrics',
      'Document management systeem',
      'Berichtensysteem',
      'BTW berekeningen en rapportages'
    ]
  }
])

const toggleVersion = (index: number) => {
  expandedVersions.value[index] = !expandedVersions.value[index]
}

const closeDialog = () => {
  emit('update:isOpen', false)
}

// Handle outside click
const handleClickOutside = (event: MouseEvent) => {
  if (!dialogRef.value) return
  
  const target = event.target as Node
  if (!dialogRef.value.contains(target)) {
    closeDialog()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  // Initialize expanded state
  expandedVersions.value = changelogs.value.map((_, index) => index === 0)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.max-h-0 {
  overflow: hidden;
}

.max-h-\[500px\] {
  overflow: visible;
}

/* Add transition classes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-600 {
  transition-duration: 600ms;
}

/* Smoother easing curves */
.ease-in-quart {
  transition-timing-function: cubic-bezier(0.5, 0, 0.75, 0);
}

.ease-out-quart {
  transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
}
</style> 