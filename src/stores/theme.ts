import { defineStore } from 'pinia'
import { ref } from 'vue'

const Storage_KEY = 'theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function initTheme(): void {
    const saved = localStorage.getItem(Storage_KEY)
    isDark.value = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme()
  }

  function toggleTheme(): void {
    isDark.value = !isDark.value
    localStorage.setItem(Storage_KEY, isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme(): void {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
})
