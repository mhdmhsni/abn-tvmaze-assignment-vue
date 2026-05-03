import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { useShowsStore } from '@/stores/shows'
import type { Show } from '@/types'

const makeShow = (id: number, genre = 'Drama'): Show => ({
  id,
  name: `Show ${id}`,
  genres: [genre],
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

const makeRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: HomePage },
      { path: '/show/:id', component: { template: '<div />' } },
    ],
  })

describe('HomePage', () => {
  let router: ReturnType<typeof makeRouter>

  beforeEach(() => {
    vi.restoreAllMocks()
    router = makeRouter()
  })

  const mountPage = async (storeOverrides = {}, initialUrl = '/') => {
    await router.push(initialUrl)
    await router.isReady()
    const pinia = createTestingPinia({ createSpy: vi.fn, initialState: { shows: storeOverrides } })
    return mount(HomePage, {
      global: { plugins: [pinia, router] },
    })
  }

  it('calls fetchPage(0) on mount when URL has no page param', async () => {
    const wrapper = await mountPage()
    const store = useShowsStore()
    await flushPromises()
    expect(store.fetchPage).toHaveBeenCalledWith(0)
  })

  it('calls fetchPage with page-1 from URL on mount', async () => {
    const wrapper = await mountPage({}, '/?page=3')
    const store = useShowsStore()
    await flushPromises()
    expect(store.fetchPage).toHaveBeenCalledWith(2)
  })

  it('renders genre rows for loaded shows', async () => {
    const shows = [makeShow(1, 'Drama'), makeShow(2, 'Comedy')]
    const wrapper = await mountPage({ shows, status: 'success' })
    await flushPromises()
    expect(wrapper.findAll('.genre-row')).toHaveLength(2)
  })

  it('renders loading spinner when status is loading', async () => {
    const wrapper = await mountPage({ status: 'loading' })
    expect(wrapper.find('.loading-spinner, [class*="spinner"]').exists()).toBe(true)
  })

  it('renders error message when store has an error', async () => {
    const wrapper = await mountPage({ error: 'Something went wrong', status: 'error' })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('renders First, Prev and Next pagination buttons', async () => {
    const wrapper = await mountPage({ status: 'success', shows: [makeShow(1)] })
    await flushPromises()
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Prev')
    expect(wrapper.text()).toContain('Next')
  })

  it('Prev and First buttons are disabled on page 1', async () => {
    const wrapper = await mountPage({ status: 'success', shows: [makeShow(1)] })
    await flushPromises()
    const buttons = wrapper.findAll('button')
    const prevBtn = buttons.find((b) => b.text().includes('Prev'))
    const firstBtn = buttons.find((b) => b.text().includes('First'))
    expect(prevBtn?.attributes('disabled')).toBeDefined()
    expect(firstBtn?.attributes('disabled')).toBeDefined()
  })

  it('clicking Next pushes new page to router URL', async () => {
    const wrapper = await mountPage({ hasMore: true, status: 'success', shows: [makeShow(1)] })
    await flushPromises()
    const store = useShowsStore()
    store.$patch({ hasMore: true })
    const nextBtn = wrapper.findAll('button').find((b) => b.text().includes('Next'))
    await nextBtn?.trigger('click')
    await flushPromises()
    expect(store.fetchPage).toHaveBeenCalledWith(1)
  })

  it('displays current page number from URL', async () => {
    const wrapper = await mountPage({}, '/?page=2')
    await flushPromises()
    expect(wrapper.text()).toContain('Page 2')
  })
})

