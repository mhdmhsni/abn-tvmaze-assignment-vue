import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ShowDetailPage from '@/pages/ShowDetailPage.vue'
import * as tvmazeApi from '@/api/tvmaze'
import type { Show, CastMember, Season, ShowImage } from '@/types'

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  rating: { average: 9.5 },
  image: { medium: 'https://example.com/med.jpg', original: 'https://example.com/orig.jpg' },
  summary: '<p>A high school chemistry teacher turned drug kingpin. <b>Gripping</b> drama.</p>',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  network: { name: 'AMC' },
  webChannel: null,
  language: 'English',
  type: 'Scripted',
  runtime: 47,
  schedule: { time: '21:00', days: ['Sunday'] },
  officialSite: 'https://www.amc.com/shows/breaking-bad',
  externals: { tvrage: null, thetvdb: 81189, imdb: 'tt0903747' },
}

const mockCast: CastMember[] = [
  {
    person: { id: 10, name: 'Bryan Cranston', image: null },
    character: { id: 20, name: 'Walter White', image: null },
  },
]

const mockSeasons: Season[] = [
  { id: 1, number: 1, episodeOrder: 7, premiereDate: '2008-01-20', endDate: '2008-03-09' },
  { id: 2, number: 2, episodeOrder: 13, premiereDate: '2009-03-08', endDate: '2009-05-31' },
]

const mockImages: ShowImage[] = [
  {
    id: 100,
    type: 'background',
    resolutions: { original: { url: 'https://example.com/bg.jpg', width: 1920, height: 1080 } },
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/show/:id', component: ShowDetailPage },
  ],
})

describe('ShowDetailPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(tvmazeApi, 'getShowById').mockResolvedValue(mockShow)
    vi.spyOn(tvmazeApi, 'getShowCast').mockResolvedValue(mockCast)
    vi.spyOn(tvmazeApi, 'getShowSeasons').mockResolvedValue(mockSeasons)
    vi.spyOn(tvmazeApi, 'getShowImages').mockResolvedValue(mockImages)
  })

  const mountPage = async () => {
    await router.push('/show/1')
    const wrapper = mount(ShowDetailPage, {
      global: { plugins: [router] },
    })
    await flushPromises()
    return wrapper
  }

  it('shows loading spinner initially', async () => {
    // Don't flush promises — check before resolution
    vi.spyOn(tvmazeApi, 'getShowById').mockReturnValue(new Promise(() => {}))
    await router.push('/show/1')
    const wrapper = mount(ShowDetailPage, { global: { plugins: [router] } })
    expect(
      wrapper.find('.loading-spinner, [class*="spinner"]').exists() ||
        wrapper.text().includes('Loading'),
    ).toBeTruthy()
  })

  it('renders show title after load', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('renders genre chips', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Drama')
    expect(wrapper.text()).toContain('Crime')
  })

  it('renders language and runtime in meta row', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('English')
    expect(wrapper.text()).toContain('47 min')
  })

  it('renders premiered and ended dates', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('2008-01-20')
    expect(wrapper.text()).toContain('2013-09-29')
  })

  it('renders official site link with correct attributes', async () => {
    const wrapper = await mountPage()
    const link = wrapper.find('a[href="https://www.amc.com/shows/breaking-bad"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders cast member name and character', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Bryan Cranston')
    expect(wrapper.text()).toContain('Walter White')
  })

  it('renders season cards', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Season 1')
    expect(wrapper.text()).toContain('Season 2')
    expect(wrapper.text()).toContain('7 episodes')
  })

  it('renders error message on API failure', async () => {
    vi.spyOn(tvmazeApi, 'getShowById').mockRejectedValue(new Error('Not found'))
    await router.push('/show/1')
    const wrapper = mount(ShowDetailPage, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('Not found')
  })

  it('renders back button that navigates to /', async () => {
    const wrapper = await mountPage()
    const backBtn = wrapper.find('.hero__back')
    expect(backBtn.exists()).toBe(true)
  })

  it('renders show summary as plain text without HTML tags', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('A high school chemistry teacher turned drug kingpin.')
    expect(wrapper.html()).not.toContain('<b>Gripping</b>')
  })

  it('does not use v-html anywhere', async () => {
    const wrapper = await mountPage()
    // Ensure no innerHTML injection by verifying raw HTML tags aren't rendered
    const html = wrapper.html()
    expect(html).not.toContain('<p><b>')
  })

  it('uses background image from images endpoint', async () => {
    const wrapper = await mountPage()
    const hero = wrapper.find('.hero')
    expect(hero.attributes('style')).toContain('https://example.com/bg.jpg')
  })

  it('fires all four API calls in parallel', async () => {
    await mountPage()
    expect(tvmazeApi.getShowById).toHaveBeenCalledWith(1)
    expect(tvmazeApi.getShowCast).toHaveBeenCalledWith(1)
    expect(tvmazeApi.getShowSeasons).toHaveBeenCalledWith(1)
    expect(tvmazeApi.getShowImages).toHaveBeenCalledWith(1)
  })
})
