<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instellingen</h1>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div class="space-y-8">
        <!-- Profiel Sectie -->
        <div>
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Profiel</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrijfsnaam</label>
              <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" value="Mijn Bedrijf B.V.">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" value="info@mijnbedrijf.nl">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BTW Nummer</label>
              <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" value="NL123456789B01">
            </div>
          </div>
        </div>

        <!-- Weergave Sectie -->
        <div>
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weergave</h2>
          <div class="inline-flex border-2 border-gray-200 dark:border-gray-700 rounded-lg relative">
            <!-- Sliding indicator -->
            <div 
              class="absolute h-[calc(100%-4px)] top-0.5 bg-slack-purple rounded transition-all duration-300 ease-in-out"
              :class="{
                'w-[calc(33.333%-2px)] left-0.5': currentMode === 'light',
                'w-[calc(33.333%-2px)] left-[calc(33.333%+0.5px)]': currentMode === 'dark',
                'w-[calc(33.333%-2px)] left-[calc(66.666%+0.5px)]': currentMode === 'system'
              }"
            ></div>

            <!-- Light Mode -->
            <button 
              @click="setThemeMode('light')"
              class="relative px-4 py-0.5 rounded-l text-sm font-medium transition-colors duration-300 ease-in-out z-10"
              :class="currentMode === 'light' ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <span class="material-icons text-base">light_mode</span>
            </button>

            <div class="w-px bg-gray-200 dark:bg-gray-700 relative z-10"></div>

            <!-- Dark Mode -->
            <button 
              @click="setThemeMode('dark')"
              class="relative px-4 py-0.5 text-sm font-medium transition-colors duration-300 ease-in-out z-10"
              :class="currentMode === 'dark' ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <span class="material-icons text-base">dark_mode</span>
            </button>

            <div class="w-px bg-gray-200 dark:bg-gray-700 relative z-10"></div>

            <!-- System Mode -->
            <button 
              @click="setThemeMode('system')"
              class="relative px-4 py-0.5 rounded-r text-sm font-medium transition-colors duration-300 ease-in-out z-10"
              :class="currentMode === 'system' ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <span class="material-icons text-base">computer</span>
            </button>
          </div>
        </div>

        <!-- Taal Sectie -->
        <div>
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Taal</h2>
          <div class="relative">
            <select 
              v-model="language"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
            <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <!-- Notificaties Sectie -->
        <div>
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notificaties</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-gray-700 dark:text-gray-300">Email notificaties</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ontvang updates over nieuwe facturen en betalingen</p>
              </div>
              <button 
                @click="emailNotifications = !emailNotifications"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out"
                :class="emailNotifications ? 'bg-slack-purple' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out"
                  :class="emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span class="text-gray-700 dark:text-gray-300">Browser notificaties</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">Krijg meldingen in je browser</p>
              </div>
              <button 
                @click="browserNotifications = !browserNotifications"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out"
                :class="browserNotifications ? 'bg-slack-purple' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out"
                  :class="browserNotifications ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Algemene Voorkeuren -->
        <div>
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Algemene Voorkeuren</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-gray-700 dark:text-gray-300">Automatisch opslaan</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sla wijzigingen automatisch op</p>
              </div>
              <button 
                @click="autoSave = !autoSave"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out"
                :class="autoSave ? 'bg-slack-purple' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out"
                  :class="autoSave ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <span class="text-gray-700 dark:text-gray-300">Twee-factor authenticatie</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">Extra beveiliging voor je account</p>
              </div>
              <button 
                @click="twoFactor = !twoFactor"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out"
                :class="twoFactor ? 'bg-slack-purple' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out"
                  :class="twoFactor ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDarkMode } from '../composables/useDarkMode'
import { ref } from 'vue'

const { isDark, currentMode, setThemeMode } = useDarkMode()

// State voor verschillende instellingen
const language = ref('nl')
const emailNotifications = ref(true)
const browserNotifications = ref(false)
const autoSave = ref(true)
const twoFactor = ref(false)
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}

select {
  background-image: none;
}
</style> 