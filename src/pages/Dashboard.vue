<script setup lang="ts">
import { ref, onMounted } from 'vue'

const totalBalance = ref(0)
const income = ref(0)
const expenses = ref(0)

// Monthly spending categories
const spendingCategories = ref([
  { name: 'Housing', amount: 1200, percentage: 53, icon: '🏠' },
  { name: 'Food', amount: 450, percentage: 20, icon: '🍔' },
  { name: 'Transport', amount: 200, percentage: 9, icon: '🚗' },
  { name: 'Entertainment', amount: 150, percentage: 7, icon: '🎬' },
  { name: 'Utilities', amount: 249.25, percentage: 11, icon: '💡' }
])

// Monthly income sources
const incomeSources = ref([
  { name: 'Salary', amount: 3000, percentage: 86, icon: '💼' },
  { name: 'Freelance', amount: 500, percentage: 14, icon: '🧑‍💻' }
])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Simulate data loading
onMounted(() => {
  setTimeout(() => {
    totalBalance.value = 1250.75
    income.value = 3500.00
    expenses.value = 2249.25
  }, 500)
})
</script>

<template>
  <div class="relative max-w-7xl mx-auto px-4 py-10 space-y-10 bg-slate-50 dark:bg-slack-black min-h-screen transition-colors duration-300">
    <!-- Floating Action Button -->
    <button class="fixed z-50 bottom-8 right-8 bg-gradient-to-br from-slack-purple to-slack-pink text-white shadow-xl rounded-full w-16 h-16 flex items-center justify-center text-3xl hover:scale-105 transition-transform duration-200">
      +
    </button>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-slack-black dark:text-white mb-2">Dashboard</h1>
        <p class="text-lg text-slack-gray dark:text-gray-400">Welcome back! Here's your financial overview.</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="relative rounded-2xl shadow-lg p-8 bg-white/90 dark:bg-slate-900/80 flex flex-col items-start overflow-hidden transition-colors duration-300">
        <div class="absolute right-4 top-4 text-5xl opacity-10 group-hover:opacity-20 transition">💰</div>
        <span class="text-slack-gray dark:text-gray-400 font-medium">Total Balance</span>
        <span class="text-3xl font-bold text-slack-black dark:text-white">{{ formatCurrency(totalBalance) }}</span>
      </div>
      <div class="relative rounded-2xl shadow-lg p-8 bg-white/90 dark:bg-slate-900/80 flex flex-col items-start overflow-hidden transition-colors duration-300">
        <div class="absolute right-4 top-4 text-5xl opacity-10 group-hover:opacity-20 transition">⬆️</div>
        <span class="text-slack-gray dark:text-gray-400 font-medium">Income</span>
        <span class="text-3xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(income) }}</span>
      </div>
      <div class="relative rounded-2xl shadow-lg p-8 bg-white/90 dark:bg-slate-900/80 flex flex-col items-start overflow-hidden transition-colors duration-300">
        <div class="absolute right-4 top-4 text-5xl opacity-10 group-hover:opacity-20 transition">⬇️</div>
        <span class="text-slack-gray dark:text-gray-400 font-medium">Expenses</span>
        <span class="text-3xl font-bold text-slack-pink">{{ formatCurrency(expenses) }}</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Spending Breakdown -->
      <div class="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slack-black dark:text-white">Spending Breakdown</h2>
        </div>
        <div class="space-y-6">
          <div v-for="category in spendingCategories" :key="category.name" class="flex items-center gap-4">
            <div class="text-2xl">{{ category.icon }}</div>
            <div class="flex-1">
              <div class="flex justify-between text-base font-medium">
                <span class="text-slack-black dark:text-white">{{ category.name }}</span>
                <span class="text-slack-gray dark:text-gray-400">{{ formatCurrency(category.amount) }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                <div class="bg-gradient-to-r from-slack-pink to-slack-purple h-3 rounded-full transition-all duration-700" :style="{ width: `${category.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Income Sources -->
      <div class="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slack-black dark:text-white">Income Sources</h2>
        </div>
        <div class="space-y-6">
          <div v-for="source in incomeSources" :key="source.name" class="flex items-center gap-4">
            <div class="text-2xl">{{ source.icon }}</div>
            <div class="flex-1">
              <div class="flex justify-between text-base font-medium">
                <span class="text-slack-black dark:text-white">{{ source.name }}</span>
                <span class="text-slack-gray dark:text-gray-400">{{ formatCurrency(source.amount) }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                <div class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-700" :style="{ width: `${source.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slack-black dark:text-white">Recent Activity</h2>
      </div>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 rounded-xl hover:bg-slack-purple/10 dark:hover:bg-slack-purple/20 transition group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-2xl">⬆️</div>
            <div>
              <p class="font-semibold text-slack-black dark:text-white">Salary</p>
              <p class="text-sm text-slack-gray dark:text-gray-400">March 15, 2024</p>
            </div>
          </div>
          <p class="text-green-600 dark:text-green-400 font-bold">+{{ formatCurrency(3500) }}</p>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl hover:bg-slack-pink/10 dark:hover:bg-slack-pink/20 transition group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-2xl">⬇️</div>
            <div>
              <p class="font-semibold text-slack-black dark:text-white">Rent</p>
              <p class="text-sm text-slack-gray dark:text-gray-400">March 10, 2024</p>
            </div>
          </div>
          <p class="text-slack-pink font-bold">-{{ formatCurrency(1200) }}</p>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl hover:bg-slack-pink/10 dark:hover:bg-slack-pink/20 transition group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-2xl">⬇️</div>
            <div>
              <p class="font-semibold text-slack-black dark:text-white">Groceries</p>
              <p class="text-sm text-slack-gray dark:text-gray-400">March 8, 2024</p>
            </div>
          </div>
          <p class="text-slack-pink font-bold">-{{ formatCurrency(150.25) }}</p>
        </div>
      </div>
    </div>
  </div>
</template> 