<template>
  <div class="relative">
    <div class="flex">
      <!-- Country Select -->
      <div class="relative">
        <button
          type="button"
          @click="isOpen = !isOpen"
          class="flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[100px]"
          :disabled="disabled"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        >
          <span class="mr-2">{{ selectedCountry?.flag }}</span>
          <span>{{ selectedCountry?.dialCode }}</span>
          <span class="material-icons ml-1 text-sm">expand_more</span>
        </button>

        <!-- Country Dropdown -->
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
        >
          <!-- Search -->
          <div class="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Zoek land..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Country List -->
          <div class="py-1">
            <button
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              :class="{ 'bg-gray-100 dark:bg-gray-700': selectedCountry?.code === country.code }"
            >
              <span class="mr-2">{{ country.flag }}</span>
              <span class="flex-1">{{ country.name }}</span>
              <span class="text-gray-500 dark:text-gray-400">{{ country.dialCode }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Phone Input -->
      <input
        type="tel"
        :value="displayNumber"
        @input="handleInput"
        @blur="validateNumber"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        :class="{ 'border-red-500': error, 'opacity-50 cursor-not-allowed': disabled }"
        :placeholder="placeholder"
        :disabled="disabled"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { parsePhoneNumber, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  defaultCountry?: CountryCode
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'valid', isValid: boolean): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const error = ref('')
const dropdownRef = ref<HTMLDivElement | null>(null)
const selectedCountry = ref<{
  code: CountryCode
  name: string
  flag: string
  dialCode: string
} | null>(null)

// Initialize with default country or Netherlands
const defaultCountryCode = props.defaultCountry || 'NL'
selectedCountry.value = {
  code: defaultCountryCode,
  name: getCountryName(defaultCountryCode),
  flag: getCountryFlag(defaultCountryCode),
  dialCode: `+${getCountryCallingCode(defaultCountryCode)}`
}

// Get all countries with their info
const countries = computed(() => {
  return getCountries().map(code => ({
    code,
    name: getCountryName(code),
    flag: getCountryFlag(code),
    dialCode: `+${getCountryCallingCode(code)}`
  }))
})

// Filter countries based on search
const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value
  const query = searchQuery.value.toLowerCase()
  return countries.value.filter(country => 
    country.name.toLowerCase().includes(query) ||
    country.dialCode.includes(query)
  )
})

// Format phone number for display
const displayNumber = computed(() => {
  if (!props.modelValue) return ''
  try {
    const phoneNumber = parsePhoneNumber(props.modelValue, selectedCountry.value?.code)
    return phoneNumber.formatNational()
  } catch {
    return props.modelValue
  }
})

// Handle input changes
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  // Remove any non-digit characters except +
  value = value.replace(/[^\d+]/g, '')

  // If it starts with +, try to detect country immediately
  if (value.startsWith('+')) {
    const countryCode = value.substring(1) // Remove the + sign
    // Try to find a matching country code
    const matchingCountry = countries.value.find(country => 
      country.dialCode.substring(1).startsWith(countryCode)
    )
    if (matchingCountry) {
      selectedCountry.value = matchingCountry
    }
  }

  emit('update:modelValue', value)
  validateNumber()
}

// Validate phone number
const validateNumber = () => {
  if (!props.modelValue) {
    error.value = ''
    emit('valid', true)
    return
  }

  try {
    const phoneNumber = parsePhoneNumber(props.modelValue, selectedCountry.value?.code)
    if (phoneNumber.isValid()) {
      error.value = ''
      emit('valid', true)
    } else {
      error.value = 'Ongeldig telefoonnummer'
      emit('valid', false)
    }
  } catch {
    error.value = 'Ongeldig telefoonnummer'
    emit('valid', false)
  }
}

// Select country from dropdown
const selectCountry = (country: typeof selectedCountry.value) => {
  if (!country) return
  selectedCountry.value = country
  isOpen.value = false
  validateNumber()
}

// Helper function to get country name
function getCountryName(code: CountryCode): string {
  const names = new Intl.DisplayNames(['nl'], { type: 'region' })
  return names.of(code) || code
}

// Helper function to get country flag emoji
function getCountryFlag(code: CountryCode): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.startsWith('+')) {
    try {
      const phoneNumber = parsePhoneNumber(newValue)
      selectedCountry.value = {
        code: phoneNumber.country as CountryCode,
        name: getCountryName(phoneNumber.country as CountryCode),
        flag: getCountryFlag(phoneNumber.country as CountryCode),
        dialCode: `+${phoneNumber.countryCallingCode}`
      }
    } catch {
      // Invalid number, keep current country
    }
  }
})

// Handle clicks outside the dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script> 