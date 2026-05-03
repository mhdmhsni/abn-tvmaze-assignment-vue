import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'tvmaze-theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function initTheme(): void {
    const saved = localStorage.getItem(STORAGE_KEY)
    isDark.value = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme()
  }

  function toggleTheme(): void {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
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
