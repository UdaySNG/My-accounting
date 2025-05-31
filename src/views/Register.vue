<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Wachtwoorden komen niet overeen'
    return
  }

  try {
    // TODO: Implementeer registratie logica
    router.push('/login')
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het registreren'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Registreren</h1>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="input mt-1 w-full"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input mt-1 w-full"
        />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Bevestig wachtwoord</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="input mt-1 w-full"
        />
      </div>
      
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      
      <button type="submit" class="btn btn-primary w-full">
        Registreren
      </button>
    </form>
    
    <p class="mt-4 text-center text-sm text-gray-600">
      Heb je al een account?
      <router-link to="/login" class="text-blue-600 hover:text-blue-700">
        Inloggen
      </router-link>
    </p>
  </div>
</template> 