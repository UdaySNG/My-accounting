<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Openstaande facturen</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">€12.450,00</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="material-icons text-red-600 dark:text-red-400">receipt_long</span>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-600 dark:text-red-400 flex items-center">
            <span class="material-icons text-sm mr-1">arrow_upward</span>
            3 nieuwe
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Binnenkomende facturen</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">€8.320,00</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="material-icons text-green-600 dark:text-green-400">payments</span>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400 flex items-center">
            <span class="material-icons text-sm mr-1">arrow_downward</span>
            2 nieuwe
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">BTW te vorderen</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">€2.450,00</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="material-icons text-blue-600 dark:text-blue-400">account_balance</span>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-blue-600 dark:text-blue-400">Volgende aangifte: 31/03</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Kasstroom</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">€4.130,00</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="material-icons text-purple-600 dark:text-purple-400">trending_up</span>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400 flex items-center">
            <span class="material-icons text-sm mr-1">arrow_upward</span>
            +12% deze maand
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Upcoming Deadlines -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Aankomende deadlines</h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="deadline in deadlines" :key="deadline.id" class="p-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-red-100 dark:bg-red-900/30': deadline.priority === 'high',
                      'bg-yellow-100 dark:bg-yellow-900/30': deadline.priority === 'medium',
                      'bg-blue-100 dark:bg-blue-900/30': deadline.priority === 'low'
                    }"
                  >
                    <span class="material-icons"
                      :class="{
                        'text-red-600 dark:text-red-400': deadline.priority === 'high',
                        'text-yellow-600 dark:text-yellow-400': deadline.priority === 'medium',
                        'text-blue-600 dark:text-blue-400': deadline.priority === 'low'
                      }"
                    >{{ deadline.icon }}</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ deadline.title }}</h3>
                    <span class="text-xs px-2 py-1 rounded-full"
                      :class="{
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300': deadline.priority === 'high',
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300': deadline.priority === 'medium',
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300': deadline.priority === 'low'
                      }"
                    >{{ deadline.daysLeft }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ deadline.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Messages -->
      <div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recente berichten</h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="message in recentMessages" :key="message.id" class="p-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span class="material-icons text-gray-600 dark:text-gray-300">{{ message.icon }}</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.title }}</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ message.time }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <a href="/berichten" class="text-sm text-slack-purple hover:text-slack-pink flex items-center">
              Bekijk alle berichten
              <span class="material-icons text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const deadlines = ref([
  {
    id: 1,
    title: 'BTW Aangifte Q1',
    description: 'Deadline voor het indienen van de BTW aangifte over het eerste kwartaal',
    daysLeft: '14 dagen',
    priority: 'high',
    icon: 'account_balance'
  },
  {
    id: 2,
    title: 'Jaarrekening 2023',
    description: 'Deadline voor het indienen van de jaarrekening bij de Kamer van Koophandel',
    daysLeft: '45 dagen',
    priority: 'medium',
    icon: 'description'
  },
  {
    id: 3,
    title: 'Inkomstenbelasting',
    description: 'Deadline voor het indienen van de aangifte inkomstenbelasting',
    daysLeft: '60 dagen',
    priority: 'medium',
    icon: 'payments'
  }
])

const recentMessages = ref([
  {
    id: 1,
    title: 'Boekhouder',
    content: 'Uw jaarrekening is goedgekeurd. U kunt deze nu downloaden in het dashboard.',
    time: '2 uur geleden',
    icon: 'account_balance'
  },
  {
    id: 2,
    title: 'Systeem',
    content: 'Nieuwe factuur ontvangen van Microsoft B.V. voor €299,00.',
    time: '1 dag geleden',
    icon: 'receipt_long'
  },
  {
    id: 3,
    title: 'Systeem',
    content: 'Uw maandelijkse rapport is beschikbaar. Bekijk hier uw financiële overzicht.',
    time: '2 dagen geleden',
    icon: 'analytics'
  }
])
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 