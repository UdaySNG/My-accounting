<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // TODO: Implement login logic
  router.push('/dashboard')
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Login</h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
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
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input mt-1 w-full"
        />
      </div>
      
      <button type="submit" class="btn btn-primary w-full">
        Login
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