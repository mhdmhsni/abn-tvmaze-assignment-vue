import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/search', component: { template: '<div />' } },
  ],
})

describe('AppHeader', () => {
  const mountHeader = (isDark = false) =>
    mount(AppHeader, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn, initialState: { theme: { isDark } } }),
          router,
        ],
      },
    })

  it('renders the TVGuide logo link', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.header__logo').exists()).toBe(true)
    expect(wrapper.find('.header__logo').text()).toContain('TVGuide')
  })

  it('renders the SearchBar', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.search-bar').exists()).toBe(true)
  })

  it('renders the theme toggle button', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.header__theme-btn').exists()).toBe(true)
  })

  it('shows "Switch to dark mode" aria-label in light mode', () => {
    const wrapper = mountHeader(false)
    expect(wrapper.find('.header__theme-btn').attributes('aria-label')).toBe('Switch to dark mode')
  })

  it('shows "Switch to light mode" aria-label in dark mode', () => {
    const wrapper = mountHeader(true)
    expect(wrapper.find('.header__theme-btn').attributes('aria-label')).toBe('Switch to light mode')
  })
})
