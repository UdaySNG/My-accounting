<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Instellingen</h1>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slack-purple"></div>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Navigation -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <nav class="space-y-1">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="changeSection(section.id)"
              class="w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors"
              :class="activeSection === section.id ? 'bg-slack-purple text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <span class="material-icons mr-3">{{ section.icon }}</span>
              {{ section.title }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="lg:col-span-2">
        <!-- Profile Settings -->
        <div v-if="activeSection === 'profile'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Profiel</h2>
            <button 
              @click="toggleEditing()"
              class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors flex items-center"
            >
              <span class="material-icons mr-2">{{ isEditing ? 'check' : 'edit' }}</span>
              {{ isEditing ? 'Opslaan' : 'Bewerken' }}
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Naam <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                v-model="profile.name" 
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                v-model="profile.email" 
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefoonnummer
              </label>
              <PhoneNumberInput
                v-model="profile.phone"
                placeholder="Telefoonnummer (of +31...)"
                defaultCountry="NL"
                @valid="(isValid) => phoneValid = isValid"
                :disabled="!isEditing"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bedrijfsnaam
              </label>
              <input 
                type="text" 
                v-model="profile.company" 
                :disabled="!isEditing"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeSection === 'notifications'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Notificaties</h2>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Email notificaties</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ontvang updates via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.email" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Push notificaties</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ontvang meldingen in de browser</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.push" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Herinneringen</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Herinneringen voor afspraken en deadlines</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.reminders" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div v-if="activeSection === 'appearance'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Weergave</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thema</label>
              <select v-model="appearance.theme" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="system">Systeem standaard</option>
                <option value="light">Licht</option>
                <option value="dark">Donker</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taal</label>
              <select v-model="appearance.language" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tijdzone</label>
              <select v-model="appearance.timezone" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Europe/Amsterdam">Amsterdam (GMT+1)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (GMT-5)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div v-if="activeSection === 'security'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Beveiliging</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Huidig wachtwoord</label>
              <input type="password" v-model="security.currentPassword" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nieuw wachtwoord</label>
              <input type="password" v-model="security.newPassword" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bevestig nieuw wachtwoord</label>
              <input type="password" v-model="security.confirmPassword" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Twee-factor authenticatie</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Extra beveiliging voor je account</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="security.twoFactor" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Fiscal Settings -->
        <div v-if="activeSection === 'fiscal'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Fiscale Instellingen</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Boekjaar <span class="text-red-500">*</span>
              </label>
              <select v-model="fiscal.fiscalYear" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="calendar">Kalenderjaar (1 jan - 31 dec)</option>
                <option value="fiscal">Fiscaal jaar (1 mei - 30 apr)</option>
                <option value="custom">Aangepast</option>
              </select>
            </div>
            <div v-if="fiscal.fiscalYear === 'custom'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Startdatum boekjaar <span class="text-red-500">*</span>
              </label>
              <input type="date" v-model="fiscal.fiscalYearStart" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BTW nummer <span class="text-red-500">*</span>
              </label>
              <input type="text" v-model="fiscal.vatNumber" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                KVK nummer <span class="text-red-500">*</span>
              </label>
              <input type="text" v-model="fiscal.kvkNumber" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BTW aangifte frequentie <span class="text-red-500">*</span>
              </label>
              <select v-model="fiscal.vatFrequency" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="monthly">Maandelijks</option>
                <option value="quarterly">Per kwartaal</option>
                <option value="yearly">Jaarlijks</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Invoice Settings -->
        <div v-if="activeSection === 'invoice'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Facturatie Instellingen</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Factuur nummering <span class="text-red-500">*</span>
              </label>
              <select v-model="invoice.numbering" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="yearly">Per jaar (2024-001)</option>
                <option value="continuous">Doorlopend (0001)</option>
                <option value="custom">Aangepast formaat</option>
              </select>
            </div>
            <div v-if="invoice.numbering === 'custom'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aangepast formaat <span class="text-red-500">*</span>
              </label>
              <input type="text" v-model="invoice.customFormat" placeholder="Bijv: INV-{YYYY}-{NNNN}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Betaaltermijn (dagen) <span class="text-red-500">*</span>
              </label>
              <input type="number" v-model="invoice.paymentTerm" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Factuur template
              </label>
              <select v-model="invoice.template" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="default">Standaard template</option>
                <option value="modern">Modern design</option>
                <option value="minimal">Minimaal design</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Automatische herinneringen</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Stuur automatisch herinneringen voor openstaande facturen</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="invoice.autoReminders" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Backup Settings -->
        <div v-if="activeSection === 'backup'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Backup Instellingen</h2>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Automatische backups</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Maak dagelijks een backup van je gegevens</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="backup.autoBackup" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
            <div v-if="backup.autoBackup">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Backup frequentie
              </label>
              <select v-model="backup.frequency" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="daily">Dagelijks</option>
                <option value="weekly">Wekelijks</option>
                <option value="monthly">Maandelijks</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Backup notificaties</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ontvang een bevestiging na elke backup</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="backup.notifications" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slack-purple/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slack-purple"></div>
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bewaarperiode backups
              </label>
              <select v-model="backup.retention" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="30">30 dagen</option>
                <option value="90">90 dagen</option>
                <option value="365">1 jaar</option>
                <option value="custom">Aangepast</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Integrations -->
        <div v-if="activeSection === 'integrations'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">Integraties</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex items-center space-x-4">
                <span class="material-icons text-gray-600 dark:text-gray-400">account_balance</span>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Exact Online</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Synchroniseer met je boekhouding</p>
                </div>
              </div>
              <button class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors">
                Verbinden
              </button>
            </div>
            <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex items-center space-x-4">
                <span class="material-icons text-gray-600 dark:text-gray-400">payments</span>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Mollie</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Online betalingen verwerken</p>
                </div>
              </div>
              <button class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors">
                Verbinden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationDialog
      v-model="showConfirmDialog"
      :title="confirmDialogConfig.title"
      :message="confirmDialogConfig.message"
      :confirm-text="confirmDialogConfig.confirmText"
      @confirm="confirmDialogConfig.onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { 
  getProfileSettings, 
  updateProfileSettings,
  getFiscalSettings,
  updateFiscalSettings,
  getInvoiceSettings,
  updateInvoiceSettings,
  getBackupSettings,
  updateBackupSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  updatePassword,
  updateTwoFactor,
  type ProfileSettings,
  type FiscalSettings,
  type InvoiceSettings,
  type BackupSettings,
  type NotificationSettings,
  type AppearanceSettings,
  type SecuritySettings
} from '@/services/settingsService'
import PhoneNumberInput from '@/components/PhoneNumberInput.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const activeSection = ref('profile')
const isEditing = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const phoneValid = ref(true)
const hasUnsavedChanges = ref(false)

const sections = [
  { id: 'profile', title: 'Profiel', icon: 'person' },
  { id: 'notifications', title: 'Notificaties', icon: 'notifications' },
  { id: 'appearance', title: 'Weergave', icon: 'palette' },
  { id: 'security', title: 'Beveiliging', icon: 'security' },
  { id: 'fiscal', title: 'Fiscaal', icon: 'account_balance' },
  { id: 'invoice', title: 'Facturatie', icon: 'receipt_long' },
  { id: 'backup', title: 'Backup', icon: 'backup' },
  { id: 'integrations', title: 'Integraties', icon: 'extension' }
]

const profile = ref<ProfileSettings>({
  name: '',
  email: '',
  phone: '',
  company: ''
})

const fiscal = ref<FiscalSettings>({
  fiscalYear: 'calendar',
  fiscalYearStart: '',
  vatNumber: '',
  kvkNumber: '',
  vatFrequency: 'quarterly'
})

const invoice = ref<InvoiceSettings>({
  numbering: 'yearly',
  customFormat: '',
  paymentTerm: 30,
  template: 'default',
  autoReminders: true
})

const backup = ref<BackupSettings>({
  autoBackup: true,
  frequency: 'daily',
  notifications: true,
  retention: '90'
})

const notifications = ref<NotificationSettings>({
  email: true,
  push: true,
  reminders: true
})

const appearance = ref<AppearanceSettings>({
  theme: 'system',
  language: 'nl',
  timezone: 'Europe/Amsterdam'
})

const security = ref<SecuritySettings>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

// Add to components
const components = {
  ConfirmationDialog
}

// Add state for confirmation dialog
const showConfirmDialog = ref(false)
const confirmDialogConfig = ref({
  title: '',
  message: '',
  confirmText: 'Bevestigen',
  onConfirm: () => {}
})

// Load settings when component mounts
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Load all settings
    const [
      profileData,
      fiscalData,
      invoiceData,
      backupData,
      notificationData,
      appearanceData
    ] = await Promise.all([
      getProfileSettings(),
      getFiscalSettings(),
      getInvoiceSettings(),
      getBackupSettings(),
      getNotificationSettings(),
      getAppearanceSettings()
    ])

    // Update refs with loaded data
    profile.value = profileData
    fiscal.value = fiscalData
    invoice.value = invoiceData
    backup.value = backupData
    notifications.value = notificationData
    appearance.value = appearanceData
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het laden van de instellingen'
    console.error('Error loading settings:', err)
  } finally {
    isLoading.value = false
  }
})

// Watch for changes in profile data
watch(profile, (newVal, oldVal) => {
  if (isEditing.value) {
    // Check if any field has actually changed
    const hasChanges = 
      newVal.name !== oldVal.name ||
      newVal.email !== oldVal.email ||
      newVal.phone !== oldVal.phone ||
      newVal.company !== oldVal.company
    hasUnsavedChanges.value = hasChanges
  }
}, { deep: true })

// Handle beforeunload event
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Save profile settings
const saveProfileSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateProfileSettings(profile.value)
    isEditing.value = false
    hasUnsavedChanges.value = false
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de profielinstellingen'
    console.error('Error saving profile settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save fiscal settings
const saveFiscalSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateFiscalSettings(fiscal.value)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de fiscale instellingen'
    console.error('Error saving fiscal settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save invoice settings
const saveInvoiceSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateInvoiceSettings(invoice.value)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de facturatie instellingen'
    console.error('Error saving invoice settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save backup settings
const saveBackupSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateBackupSettings(backup.value)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de backup instellingen'
    console.error('Error saving backup settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save notification settings
const saveNotificationSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateNotificationSettings(notifications.value)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de notificatie instellingen'
    console.error('Error saving notification settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save appearance settings
const saveAppearanceSettings = async () => {
  try {
    isLoading.value = true
    error.value = null
    await updateAppearanceSettings(appearance.value)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het opslaan van de weergave instellingen'
    console.error('Error saving appearance settings:', err)
  } finally {
    isLoading.value = false
  }
}

// Save security settings
const saveSecuritySettings = async () => {
  if (security.value.newPassword) {
    confirmDialogConfig.value = {
      title: 'Wachtwoord wijzigen',
      message: 'Weet je zeker dat je je wachtwoord wilt wijzigen?',
      confirmText: 'Wijzigen',
      onConfirm: async () => {
        try {
          await updatePassword(security.value)
          security.value.newPassword = ''
          security.value.confirmPassword = ''
        } catch (err: any) {
          error.value = 'Er is een fout opgetreden bij het wijzigen van het wachtwoord'
        }
      }
    }
    showConfirmDialog.value = true
  }

  if (security.value.twoFactor !== undefined) {
    confirmDialogConfig.value = {
      title: security.value.twoFactor ? '2FA inschakelen' : '2FA uitschakelen',
      message: security.value.twoFactor 
        ? 'Weet je zeker dat je twee-factor authenticatie wilt inschakelen?'
        : 'Weet je zeker dat je twee-factor authenticatie wilt uitschakelen?',
      confirmText: security.value.twoFactor ? 'Inschakelen' : 'Uitschakelen',
      onConfirm: async () => {
        try {
          await updateTwoFactor(security.value.twoFactor)
        } catch (err: any) {
          error.value = 'Er is een fout opgetreden bij het wijzigen van twee-factor authenticatie'
        }
      }
    }
    showConfirmDialog.value = true
  }
}

// Update the edit button click handler
const toggleEditing = () => {
  if (!isEditing.value) {
    // Starting to edit
    isEditing.value = true
    hasUnsavedChanges.value = true // Set to true when starting to edit
  } else {
    // Saving changes
    saveProfileSettings()
  }
}

// Add function to handle section change
const changeSection = (newSection: string) => {
  if (hasUnsavedChanges.value && activeSection.value === 'profile') {
    confirmDialogConfig.value = {
      title: 'Niet-opgeslagen wijzigingen',
      message: 'Je hebt niet-opgeslagen wijzigingen in je profiel. Weet je zeker dat je deze pagina wilt verlaten?',
      confirmText: 'Verlaten',
      onConfirm: () => {
        activeSection.value = newSection
        hasUnsavedChanges.value = false
      }
    }
    showConfirmDialog.value = true
  } else {
    activeSection.value = newSection
  }
}

// Add watchers for appearance settings
watch(appearance, async (newVal) => {
  try {
    await updateAppearanceSettings(newVal)
    // Apply theme immediately
    if (newVal.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newVal.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  } catch (err) {
    console.error('Error saving appearance settings:', err)
  }
}, { deep: true })

// Add watchers for notification settings
watch(notifications, async (newVal) => {
  try {
    await updateNotificationSettings(newVal)
  } catch (err) {
    console.error('Error saving notification settings:', err)
  }
}, { deep: true })
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 