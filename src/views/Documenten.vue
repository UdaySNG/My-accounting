<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Documenten</h1>
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors flex items-center">
          <span class="material-icons mr-2">add</span>
          Nieuw Document
        </button>
      </div>
    </div>
    
    <!-- Navigation tabs -->
    <div class="mb-8">
      <nav class="flex space-x-8 border-b border-gray-200 dark:border-gray-700 relative">
        <div 
          class="absolute bottom-0 h-0.5 bg-slack-purple transition-all duration-300"
          :style="{
            width: `${tabWidths[currentView]}px`,
            left: `${tabPositions[currentView]}px`,
          }"
        ></div>
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentView = tab.id"
          class="py-4 px-1 border-b-2 font-medium text-sm"
          :class="currentView === tab.id ? 'border-transparent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          ref="tabRefs"
        >
          <span class="material-icons align-middle mr-2">{{ tab.icon }}</span>
          {{ tab.title }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="relative">
      <div 
        :key="currentView"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <!-- Documenten Overzicht -->
        <div v-if="currentView === 'documenten'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="material-icons text-blue-600 dark:text-blue-300">description</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Totaal Documenten</h3>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span class="material-icons text-green-600 dark:text-green-300">upload</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Geüpload Deze Maand</h3>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span class="material-icons text-purple-600 dark:text-purple-300">folder</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Categorieën</h3>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Uploaden -->
        <div v-if="currentView === 'uploaden'" class="space-y-6">
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <div class="space-y-4">
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">cloud_upload</span>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Sleep bestanden hierheen</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">of klik om te bladeren</p>
              </div>
              <button class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors">
                Bestanden Selecteren
              </button>
            </div>
          </div>
        </div>

        <!-- Archief -->
        <div v-if="currentView === 'archief'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Zoeken in archief..." 
                class="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent"
              >
              <span class="material-icons absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">search</span>
            </div>
            <div class="flex space-x-4">
              <select class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent">
                <option>Alle Categorieën</option>
                <option>Facturen</option>
                <option>Contracten</option>
                <option>Belastingen</option>
              </select>
              <select class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent">
                <option>Datum (nieuwste eerst)</option>
                <option>Datum (oudste eerst)</option>
                <option>Naam (A-Z)</option>
                <option>Naam (Z-A)</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Placeholder for archived documents -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">picture_as_pdf</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Factuur-2024-001.pdf</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">15 maart 2024</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <span class="material-icons text-sm">download</span>
                  </button>
                  <button class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                    <span class="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'

const currentView = ref('documenten')
const tabRefs = ref<HTMLElement[]>([])
const tabPositions = ref<Record<string, number>>({})
const tabWidths = ref<Record<string, number>>({})

const tabs = [
  { id: 'documenten', title: 'Documenten', icon: 'folder' },
  { id: 'uploaden', title: 'Uploaden', icon: 'upload' },
  { id: 'archief', title: 'Archief', icon: 'archive' }
]

// Calculate tab positions and widths when component mounts and when window resizes
onMounted(() => {
  updateTabDimensions()
  window.addEventListener('resize', updateTabDimensions)
})

// Update tab positions and widths when currentView changes
watch(currentView, () => {
  updateTabDimensions()
})

const updateTabDimensions = () => {
  if (tabRefs.value) {
    tabs.forEach((tab, index) => {
      const element = tabRefs.value[index]
      if (element) {
        tabPositions.value[tab.id] = element.offsetLeft
        tabWidths.value[tab.id] = element.offsetWidth
      }
    })
  }
}

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', updateTabDimensions)
})
</script>

<style scoped>
/* No additional styles needed */
</style> 