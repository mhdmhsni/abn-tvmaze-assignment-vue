import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'
import * as tvmazeApi from '@/api/tvmaze'
import type { Show } from '@/types'

const makeShow = (id: number, name: string): Show => ({
  id,
  name,
  genres: ['Drama'],
  status: 'Running',
  rating: { average: 7.5 },
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
    { path: '/search', component: SearchResultsPage },
    { path: '/show/:id', component: { template: '<div />' } },
  ],
})

describe('SearchResultsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const mountPage = async (query: string) => {
    await router.push(`/search?q=${encodeURIComponent(query)}`)
    const wrapper = mount(SearchResultsPage, {
      global: { plugins: [createTestingPinia({ createSpy: vi.fn }), router] },
    })
    await flushPromises()
    return wrapper
  }

  it('renders heading with search query', async () => {
    vi.spyOn(tvmazeApi, 'searchShows').mockResolvedValue([])
    const wrapper = await mountPage('breaking bad')
    expect(wrapper.text()).toContain('breaking bad')
  })

  it('shows loading state while fetching', async () => {
    vi.spyOn(tvmazeApi, 'searchShows').mockReturnValue(new Promise(() => {}))
    await router.push('/search?q=test')
    const wrapper = mount(SearchResultsPage, {
      global: { plugins: [createTestingPinia({ createSpy: vi.fn }), router] },
    })
    await nextTick()
    expect(wrapper.html()).toContain('spinner')
  })

  it('renders show cards on success', async () => {
    vi.spyOn(tvmazeApi, 'searchShows').mockResolvedValue([
      makeShow(1, 'Breaking Bad'),
      makeShow(2, 'Better Call Saul'),
    ])
    const wrapper = await mountPage('breaking')
    expect(wrapper.findAll('.card')).toHaveLength(2)
  })

  it('renders empty message when no results', async () => {
    vi.spyOn(tvmazeApi, 'searchShows').mockResolvedValue([])
    const wrapper = await mountPage('xyzabc')
    expect(wrapper.text()).toContain('No shows found')
  })

  it('renders error message on API failure', async () => {
    vi.spyOn(tvmazeApi, 'searchShows').mockRejectedValue(new Error('API error'))
    const wrapper = await mountPage('fail')
    expect(wrapper.text()).toContain('API error')
  })

  it('calls searchShows with the query param', async () => {
    const spy = vi.spyOn(tvmazeApi, 'searchShows').mockResolvedValue([])
    await mountPage('westworld')
    expect(spy).toHaveBeenCalledWith('westworld')
  })
})
