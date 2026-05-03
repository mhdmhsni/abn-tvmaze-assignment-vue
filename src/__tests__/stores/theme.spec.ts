import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.documentElement.removeAttribute('data-theme')
    localStorage.clear()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initTheme reads "dark" from localStorage', () => {
    localStorage.setItem('tvmaze-theme', 'dark')
    const store = useThemeStore()
    store.initTheme()
    expect(store.isDark).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('initTheme reads "light" from localStorage', () => {
    localStorage.setItem('tvmaze-theme', 'light')
    const store = useThemeStore()
    store.initTheme()
    expect(store.isDark).toBe(false)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggleTheme flips isDark and persists to localStorage', () => {
    localStorage.setItem('tvmaze-theme', 'light')
    const store = useThemeStore()
    store.initTheme()
    store.toggleTheme()
    expect(store.isDark).toBe(true)
    expect(localStorage.getItem('tvmaze-theme')).toBe('dark')
  })

  it('toggleTheme updates data-theme attribute on documentElement', () => {
    localStorage.setItem('tvmaze-theme', 'light')
    const store = useThemeStore()
    store.initTheme()
    store.toggleTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
