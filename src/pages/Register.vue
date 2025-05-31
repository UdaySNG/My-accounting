<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  // TODO: Implement registration logic
  router.push('/login')
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Register</h1>
    
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
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input mt-1 w-full"
        />
      </div>
      
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="input mt-1 w-full"
        />
      </div>
      
      <button type="submit" class="btn btn-primary w-full">
        Register
      </button>
    </form>
    
    <p class="mt-4 text-center text-sm text-gray-600">
      Already have an account?
      <router-link to="/login" class="text-blue-600 hover:text-blue-700">
        Login
      </router-link>
    </p>
  </div>
</template> 