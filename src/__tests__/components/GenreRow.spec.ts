import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  ended: null,
  network: null,
  webChannel: null,
  language: null,
  type: null,
  runtime: null,
  schedule: null,
  officialSite: null,
  externals: null,
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

  it('renders left and right scroll buttons', () => {
    const wrapper = mountRow('Drama', Array.from({ length: 5 }, (_, i) => makeShow(i + 1)))
    expect(wrapper.find('[aria-label="Scroll left"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Scroll right"]').exists()).toBe(true)
  })

  it('scroll buttons call scrollBy on the track element when clicked', async () => {
    const wrapper = mountRow('Drama', Array.from({ length: 5 }, (_, i) => makeShow(i + 1)))
    const track = wrapper.find('.genre-row__track').element as HTMLElement
    // JSDOM doesn't implement scrollBy, so define it before spying
    const scrollBySpy = vi.fn()
    Object.defineProperty(track, 'scrollBy', { value: scrollBySpy, configurable: true })

    await wrapper.find('[aria-label="Scroll right"]').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 500, behavior: 'smooth' })

    await wrapper.find('[aria-label="Scroll left"]').trigger('click')
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -500, behavior: 'smooth' })
  })
})
