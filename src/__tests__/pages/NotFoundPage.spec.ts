import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
})

describe('NotFoundPage', () => {
  it('renders 404 code', () => {
    const wrapper = mount(NotFoundPage, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('404')
  })

  it('renders "Page not found" message', () => {
    const wrapper = mount(NotFoundPage, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Page not found')
  })

  it('renders a link back to home', () => {
    const wrapper = mount(NotFoundPage, { global: { plugins: [router] } })
    const link = wrapper.find('a[href="/"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('home')
  })
})
