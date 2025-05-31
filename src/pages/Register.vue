<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Wachtwoord criteria
const criteria = {
  minLength: 8,
  hasUppercase: /[A-Z]/.test(password.value),
  hasLowercase: /[a-z]/.test(password.value),
  hasNumber: /[0-9]/.test(password.value),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
}

// Computed properties voor wachtwoord validatie
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasMinLength = computed(() => password.value.length >= 8)

// Wachtwoord sterkte berekenen
const passwordStrength = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasUppercase.value) strength++
  if (hasLowercase.value) strength++
  if (hasNumber.value) strength++
  if (hasSpecialChar.value) strength++
  return strength
})

// Wachtwoord sterkte kleur
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

// Wachtwoord sterkte tekst
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

const handleRegister = async () => {
  error.value = ''
  loading.value = true

  try {
    if (password.value !== confirmPassword.value) {
      error.value = 'Wachtwoorden komen niet overeen'
      return
    }

    if (passwordStrength.value < 3) {
      error.value = 'Wachtwoord is te zwak. Gebruik minimaal 8 karakters, hoofdletters, kleine letters en cijfers.'
      return
    }

    const response = await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    })

    // Sla token en gebruikersgegevens op
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Navigeer naar dashboard
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het registreren'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Linker zijde - Afbeelding -->
    <div class="hidden lg:flex lg:w-1/2 bg-slack-purple items-center justify-center p-12">
      <div class="max-w-md text-center text-white">
        <h1 class="text-5xl font-bold mb-6">Word lid van ons platform</h1>
        <p class="text-xl opacity-90">
          Begin vandaag nog met het beheren van je administratie op een eenvoudige en efficiënte manier.
        </p>
      </div>
    </div>

    <!-- Rechter zijde - Registratie formulier -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Logo voor mobiel -->
        <div class="lg:hidden text-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Word lid</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Begin vandaag nog met het beheren van je administratie
          </p>
        </div>

        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Registreren
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Maak een account aan om te beginnen
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Naam
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slack-purple focus:border-transparent transition-colors"
                placeholder="Jouw naam"
                :disabled="loading"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slack-purple focus:border-transparent transition-colors"
                placeholder="naam@bedrijf.nl"
                :disabled="loading"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wachtwoord
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slack-purple focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  :disabled="loading"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPassword = !showPassword"
                >
                  <span class="material-icons text-xl">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bevestig wachtwoord
              </label>
              <div class="relative">
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slack-purple focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  :disabled="loading"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <span class="material-icons text-xl">
                    {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Wachtwoord sterkte indicator -->
          <div v-if="password" class="space-y-2">
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

          <div v-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-500 p-4 rounded-lg text-sm text-center">
            {{ error }}
          </div>
          
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slack-purple hover:bg-slack-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slack-purple transition-all duration-200 transform hover:scale-[1.02]"
              :disabled="loading"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Bezig met registreren...' : 'Registreren' }}
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Heb je al een account?
            <router-link to="/login" class="font-medium text-slack-purple hover:text-slack-pink transition-colors">
              Inloggen
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 