<template>
  <aside 
    class="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 relative"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex items-center justify-center h-16 px-4 border-b border-gray-100 dark:border-gray-800">
      <span 
        class="text-2xl font-bold text-slack-purple dark:text-white transition-opacity duration-300 whitespace-nowrap"
        :class="{ 'opacity-0 w-0': isCollapsed }"
      >
        {{ menuData.appName }}
      </span>
    </div>
    <nav class="flex-1 px-2 py-6 space-y-2 sidebar-scroll">
      <template v-for="item in menuData.menuItems" :key="item.id">
        <RouterLink 
          :to="getRoute(item.id)" 
          class="sidebar-link group" 
          active-class="sidebar-link-active"
          :title="isCollapsed ? item.title : ''"
          @click="handleRouteClick(item.id)"
        >
          <span class="material-icons flex-shrink-0">{{ item.icon }}</span>
          <span 
            class="transition-opacity duration-300 ml-3"
            :class="{ 'opacity-0 w-0': isCollapsed }"
          >
            {{ item.title }}
          </span>
        </RouterLink>
      </template>
    </nav>

    <div class="px-2 pb-6">
      <button 
        @click="handleLogout" 
        class="w-full flex items-center justify-center py-2 rounded-lg bg-slack-purple text-white font-semibold hover:bg-slack-pink transition-colors"
        :title="isCollapsed ? 'Uitloggen' : ''"
      >
        <span class="material-icons flex-shrink-0">logout</span>
        <span 
          class="transition-opacity duration-300 ml-2"
          :class="{ 'opacity-0 w-0': isCollapsed }"
        >
          Uitloggen
        </span>
      </button>
    </div>

    <button 
      @click="toggleSidebar" 
      class="absolute -right-3 top-8 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center shadow-sm"
    >
      <span class="material-icons text-gray-700 dark:text-gray-200 leading-none transition-transform duration-300 text-sm"
        :class="{ 'rotate-180': isCollapsed }"
      >
        chevron_left
      </span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue'
import menuData from '../data/menu.json'

const isCollapsed = ref(false)
const route = useRoute()

const handleRouteClick = (id: string) => {
  console.log('SIDEBAR: Route clicked:', id)
  const route = getRoute(id)
  console.log('SIDEBAR: Navigating to route:', route)
}

const getRoute = (id: string): string => {
  console.log('SIDEBAR: getRoute called with id:', id)
  switch (id) {
    case 'dashboard': return '/dashboard'
    case 'documenten': return '/documenten'
    case 'berichten': return '/berichten'
    case 'boekhouder': return '/mijn-boekhouder'
    case 'rapportages': return '/rapportages'
    case 'instellingen': return '/instellingen'
    case 'help': return '/help'
    case 'agenda': return '/agenda'
    default: return '/'
  }
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = () => {
  // Implement logout logic here
  console.log('Logging out...')
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium;
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}
.sidebar-link:focus {
  @apply outline-none ring-0;
}
.sidebar-link:focus-visible {
  @apply ring-2 ring-slack-purple ring-offset-2 dark:ring-offset-gray-900;
}
.sidebar-link-active {
  @apply bg-slack-purple text-white dark:bg-slack-purple;
}

/* Tooltip styles for collapsed state */
.group:hover::after {
  @apply content-[attr(title)] absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 transition-opacity duration-200;
}
.group:hover::after {
  @apply opacity-100;
}

.sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE en Edge */
  scrollbar-width: none;     /* Firefox */
}
.sidebar-scroll::-webkit-scrollbar {
  display: none;
}
</style> 