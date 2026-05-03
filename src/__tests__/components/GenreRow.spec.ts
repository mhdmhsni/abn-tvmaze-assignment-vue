import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import GenreRow from '@/components/shows/GenreRow.vue'
import type { Show } from '@/types'

const makeShow = (id: number): Show => ({
  id,
  name: `Show ${id}`,
  genres: ['Drama'],
  status: 'Running',
  rating: { average: 7.0 },
  image: null,
  summary: null,
  premiered: null,
  network: null,
  webChannel: null,
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/show/:id', component: { template: '<div />' } },
  ],
})

describe('GenreRow', () => {
  const mountRow = (genre: string, shows: Show[]) =>
    mount(GenreRow, {
      props: { genre, shows },
      global: { plugins: [createTestingPinia({ createSpy: vi.fn }), router] },
    })

  it('renders the genre name as a heading', () => {
    const wrapper = mountRow('Drama', [makeShow(1)])
    expect(wrapper.find('h2').text()).toBe('Drama')
  })

  it('renders at most 20 show cards', () => {
    const shows = Array.from({ length: 25 }, (_, i) => makeShow(i + 1))
    const wrapper = mountRow('Drama', shows)
    expect(wrapper.findAll('.card')).toHaveLength(20)
  })

  it('renders all cards when fewer than 20 shows', () => {
    const wrapper = mountRow('Comedy', [makeShow(1), makeShow(2), makeShow(3)])
    expect(wrapper.findAll('.card')).toHaveLength(3)
  })
})
