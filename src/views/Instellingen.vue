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
              <div class="relative">
                <input 
                  v-model="security.currentPassword" 
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <span class="material-icons text-xl">
                    {{ showCurrentPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nieuw wachtwoord</label>
              <div class="relative">
                <input 
                  v-model="security.newPassword" 
                  :type="showNewPassword ? 'text' : 'password'"
                  :disabled="!security.currentPassword"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showNewPassword = !showNewPassword"
                  :disabled="!security.currentPassword"
                >
                  <span class="material-icons text-xl">
                    {{ showNewPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bevestig nieuw wachtwoord</label>
              <div class="relative">
                <input 
                  v-model="security.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :disabled="!security.currentPassword"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="!security.currentPassword"
                >
                  <span class="material-icons text-xl">
                    {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Wachtwoord sterkte indicator -->
            <div v-if="security.newPassword" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Wachtwoord sterkte:</span>
                <span :class="{
                  'text-red-500': passwordStrength <= 1,
                  'text-yellow-500': passwordStrength === 2 || passwordStrength === 3,
                  'text-green-500': passwordStrength >= 4
                }">
                  {{ strengthText }}
                </span>
              </div>
              <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full transition-all duration-300"
                  :class="strengthColor"
                  :style="{ width: `${(passwordStrength / 5) * 100}%` }"
                ></div>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li class="flex items-center">
                  <span class="material-icons text-sm mr-1" :class="hasMinLength ? 'text-green-500' : 'text-gray-400'">
                    {{ hasMinLength ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  Minimaal 8 karakters
                </li>
                <li class="flex items-center">
                  <span class="material-icons text-sm mr-1" :class="hasUppercase ? 'text-green-500' : 'text-gray-400'">
                    {{ hasUppercase ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  Minimaal 1 hoofdletter
                </li>
                <li class="flex items-center">
                  <span class="material-icons text-sm mr-1" :class="hasLowercase ? 'text-green-500' : 'text-gray-400'">
                    {{ hasLowercase ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  Minimaal 1 kleine letter
                </li>
                <li class="flex items-center">
                  <span class="material-icons text-sm mr-1" :class="hasNumber ? 'text-green-500' : 'text-gray-400'">
                    {{ hasNumber ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  Minimaal 1 cijfer
                </li>
                <li class="flex items-center">
                  <span class="material-icons text-sm mr-1" :class="hasSpecialChar ? 'text-green-500' : 'text-gray-400'">
                    {{ hasSpecialChar ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  Minimaal 1 speciaal teken
                </li>
              </ul>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <h3 class="text-lg font-medium">Twee-factor authenticatie</h3>
                <div class="relative group">
                  <span class="material-icons text-gray-400 text-sm cursor-help">info</span>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    Voeg een extra beveiligingslaag toe aan je account met twee-factor authenticatie. Na het inloggen met je wachtwoord moet je een code invoeren die gegenereerd wordt door een authenticator app.
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="!twoFactorStatus.enabled"
                  @click="startTwoFactorSetup"
                  class="px-4 py-2 bg-slack-purple text-white rounded hover:bg-slack-pink transition-colors"
                >
                  Inschakelen
                </button>
                <button
                  v-else
                  @click="verificationCode = ''"
                  class="px-4 py-2 bg-slack-purple text-white rounded hover:bg-slack-pink transition-colors"
                >
                  Uitschakelen
                </button>
              </div>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                v-if="security.newPassword || security.twoFactor !== undefined"
                @click="saveSecuritySettings"
                class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors flex items-center"
                :disabled="isLoading"
              >
                <span class="material-icons mr-2">{{ isLoading ? 'hourglass_empty' : 'save' }}</span>
                {{ isLoading ? 'Opslaan...' : 'Opslaan' }}
              </button>
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
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Integraties</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Verbind je account met andere diensten</p>
            </div>
            <button 
              @click="refreshIntegrations"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              :disabled="integrationsLoading"
            >
              <span class="material-icons mr-2" :class="{ 'animate-spin': integrationsLoading }">
                {{ integrationsLoading ? 'sync' : 'refresh' }}
              </span>
              {{ integrationsLoading ? 'Verversen...' : 'Ververs' }}
            </button>
          </div>

          <!-- Error message -->
          <div v-if="integrationsError" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <span class="material-icons mr-2">error</span>
            {{ integrationsError }}
          </div>

          <div class="space-y-8">
            <!-- Banking Integrations -->
            <div v-if="integrations.filter(i => i.category === 'banking').length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <span class="material-icons text-gray-600 dark:text-gray-400 mr-2">account_balance</span>
                <h3 class="text-md font-medium text-gray-900 dark:text-white">Banking</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="integration in integrations.filter(i => i.category === 'banking')"
                  :key="integration.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="material-icons text-gray-600 dark:text-gray-400">{{ integration.icon }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ integration.description }}</p>
                        <p class="text-sm mt-2 flex items-center" :class="getIntegrationStatusColor(integration)">
                          <span class="w-2 h-2 rounded-full mr-2" :class="{
                            'bg-green-500': integration.status === 'connected',
                            'bg-gray-400': integration.status === 'disconnected',
                            'bg-yellow-500': integration.status === 'pending',
                            'bg-red-500': integration.status === 'error'
                          }"></span>
                          {{ getIntegrationStatusText(integration) }}
                          <span v-if="integration.lastSync" class="ml-2 text-gray-500">
                            (Laatste sync: {{ new Date(integration.lastSync).toLocaleString() }})
                          </span>
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="handleIntegrationButtonClick(integration)"
                      class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
                      :class="getIntegrationButtonColor(integration)"
                      :disabled="integration.status === 'pending'"
                    >
                      <span class="material-icons text-sm mr-1">
                        {{ integration.status === 'connected' ? 'link_off' : 'link' }}
                      </span>
                      {{ getIntegrationButtonText(integration) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accounting Software -->
            <div v-if="integrations.filter(i => i.category === 'accounting').length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <span class="material-icons text-gray-600 dark:text-gray-400 mr-2">account_balance</span>
                <h3 class="text-md font-medium text-gray-900 dark:text-white">Boekhoudsoftware</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="integration in integrations.filter(i => i.category === 'accounting')"
                  :key="integration.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="material-icons text-gray-600 dark:text-gray-400">{{ integration.icon }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ integration.description }}</p>
                        <p class="text-sm mt-2 flex items-center" :class="getIntegrationStatusColor(integration)">
                          <span class="w-2 h-2 rounded-full mr-2" :class="{
                            'bg-green-500': integration.status === 'connected',
                            'bg-gray-400': integration.status === 'disconnected',
                            'bg-yellow-500': integration.status === 'pending',
                            'bg-red-500': integration.status === 'error'
                          }"></span>
                          {{ getIntegrationStatusText(integration) }}
                          <span v-if="integration.lastSync" class="ml-2 text-gray-500">
                            (Laatste sync: {{ new Date(integration.lastSync).toLocaleString() }})
                          </span>
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="handleIntegrationButtonClick(integration)"
                      class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
                      :class="getIntegrationButtonColor(integration)"
                      :disabled="integration.status === 'pending'"
                    >
                      <span class="material-icons text-sm mr-1">
                        {{ integration.status === 'connected' ? 'link_off' : 'link' }}
                      </span>
                      {{ getIntegrationButtonText(integration) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Providers -->
            <div v-if="integrations.filter(i => i.category === 'payment').length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <span class="material-icons text-gray-600 dark:text-gray-400 mr-2">payments</span>
                <h3 class="text-md font-medium text-gray-900 dark:text-white">Betaalproviders</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="integration in integrations.filter(i => i.category === 'payment')"
                  :key="integration.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="material-icons text-gray-600 dark:text-gray-400">{{ integration.icon }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ integration.description }}</p>
                        <p class="text-sm mt-2 flex items-center" :class="getIntegrationStatusColor(integration)">
                          <span class="w-2 h-2 rounded-full mr-2" :class="{
                            'bg-green-500': integration.status === 'connected',
                            'bg-gray-400': integration.status === 'disconnected',
                            'bg-yellow-500': integration.status === 'pending',
                            'bg-red-500': integration.status === 'error'
                          }"></span>
                          {{ getIntegrationStatusText(integration) }}
                          <span v-if="integration.lastSync" class="ml-2 text-gray-500">
                            (Laatste sync: {{ new Date(integration.lastSync).toLocaleString() }})
                          </span>
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="handleIntegrationButtonClick(integration)"
                      class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
                      :class="getIntegrationButtonColor(integration)"
                      :disabled="integration.status === 'pending'"
                    >
                      <span class="material-icons text-sm mr-1">
                        {{ integration.status === 'connected' ? 'link_off' : 'link' }}
                      </span>
                      {{ getIntegrationButtonText(integration) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- E-commerce -->
            <div v-if="integrations.filter(i => i.category === 'ecommerce').length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <span class="material-icons text-gray-600 dark:text-gray-400 mr-2">shopping_cart</span>
                <h3 class="text-md font-medium text-gray-900 dark:text-white">Webwinkels</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="integration in integrations.filter(i => i.category === 'ecommerce')"
                  :key="integration.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="material-icons text-gray-600 dark:text-gray-400">{{ integration.icon }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ integration.description }}</p>
                        <p class="text-sm mt-2 flex items-center" :class="getIntegrationStatusColor(integration)">
                          <span class="w-2 h-2 rounded-full mr-2" :class="{
                            'bg-green-500': integration.status === 'connected',
                            'bg-gray-400': integration.status === 'disconnected',
                            'bg-yellow-500': integration.status === 'pending',
                            'bg-red-500': integration.status === 'error'
                          }"></span>
                          {{ getIntegrationStatusText(integration) }}
                          <span v-if="integration.lastSync" class="ml-2 text-gray-500">
                            (Laatste sync: {{ new Date(integration.lastSync).toLocaleString() }})
                          </span>
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="handleIntegrationButtonClick(integration)"
                      class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
                      :class="getIntegrationButtonColor(integration)"
                      :disabled="integration.status === 'pending'"
                    >
                      <span class="material-icons text-sm mr-1">
                        {{ integration.status === 'connected' ? 'link_off' : 'link' }}
                      </span>
                      {{ getIntegrationButtonText(integration) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- CRM -->
            <div v-if="integrations.filter(i => i.category === 'crm').length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <span class="material-icons text-gray-600 dark:text-gray-400 mr-2">people</span>
                <h3 class="text-md font-medium text-gray-900 dark:text-white">CRM</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="integration in integrations.filter(i => i.category === 'crm')"
                  :key="integration.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span class="material-icons text-gray-600 dark:text-gray-400">{{ integration.icon }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ integration.description }}</p>
                        <p class="text-sm mt-2 flex items-center" :class="getIntegrationStatusColor(integration)">
                          <span class="w-2 h-2 rounded-full mr-2" :class="{
                            'bg-green-500': integration.status === 'connected',
                            'bg-gray-400': integration.status === 'disconnected',
                            'bg-yellow-500': integration.status === 'pending',
                            'bg-red-500': integration.status === 'error'
                          }"></span>
                          {{ getIntegrationStatusText(integration) }}
                          <span v-if="integration.lastSync" class="ml-2 text-gray-500">
                            (Laatste sync: {{ new Date(integration.lastSync).toLocaleString() }})
                          </span>
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="handleIntegrationButtonClick(integration)"
                      class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
                      :class="getIntegrationButtonColor(integration)"
                      :disabled="integration.status === 'pending'"
                    >
                      <span class="material-icons text-sm mr-1">
                        {{ integration.status === 'connected' ? 'link_off' : 'link' }}
                      </span>
                      {{ getIntegrationButtonText(integration) }}
                    </button>
                  </div>
                </div>
              </div>
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

    <!-- 2FA Setup Dialog -->
    <TwoFactorSetupDialog
      v-model="showTwoFactorSetup"
      :setup="twoFactorSetup"
      @verify="verifyTwoFactorSetup"
    />

    <!-- 2FA Disable Dialog -->
    <div v-if="showDisableDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white">2FA Uitschakelen</h4>
          <button 
            @click="showDisableDialog = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Voer de 6-cijferige code in van je authenticator app om 2FA uit te schakelen
          </p>
          <div class="flex gap-2">
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-slack-purple text-gray-900 dark:text-white"
            />
            <button
              @click="handleDisableTwoFactor"
              class="px-4 py-2 bg-slack-purple text-white rounded hover:bg-slack-pink transition-colors"
            >
              Uitschakelen
            </button>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showDisableDialog = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup Codes Dialog -->
    <div v-if="showBackupCodes && twoFactorSetup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-medium text-white">Backup Codes</h4>
          <button 
            @click="showBackupCodes = false"
            class="text-gray-400 hover:text-white"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="space-y-4">
          <p class="text-gray-300">
            Bewaar deze backup codes op een veilige plek. Je kunt ze gebruiken om in te loggen als je geen toegang hebt tot je authenticator app.
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="code in twoFactorSetup.backupCodes"
              :key="code"
              class="p-2 bg-gray-700 rounded font-mono text-center text-white"
            >
              {{ code }}
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showBackupCodes = false"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Ik heb de codes opgeslagen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
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
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  getTwoFactorStatus,
  type ProfileSettings,
  type FiscalSettings,
  type InvoiceSettings,
  type BackupSettings,
  type NotificationSettings,
  type AppearanceSettings,
  type SecuritySettings,
  type TwoFactorSetupResponse
} from '@/services/settingsService'
import { useIntegrations } from '@/services/integrationService'
import type { Integration } from '@/types/integrations'
import PhoneNumberInput from '@/components/PhoneNumberInput.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import TwoFactorSetupDialog from '@/components/TwoFactorSetupDialog.vue'

// Add type for confirmation dialog configuration
type ConfirmDialogConfig = {
  title: string
  message: string
  confirmText: string
  onConfirm: () => Promise<void>
}

// Add state for confirmation dialog
const showConfirmDialog = ref(false)
const confirmDialogConfig = ref<ConfirmDialogConfig>({
  title: '',
  message: '',
  confirmText: 'Bevestigen',
  onConfirm: async () => {}
})

// Helper function to update confirmation dialog
const updateConfirmDialog = (config: ConfirmDialogConfig) => {
  confirmDialogConfig.value = config
  showConfirmDialog.value = true
}

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

// Add toast functions
const toast = useToast()
const showSuccess = (message: string) => toast.success(message)
const showError = (message: string) => toast.error(message)

// Add original security state
const originalSecurity = ref<SecuritySettings>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

// Add password validation
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(security.value.newPassword))
const hasUppercase = computed(() => /[A-Z]/.test(security.value.newPassword))
const hasLowercase = computed(() => /[a-z]/.test(security.value.newPassword))
const hasNumber = computed(() => /[0-9]/.test(security.value.newPassword))
const hasMinLength = computed(() => security.value.newPassword.length >= 8)

// Password strength calculation
const passwordStrength = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasUppercase.value) strength++
  if (hasLowercase.value) strength++
  if (hasNumber.value) strength++
  if (hasSpecialChar.value) strength++
  return strength
})

// Password strength color
const strengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'bg-red-500'
    case 2:
    case 3:
      return 'bg-yellow-500'
    case 4:
    case 5:
      return 'bg-green-500'
    default:
      return 'bg-gray-200'
  }
})

// Password strength text
const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'Zeer zwak'
    case 2:
    case 3:
      return 'Gemiddeld'
    case 4:
    case 5:
      return 'Sterk'
    default:
      return ''
  }
})

// Add show/hide password functionality
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// 2FA Types
interface QRCodeResponse {
  data?: string;
  [key: string]: any;
}

interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string | QRCodeResponse;
  backupCodes: string[];
}

// 2FA State
const twoFactorSetup = ref<TwoFactorSetupResponse | null>(null)
const verificationCode = ref('')
const showBackupCodes = ref(false)
const twoFactorStatus = ref<{
  enabled: boolean;
  setupComplete: boolean;
}>({
  enabled: false,
  setupComplete: false
})

// Add to the state section
const showDisableDialog = ref(false)
const showTwoFactorSetup = ref(false)

// Add integration state
const { 
  integrations,
  isLoading: integrationsLoading,
  error: integrationsError,
  refreshIntegrations,
  connectIntegration,
  disconnectIntegration
} = useIntegrations()

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

    // Load 2FA status
    twoFactorStatus.value = await getTwoFactorStatus()
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
  try {
    // Check if password is being updated
    if (security.value.currentPassword || security.value.newPassword || security.value.confirmPassword) {
      if (!security.value.currentPassword) {
        showError('Vul je huidige wachtwoord in')
        return
      }
      if (!security.value.newPassword) {
        showError('Vul een nieuw wachtwoord in')
        return
      }
      if (!security.value.confirmPassword) {
        showError('Bevestig je nieuwe wachtwoord')
        return
      }
      if (security.value.newPassword !== security.value.confirmPassword) {
        showError('Wachtwoorden komen niet overeen')
        return
      }
      if (passwordStrength.value < 3) {
        showError('Wachtwoord voldoet niet aan de vereisten')
        return
      }

      // Show confirmation dialog for password update
      updateConfirmDialog({
        title: 'Wachtwoord bijwerken',
        message: 'Weet je zeker dat je je wachtwoord wilt bijwerken?',
        confirmText: 'Bijwerken',
        onConfirm: async () => {
          try {
            await updatePassword(security.value)
            showSuccess('Wachtwoord succesvol bijgewerkt')
            // Reset password fields
            security.value.currentPassword = ''
            security.value.newPassword = ''
            security.value.confirmPassword = ''
          } catch (error) {
            showError('Fout bij bijwerken wachtwoord')
          }
        }
      })
      return
    }

    // Check if 2FA status is changing
    if (security.value.twoFactor !== originalSecurity.value.twoFactor) {
      updateConfirmDialog({
        title: security.value.twoFactor ? '2FA inschakelen' : '2FA uitschakelen',
        message: security.value.twoFactor 
          ? 'Weet je zeker dat je twee-factor authenticatie wilt inschakelen?'
          : 'Weet je zeker dat je twee-factor authenticatie wilt uitschakelen?',
        confirmText: security.value.twoFactor ? 'Inschakelen' : 'Uitschakelen',
        onConfirm: async () => {
          try {
            await updateTwoFactor(security.value.twoFactor)
            showSuccess('Twee-factor authenticatie succesvol bijgewerkt')
            // Update original state after successful save
            originalSecurity.value = { ...security.value }
          } catch (error) {
            showError('Fout bij bijwerken twee-factor authenticatie')
            // Revert the change on error
            security.value.twoFactor = originalSecurity.value.twoFactor
          }
        }
      })
      return
    }

    showSuccess('Instellingen opgeslagen')
  } catch (error) {
    showError('Fout bij opslaan instellingen')
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
    updateConfirmDialog({
      title: 'Niet-opgeslagen wijzigingen',
      message: 'Je hebt niet-opgeslagen wijzigingen in je profiel. Weet je zeker dat je deze pagina wilt verlaten?',
      confirmText: 'Verlaten',
      onConfirm: async () => {
        activeSection.value = newSection
        hasUnsavedChanges.value = false
      }
    })
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

// 2FA Functions
const startTwoFactorSetup = async () => {
  try {
    const response = await setupTwoFactor()
    console.log('QR Code response:', response)
    twoFactorSetup.value = {
      secret: response.secret,
      qrCode: response.qrCode,
      backupCodes: response.backupCodes
    }
    showTwoFactorSetup.value = true
  } catch (error) {
    console.error('Failed to setup 2FA:', error)
    toast.error('Er is een fout opgetreden bij het instellen van 2FA')
  }
}

const verifyTwoFactorSetup = async (code: string) => {
  try {
    console.log('Verifying 2FA with code:', code)
    const result = await verifyTwoFactor(code)
    console.log('Verification result:', result)
    
    if (result.success) {
      toast.success('2FA is succesvol ingeschakeld')
      twoFactorStatus.value.enabled = true
      twoFactorStatus.value.setupComplete = true
      showBackupCodes.value = true
      showTwoFactorSetup.value = false
    } else {
      toast.error(result.message || 'Verificatie mislukt')
    }
  } catch (error: any) {
    console.error('Failed to verify 2FA:', error)
    console.error('Error details:', error.response?.data)
    toast.error(error.response?.data?.message || 'Er is een fout opgetreden bij het verifiëren van 2FA')
  }
}

const handleDisableTwoFactor = async () => {
  if (!verificationCode.value) {
    toast.error('Voer de verificatiecode in')
    return
  }

  try {
    const result = await disableTwoFactor(verificationCode.value)
    if (result.success) {
      toast.success('2FA is succesvol uitgeschakeld')
      twoFactorStatus.value.enabled = false
      twoFactorStatus.value.setupComplete = false
      security.value.twoFactor = false
      showDisableDialog.value = false
      verificationCode.value = ''
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    console.error('Failed to disable 2FA:', error)
    toast.error('Er is een fout opgetreden bij het uitschakelen van 2FA')
  }
}

// Add to the script section
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Setup key gekopieerd naar klembord')
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error('Kon setup key niet kopiëren')
  }
}

// Add integration connection handlers
const handleConnectIntegration = async (integration: Integration) => {
  try {
    await connectIntegration(integration.id)
    showSuccess(`${integration.name} is succesvol verbonden`)
  } catch (err) {
    showError(`Er is een fout opgetreden bij het verbinden van ${integration.name}`)
  }
}

const handleDisconnectIntegration = async (integration: Integration) => {
  try {
    await disconnectIntegration(integration.id)
    showSuccess(`${integration.name} is succesvol verbroken`)
  } catch (err) {
    showError(`Er is een fout opgetreden bij het verbreken van ${integration.name}`)
  }
}

// Add integration status text
const getIntegrationStatusText = (integration: Integration) => {
  switch (integration.status) {
    case 'connected':
      return 'Verbonden'
    case 'disconnected':
      return 'Niet verbonden'
    case 'pending':
      return 'Bezig met verbinden...'
    case 'error':
      return 'Fout bij verbinden'
    default:
      return 'Onbekend'
  }
}

// Add integration status color
const getIntegrationStatusColor = (integration: Integration) => {
  switch (integration.status) {
    case 'connected':
      return 'text-green-500'
    case 'disconnected':
      return 'text-gray-500'
    case 'pending':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

// Add integration button text
const getIntegrationButtonText = (integration: Integration) => {
  switch (integration.status) {
    case 'connected':
      return 'Verbreken'
    case 'disconnected':
      return 'Verbinden'
    case 'pending':
      return 'Bezig...'
    case 'error':
      return 'Opnieuw proberen'
    default:
      return 'Verbinden'
  }
}

// Add integration button color
const getIntegrationButtonColor = (integration: Integration) => {
  switch (integration.status) {
    case 'connected':
      return 'bg-red-500 hover:bg-red-600'
    case 'disconnected':
      return 'bg-slack-purple hover:bg-slack-pink'
    case 'pending':
      return 'bg-gray-500 cursor-not-allowed'
    case 'error':
      return 'bg-yellow-500 hover:bg-yellow-600'
    default:
      return 'bg-slack-purple hover:bg-slack-pink'
  }
}

// Add integration button handler
const handleIntegrationButtonClick = (integration: Integration) => {
  if (integration.status === 'connected') {
    handleDisconnectIntegration(integration)
  } else {
    handleConnectIntegration(integration)
  }
}
</script>

<style scoped>
.material-icons {
  font-size: 20px;
}
</style> 