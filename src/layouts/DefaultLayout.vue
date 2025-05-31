<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slack-black transition-colors duration-300">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <main class="flex-grow container mx-auto px-4 py-8">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template> 