<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await authService.login({
      email: email.value,
      password: password.value
    })

    // Sla token en gebruikersgegevens op
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // Als "Onthoud mij" is aangevinkt, sla email op
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    // Navigeer naar dashboard of de laatst bezochte pagina
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het inloggen'
  } finally {
    loading.value = false
  }
}

// Check voor opgeslagen email bij het laden van de component
const rememberedEmail = localStorage.getItem('rememberedEmail')
if (rememberedEmail) {
  email.value = rememberedEmail
  rememberMe.value = true
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Linker zijde - Afbeelding -->
    <div class="hidden lg:flex lg:w-1/2 bg-slack-purple items-center justify-center p-12">
      <div class="max-w-md text-center text-white">
        <h1 class="text-5xl font-bold mb-6">Welkom terug!</h1>
        <p class="text-xl opacity-90">
          Beheer je administratie eenvoudig en efficiënt met ons platform.
        </p>
      </div>
    </div>

    <!-- Rechter zijde - Login formulier -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Logo voor mobiel -->
        <div class="lg:hidden text-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welkom terug!</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Beheer je administratie eenvoudig en efficiënt
          </p>
        </div>

        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Inloggen
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Log in om toegang te krijgen tot je account
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
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
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-slack-purple focus:ring-slack-purple border-gray-300 dark:border-gray-700 rounded transition-colors"
                :disabled="loading"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Onthoud mij
              </label>
            </div>

            <div class="text-sm">
              <router-link 
                to="/forgot-password" 
                class="font-medium text-slack-purple hover:text-slack-pink transition-colors"
              >
                Wachtwoord vergeten?
              </router-link>
            </div>
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
              {{ loading ? 'Bezig met inloggen...' : 'Inloggen' }}
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Nog geen account?
            <router-link to="/register" class="font-medium text-slack-purple hover:text-slack-pink transition-colors">
              Registreren
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 