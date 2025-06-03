<template>
  <div class="w-full">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          @click="toggleChangelog"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
      </div>

      <ChangelogDialog v-model:isOpen="showChangelog" />

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
            <div class="w-12 h-12 rounded-full bg-slack-purple/10 dark:bg-slack-purple/30 flex items-center justify-center">
              <span class="material-icons text-slack-purple dark:text-slack-purple">account_balance</span>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-slack-purple dark:text-slack-purple">Volgende aangifte: 31/03</span>
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
        <!-- Upcoming Appointments -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Aankomende afspraken</h2>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <template v-if="groupedAppointments.length > 0">
                <template v-for="item in groupedAppointments" :key="item.isMonthHeader ? item.month : item.id">
                  <!-- Month Header -->
                  <div v-if="item.isMonthHeader" class="p-4 bg-gray-50 dark:bg-gray-700/50">
                    <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.month }}</h5>
                  </div>
                  
                  <!-- Appointment Card -->
                  <div v-else class="p-6">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                          :class="{
                            'bg-slack-purple/10 dark:bg-slack-purple/30': item.type === 'meeting',
                            'bg-green-100 dark:bg-green-900/30': item.type === 'call',
                            'bg-purple-100 dark:bg-purple-900/30': item.type === 'other'
                          }"
                        >
                          <span class="material-icons"
                            :class="{
                              'text-slack-purple dark:text-slack-purple': item.type === 'meeting',
                              'text-green-600 dark:text-green-400': item.type === 'call',
                              'text-purple-600 dark:text-purple-400': item.type === 'other'
                            }"
                          >{{ getAppointmentIcon(item.type) }}</span>
                        </div>
                      </div>
                      <div class="ml-4 flex-1">
                        <div class="flex items-center justify-between">
                          <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</h3>
                          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(item.start_time) }}</span>
                        </div>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ item.description }}</p>
                        <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span class="material-icons text-sm mr-1">schedule</span>
                          {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }}
                          <span v-if="item.location" class="ml-4 flex items-center">
                            <span class="material-icons text-sm mr-1">location_on</span>
                            {{ item.location }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400">
                Geen aankomende afspraken
              </div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <router-link to="/agenda" class="text-sm text-slack-purple hover:text-slack-pink flex items-center">
                Bekijk alle afspraken
                <span class="material-icons text-sm ml-1">arrow_forward</span>
              </router-link>
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
              <div v-for="message in messages" :key="message.id" class="p-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span class="material-icons text-gray-600 dark:text-gray-300">mail</span>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.title }}</h3>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(message.created_at) }}</span>
                    </div>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ message.content }}</p>
                    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Van: {{ message.sender }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <router-link to="/berichten" class="text-sm text-slack-purple hover:text-slack-pink flex items-center">
                Bekijk alle berichten
                <span class="material-icons text-sm ml-1">arrow_forward</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ChangelogDialog from '../components/ChangelogDialog.vue'
import { messagesService, type Message } from '../services/messages'
import { appointmentsService, type Appointment } from '../services/appointments'

const showChangelog = ref(false)
const messages = ref<Message[]>([])
const appointments = ref<Appointment[]>([])
let refreshInterval: number | null = null

// Group appointments by month
const groupedAppointments = computed(() => {
  const now = new Date()
  // Get all future appointments
  const futureAppointments = appointments.value
    .filter(a => a && a.start_time && new Date(a.start_time) >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  
  // Group appointments by month
  const appointmentsByMonth = futureAppointments.reduce((acc, appointment) => {
    const date = new Date(appointment.start_time)
    const month = date.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(appointment)
    return acc
  }, {} as Record<string, Appointment[]>)

  // Flatten the groups back into an array
  return Object.entries(appointmentsByMonth)
    .flatMap(([month, appointments]) => [
      { isMonthHeader: true, month } as any,
      ...appointments
    ])
})

const toggleChangelog = () => {
  showChangelog.value = true
}

const getAppointmentIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return 'groups'
    case 'call':
      return 'call'
    default:
      return 'event'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'zojuist'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuten geleden`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} uur geleden`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} dagen geleden`
  }

  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long'
  })
}

const fetchData = async () => {
  try {
    const [messagesData, appointmentsData] = await Promise.all([
      messagesService.getRecentMessages(),
      appointmentsService.getUpcomingAppointments()
    ])
    console.log('Fetched appointments:', appointmentsData)
    messages.value = messagesData
    appointments.value = appointmentsData.filter(appointment => 
      appointment && 
      appointment.id && 
      appointment.title && 
      appointment.start_time && 
      appointment.end_time
    )
    console.log('Filtered appointments:', appointments.value)
    console.log('Grouped appointments:', groupedAppointments.value)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchData()
  // Refresh data every minute
  refreshInterval = window.setInterval(fetchData, 60000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 