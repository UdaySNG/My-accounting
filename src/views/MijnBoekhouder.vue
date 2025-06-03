<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mijn Boekhouder</h1>
    
    <!-- Main Info Card -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="relative">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 class="text-xl font-semibold">Jan Jansen</h2>
          <p class="text-gray-600 dark:text-gray-300">Senior Boekhouder</p>
          <div class="relative group">
            <span class="text-sm text-green-500">Online</span>
            <div class="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 w-48 shadow-lg z-50">
              <div class="flex items-center space-x-2 mb-1">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="font-medium">Nu beschikbaar</span>
              </div>
              <p class="text-gray-300 text-xs">Laatste activiteit: 2 minuten geleden</p>
              <p class="text-gray-300 text-xs mt-1">Typisch antwoord binnen: 15 minuten</p>
              <div class="absolute bottom-0 left-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold mb-2">Contact Informatie</h3>
          <p class="text-gray-600 dark:text-gray-300">Email: jan.jansen@accountancy.nl</p>
          <p class="text-gray-600 dark:text-gray-300">Telefoon: 020-1234567</p>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Beschikbaarheid</h3>
          <p class="text-gray-600 dark:text-gray-300">Maandag t/m Vrijdag: 9:00 - 17:00</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <RouterLink 
        to="/agenda"
        class="bg-slack-purple hover:bg-slack-pink text-white p-4 rounded-lg flex items-center justify-center space-x-2"
      >
        <span class="material-icons">calendar_today</span>
        <span>Afspraak Maken</span>
      </RouterLink>
      <button class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2">
        <span class="material-icons">chat</span>
        <span>Direct Bericht</span>
      </button>
      <button class="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2">
        <span class="material-icons">upload_file</span>
        <span>Document Delen</span>
      </button>
    </div>

    <!-- Upcoming Appointments -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h3 class="text-xl font-semibold mb-4">Komende Afspraken</h3>
      <div class="space-y-4">
        <div class="border-b pb-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">Jaarlijkse BTW Bespreking</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">15 maart 2024 - 14:00</p>
            </div>
            <button class="text-slack-purple hover:text-slack-pink">Details</button>
          </div>
        </div>
        <div class="border-b pb-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">Kwartaaloverzicht Q1</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">1 april 2024 - 10:00</p>
            </div>
            <button class="text-slack-purple hover:text-slack-pink">Details</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Documents -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4">Recente Documenten</h3>
      <div class="space-y-4">
        <div class="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          <span class="material-icons text-slack-purple">description</span>
          <div class="flex-1">
            <p class="font-medium">BTW Aangifte Q4 2023</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Gedeeld op 1 februari 2024</p>
          </div>
          <button class="text-gray-500 hover:text-gray-600">
            <span class="material-icons">download</span>
          </button>
        </div>
        <div class="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          <span class="material-icons text-green-500">receipt_long</span>
          <div class="flex-1">
            <p class="font-medium">Jaarrekening 2023</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Gedeeld op 15 januari 2024</p>
          </div>
          <button class="text-gray-500 hover:text-gray-600">
            <span class="material-icons">download</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}
</style> 