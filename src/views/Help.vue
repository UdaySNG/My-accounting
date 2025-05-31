<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Help & Ondersteuning</h1>
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 bg-slack-purple text-white rounded-lg hover:bg-slack-pink transition-colors flex items-center">
          <span class="material-icons mr-2">support_agent</span>
          Contact Support
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-8">
      <div class="relative max-w-2xl">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Zoek in help artikelen..." 
          class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slack-purple focus:border-transparent"
        >
        <span class="material-icons absolute left-4 top-3.5 text-gray-400 dark:text-gray-500">search</span>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="link in quickLinks" 
        :key="link.title"
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="scrollToSection(link.id)"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span class="material-icons text-gray-600 dark:text-gray-300">{{ link.icon }}</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ link.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ link.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Sections -->
    <div class="space-y-8">
      <div 
        v-for="section in faqSections" 
        :key="section.id"
        :id="section.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ section.title }}</h2>
          <p class="mt-2 text-gray-500 dark:text-gray-400">{{ section.description }}</p>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(item, index) in section.items" 
            :key="index"
            class="accordion-item"
          >
            <button 
              class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              @click="toggleAccordion(section.id, index)"
            >
              <span class="font-medium text-gray-900 dark:text-white">{{ item.question }}</span>
              <span 
                class="material-icons text-gray-500 dark:text-gray-400 transition-transform"
                :class="{ 'rotate-180': isAccordionOpen(section.id, index) }"
              >
                expand_more
              </span>
            </button>
            <div 
              class="px-6 overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': !isAccordionOpen(section.id, index), 'max-h-96 pb-4': isAccordionOpen(section.id, index) }"
            >
              <p class="text-gray-600 dark:text-gray-300">{{ item.answer }}</p>
              <div v-if="item.steps" class="mt-4 space-y-2">
                <div 
                  v-for="(step, stepIndex) in item.steps" 
                  :key="stepIndex"
                  class="flex items-start space-x-3"
                >
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slack-purple text-white flex items-center justify-center text-sm">
                    {{ stepIndex + 1 }}
                  </span>
                  <p class="text-gray-600 dark:text-gray-300">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nog steeds hulp nodig?</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Ons support team staat voor je klaar. Neem contact met ons op via onderstaande kanalen:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center space-x-4">
          <span class="material-icons text-slack-purple">email</span>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Email</h3>
            <p class="text-gray-500 dark:text-gray-400">support@myaccounting.nl</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="material-icons text-slack-purple">phone</span>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Telefoon</h3>
            <p class="text-gray-500 dark:text-gray-400">020-1234567</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="material-icons text-slack-purple">schedule</span>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Bereikbaar</h3>
            <p class="text-gray-500 dark:text-gray-400">Ma-Vr: 9:00 - 17:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const openAccordions = ref<Record<string, Set<number>>>({})

const quickLinks = [
  {
    id: 'getting-started',
    title: 'Aan de slag',
    icon: 'rocket_launch',
    description: 'Basis instructies voor nieuwe gebruikers'
  },
  {
    id: 'documents',
    title: 'Documenten',
    icon: 'folder',
    description: 'Beheer en upload documenten'
  },
  {
    id: 'accounting',
    title: 'Boekhouden',
    icon: 'account_balance',
    description: 'Boekhoudkundige functies'
  }
]

const faqSections = [
  {
    id: 'getting-started',
    title: 'Aan de slag',
    description: 'Basis instructies voor nieuwe gebruikers',
    items: [
      {
        question: 'Hoe begin ik met MyAccounting?',
        answer: 'MyAccounting is eenvoudig te gebruiken. Volg deze stappen om te beginnen:',
        steps: [
          'Maak een account aan via de registratiepagina',
          'Vul je bedrijfsgegevens in',
          'Upload je eerste documenten',
          'Begin met het bijhouden van je administratie'
        ]
      },
      {
        question: 'Welke documenten kan ik uploaden?',
        answer: 'Je kunt verschillende soorten documenten uploaden, waaronder facturen, contracten, bankafschriften en belastingaangiftes. Alle documenten worden veilig opgeslagen en zijn direct beschikbaar.'
      },
      {
        question: 'Hoe veilig zijn mijn gegevens?',
        answer: 'We nemen de veiligheid van je gegevens zeer serieus. Alle data wordt versleuteld opgeslagen en we voldoen aan de hoogste beveiligingsstandaarden.'
      }
    ]
  },
  {
    id: 'documents',
    title: 'Documenten',
    description: 'Alles over het beheren van je documenten',
    items: [
      {
        question: 'Hoe upload ik documenten?',
        answer: 'Je kunt documenten op twee manieren uploaden:',
        steps: [
          'Sleep bestanden naar het upload gebied',
          'Of klik op de upload knop en selecteer bestanden'
        ]
      },
      {
        question: 'Welke bestandsformaten worden ondersteund?',
        answer: 'We ondersteunen de volgende bestandsformaten: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX. De maximale bestandsgrootte is 10MB per bestand.'
      }
    ]
  },
  {
    id: 'accounting',
    title: 'Boekhouden',
    description: 'Informatie over boekhoudkundige functies',
    items: [
      {
        question: 'Hoe maak ik een factuur aan?',
        answer: 'Het aanmaken van een factuur is eenvoudig:',
        steps: [
          'Ga naar het facturen overzicht',
          'Klik op "Nieuwe factuur"',
          'Vul de gegevens in',
          'Voeg producten of diensten toe',
          'Sla de factuur op'
        ]
      },
      {
        question: 'Hoe exporteer ik mijn boekhouding?',
        answer: 'Je kunt je boekhouding exporteren in verschillende formaten. Ga naar het rapporten overzicht en kies het gewenste exportformaat.'
      }
    ]
  }
]

const toggleAccordion = (sectionId: string, index: number) => {
  if (!openAccordions.value[sectionId]) {
    openAccordions.value[sectionId] = new Set()
  }
  if (openAccordions.value[sectionId].has(index)) {
    openAccordions.value[sectionId].delete(index)
  } else {
    openAccordions.value[sectionId].add(index)
  }
}

const isAccordionOpen = (sectionId: string, index: number) => {
  return openAccordions.value[sectionId]?.has(index) || false
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.accordion-item {
  transition: all 0.3s ease;
}

.accordion-item button {
  outline: none;
}

.accordion-item button:focus-visible {
  @apply ring-2 ring-slack-purple ring-offset-2 dark:ring-offset-gray-900;
}
</style> 