<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Documenten</h1>
      <div class="flex items-center space-x-4">
        <button 
          v-if="currentView === 'documenten'"
          @click="currentView = 'uploaden'"
          class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors flex items-center"
        >
          <span class="material-icons mr-2">add</span>
          Nieuw Document
        </button>
      </div>
    </div>
    
    <!-- Navigation tabs with search -->
    <div class="mb-8">
      <div class="flex items-center justify-between border-b-[0.5px] border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-8 relative flex-grow">
          <div 
            class="absolute bottom-[-1px] h-0.5 bg-slack-purple transition-all duration-300 z-10"
            :style="{
              width: isSearchFocused ? `${searchTabWidth}px` : `${tabWidths[currentView]}px`,
              left: isSearchFocused ? `${searchTabPosition}px` : `${tabPositions[currentView]}px`,
            }"
          ></div>
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentView = tab.id"
            class="py-4 px-1 font-medium text-sm flex items-center"
            :class="currentView === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            ref="tabRefs"
          >
            <span class="material-icons align-middle mr-2">{{ tab.icon }}</span>
            {{ tab.title }}
            <span 
              v-if="tab.id === 'documenten'"
              class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {{ documents.length }}
            </span>
            <span 
              v-if="tab.id === 'archief'"
              class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {{ archivedDocuments.length }}
            </span>
          </button>
        </nav>
        
        <!-- Search and Filter -->
        <div class="flex items-center space-x-4 ml-4" ref="searchTabRef">
          <div class="relative flex items-center h-full">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Zoeken..." 
              class="h-full px-4 py-4 pl-10 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
            >
            <span class="material-icons absolute left-3 text-gray-400 dark:text-gray-500">search</span>
          </div>
          <button 
            @click="showFilters = !showFilters"
            class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-full flex items-center transition-colors duration-200"
          >
            <span class="material-icons">filter_list</span>
          </button>
        </div>
      </div>

      <!-- Filter Panel -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="showFilters"
          class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- File Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bestandstype
              </label>
              <select 
                v-model="selectedFileType"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent"
              >
                <option value="">Alle types</option>
                <option v-for="type in fileTypes" :key="type" :value="type">
                  {{ type.toUpperCase() }}
                </option>
              </select>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Datum Van
              </label>
              <input 
                type="date" 
                v-model="dateRange.start"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Datum Tot
              </label>
              <input 
                type="date" 
                v-model="dateRange.end"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent"
              >
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="mt-4 flex justify-end space-x-4">
            <button 
              @click="resetFilters"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Reset
            </button>
            <button 
              @click="showFilters = false"
              class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors"
            >
              Toepassen
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
      {{ error }}
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
      {{ successMessage }}
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slack-purple"></div>
    </div>

    <!-- Content -->
    <div v-else class="relative">
      <!-- View Toggle -->
      <div class="flex justify-end mb-2">
        <div class="inline-flex items-center space-x-1">
          <button 
            @click="viewMode = 'grid'"
            class="px-2 py-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 flex items-center space-x-1"
            :class="{ 'text-slack-purple dark:text-slack-purple': viewMode === 'grid' }"
          >
            <span class="material-icons text-sm">grid_view</span>
            <span class="text-sm">Grid</span>
          </button>
          <button 
            @click="viewMode = 'list'"
            class="px-2 py-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 flex items-center space-x-1"
            :class="{ 'text-slack-purple dark:text-slack-purple': viewMode === 'list' }"
          >
            <span class="material-icons text-sm">view_list</span>
            <span class="text-sm">Lijst</span>
          </button>
        </div>
      </div>

      <div 
        :key="currentView"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out"
        :class="{ 'mt-4': showFilters }"
      >
        <!-- Documenten Overzicht -->
        <div v-if="currentView === 'documenten'" class="space-y-6">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="doc in filteredDocuments" 
              :key="doc.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">description</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.original_filename }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ new Date(doc.uploadedAt).toLocaleDateString('nl-NL') }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(doc.size) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <a 
                    :href="doc.url" 
                    target="_blank"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">download</span>
                  </a>
                  <button 
                    @click="handleArchive(doc.id)"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">archive</span>
                  </button>
                  <button 
                    @click="handleDelete(doc.id)"
                    class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="space-y-2">
            <div 
              v-for="doc in filteredDocuments" 
              :key="doc.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">description</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.original_filename }}</h3>
                    <div class="flex items-center space-x-4 mt-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ new Date(doc.uploadedAt).toLocaleDateString('nl-NL') }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(doc.size) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <a 
                    :href="doc.url" 
                    target="_blank"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">download</span>
                  </a>
                  <button 
                    @click="handleArchive(doc.id)"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">archive</span>
                  </button>
                  <button 
                    @click="handleDelete(doc.id)"
                    class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Uploaden -->
        <div v-if="currentView === 'uploaden'" class="space-y-6">
          <div 
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center"
            @dragover.prevent
            @drop.prevent="handleFileUpload($event)"
          >
            <div class="space-y-4">
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">cloud_upload</span>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Sleep bestanden hierheen</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">of klik om te bladeren</p>
              </div>
              <input 
                type="file" 
                class="hidden" 
                ref="fileInput"
                @change="handleFileUpload"
              >
              <button 
                @click="fileInput?.click()"
                class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors"
              >
                Bestanden Selecteren
              </button>
            </div>
          </div>
        </div>

        <!-- Archief -->
        <div v-if="currentView === 'archief'" class="space-y-6">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="doc in filteredArchivedDocuments" 
              :key="doc.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">description</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.original_filename }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Gearchiveerd op {{ new Date(doc.archivedAt || '').toLocaleDateString('nl-NL') }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(doc.size) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <a 
                    :href="doc.url" 
                    target="_blank"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">download</span>
                  </a>
                  <button 
                    @click="handleUnarchive(doc.id)"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">unarchive</span>
                  </button>
                  <button 
                    @click="handleDelete(doc.id)"
                    class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="space-y-2">
            <div 
              v-for="doc in filteredArchivedDocuments" 
              :key="doc.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">description</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.original_filename }}</h3>
                    <div class="flex items-center space-x-4 mt-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Gearchiveerd op {{ new Date(doc.archivedAt || '').toLocaleDateString('nl-NL') }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(doc.size) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <a 
                    :href="doc.url" 
                    target="_blank"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">download</span>
                  </a>
                  <button 
                    @click="handleUnarchive(doc.id)"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">unarchive</span>
                  </button>
                  <button 
                    @click="handleDelete(doc.id)"
                    class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <span class="material-icons text-xl">delete</span>
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
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { documentService, DocumentUploadResponse } from '../services/documentService'

const currentView = ref('documenten')
const viewMode = ref<'grid' | 'list'>('grid')
const tabRefs = ref<HTMLElement[]>([])
const tabPositions = ref<Record<string, number>>({})
const tabWidths = ref<Record<string, number>>({})
const documents = ref<DocumentUploadResponse[]>([])
const archivedDocuments = ref<DocumentUploadResponse[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const selectedFileType = ref<string>('')
const dateRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const showFilters = ref(false)
const isSearchFocused = ref(false)
const searchTabWidth = ref(0)
const searchTabPosition = ref(0)
const searchTabRef = ref<HTMLElement | null>(null)

const tabs = [
  { id: 'documenten', title: 'Documenten', icon: 'folder' },
  { id: 'uploaden', title: 'Uploaden', icon: 'upload' },
  { id: 'archief', title: 'Archief', icon: 'archive' }
]

// Add computed property for formatting file size
const formatFileSize = (size: number): string => {
  return `${(size / 1024).toFixed(1)} KB`
}

// Load documents based on current view
const loadDocuments = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Always load both lists to keep counts accurate
    const [allDocs, archivedDocs] = await Promise.all([
      documentService.getDocuments(),
      documentService.getArchivedDocuments()
    ])
    
    documents.value = allDocs
    archivedDocuments.value = archivedDocs
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het laden van de documenten'
    console.error('Error loading documents:', err)
  } finally {
    isLoading.value = false
  }
}

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  isLoading.value = true
  error.value = null
  successMessage.value = null

  try {
    const result = await documentService.uploadDocument(file)
    successMessage.value = result.message
    await loadDocuments()
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    // Switch back to documents view after successful upload
    currentView.value = 'documenten'
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het uploaden van het document'
    console.error('Error uploading document:', err)
  } finally {
    isLoading.value = false
  }
}

// Handle document archive
const handleArchive = async (documentId: number) => {
  try {
    await documentService.archiveDocument(documentId.toString())
    await loadDocuments() // This will now update both lists
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het archiveren van het document'
    console.error('Error archiving document:', err)
  }
}

// Handle document unarchive
const handleUnarchive = async (documentId: number) => {
  try {
    await documentService.unarchiveDocument(documentId.toString())
    await loadDocuments() // This will now update both lists
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het uit het archief halen van het document'
    console.error('Error unarchiving document:', err)
  }
}

// Handle document delete
const handleDelete = async (documentId: number) => {
  if (!confirm('Weet je zeker dat je dit document wilt verwijderen?')) return

  try {
    await documentService.deleteDocument(documentId.toString())
    await loadDocuments() // This will now update both lists
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het verwijderen van het document'
    console.error('Error deleting document:', err)
  }
}

// Calculate tab positions and widths when component mounts and when window resizes
onMounted(() => {
  updateTabDimensions()
  window.addEventListener('resize', updateTabDimensions)
  loadDocuments()
})

// Update tab positions and widths when currentView changes
watch(currentView, () => {
  updateTabDimensions()
  loadDocuments()
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
  // Update search tab dimensions
  if (searchTabRef.value) {
    const searchContainer = searchTabRef.value
    const navContainer = searchContainer.closest('.flex.items-center.justify-between')
    if (navContainer) {
      const navRect = navContainer.getBoundingClientRect()
      const searchRect = searchContainer.getBoundingClientRect()
      searchTabWidth.value = searchRect.width
      searchTabPosition.value = searchRect.left - navRect.left
    }
  }
}

// Watch for search focus changes
watch(isSearchFocused, () => {
  if (isSearchFocused.value) {
    updateTabDimensions()
  }
})

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', updateTabDimensions)
})

// Computed properties for filtering
const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.original_filename.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFileType = !selectedFileType.value || doc.mime_type.includes(selectedFileType.value)
    const matchesDateRange = (!dateRange.value.start || new Date(doc.uploadedAt) >= new Date(dateRange.value.start)) &&
                           (!dateRange.value.end || new Date(doc.uploadedAt) <= new Date(dateRange.value.end))
    return matchesSearch && matchesFileType && matchesDateRange
  })
})

const filteredArchivedDocuments = computed(() => {
  return archivedDocuments.value.filter(doc => {
    const matchesSearch = doc.original_filename.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFileType = !selectedFileType.value || doc.mime_type.includes(selectedFileType.value)
    const matchesDateRange = (!dateRange.value.start || new Date(doc.uploadedAt) >= new Date(dateRange.value.start)) &&
                           (!dateRange.value.end || new Date(doc.uploadedAt) <= new Date(dateRange.value.end))
    return matchesSearch && matchesFileType && matchesDateRange
  })
})

// Get unique file types from documents
const fileTypes = computed(() => {
  const types = new Set<string>()
  documents.value.forEach(doc => {
    const type = doc.mime_type.split('/')[1]
    if (type) types.add(type)
  })
  return Array.from(types)
})

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedFileType.value = ''
  dateRange.value = { start: '', end: '' }
}
</script>

<style scoped>
input:focus + .material-icons {
  color: theme('colors.slack-purple');
}
</style> 