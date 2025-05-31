import { ref, watch, onMounted } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const currentMode = ref<ThemeMode>('system')
const isDark = ref(false)

export function useDarkMode() {
  // Initialize dark mode
  const initDarkMode = () => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode
    if (savedMode) {
      currentMode.value = savedMode
    }
    applyTheme()
  }

  // Apply the current theme
  const applyTheme = () => {
    let shouldBeDark = false

    if (currentMode.value === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      shouldBeDark = currentMode.value === 'dark'
    }

    isDark.value = shouldBeDark
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Set theme mode
  const setThemeMode = (mode: ThemeMode) => {
    currentMode.value = mode
    localStorage.setItem('themeMode', mode)
    applyTheme()
  }

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (currentMode.value === 'system') {
      applyTheme()
    }
  })

  // Initialize on mount
  onMounted(() => {
    initDarkMode()
  })

  // Also initialize immediately to prevent flash
  initDarkMode()

  return {
    isDark,
    currentMode,
    setThemeMode
  }
} 