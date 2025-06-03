<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await authService.login({
      email: email.value,
      password: password.value
    })

    if (response.status === 'success' && response.data) {
      // Sla de token op in localStorage
      localStorage.setItem('token', response.data.token)
      // Sla de gebruikersgegevens op
      localStorage.setItem('user', JSON.stringify(response.data.user))
      // Navigeer naar dashboard
      router.push('/dashboard')
    } else {
      error.value = response.message || 'Er is een fout opgetreden bij het inloggen'
    }
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het inloggen'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Login</h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="input mt-1 w-full"
          :disabled="loading"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input mt-1 w-full"
          :disabled="loading"
        />
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary w-full"
        :disabled="loading"
      >
        <span v-if="loading">Bezig met inloggen...</span>
        <span v-else>Login</span>
      </button>
    </form>
    
    <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account?
      <router-link to="/register" class="text-blue-600 hover:text-blue-700">
        Register
      </router-link>
    </p>
  </div>
</template> 