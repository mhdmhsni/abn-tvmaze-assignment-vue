import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShowsStore } from '@/stores/shows'
import * as tvmazeApi from '@/api/tvmaze'
import type { Show } from '@/types'

const mockShows: Show[] = [
  {
    id: 1,
    name: 'Show A',
    genres: ['Drama', 'Thriller'],
    status: 'Running',
    rating: { average: 8.5 },
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
  },
  {
    id: 2,
    name: 'Show B',
    genres: ['Drama', 'Comedy'],
    status: 'Ended',
    rating: { average: 7.2 },
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
  },
  {
    id: 3,
    name: 'Show C',
    genres: ['Comedy'],
    status: 'Running',
    rating: { average: 9.0 },
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
  },
]

describe('useShowsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('fetchPage replaces shows', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(mockShows)
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.shows).toHaveLength(3)
  })

  it('fetchPage navigating to page 1 replaces shows', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(mockShows)
    const store = useShowsStore()
    await store.fetchPage(0)

    const page2Shows = [{ ...mockShows[0]!, id: 10, name: 'Show X' }]
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(page2Shows)
    await store.fetchPage(1)

    expect(store.shows).toHaveLength(1)
    expect(store.shows[0]!.name).toBe('Show X')
  })

  it('sets hasMore to false when empty page returned', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce([])
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.hasMore).toBe(false)
    expect(store.shows).toHaveLength(0)
  })

  it('sets status to success after empty page', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce([])
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.status).toBe('success')
  })

  it('sets error on API failure', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockRejectedValueOnce(new Error('Network error'))
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.error).toBe('Network error')
    expect(store.status).toBe('error')
  })

  it('showsByGenre groups shows by genre', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(mockShows)
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.showsByGenre.get('Drama')).toHaveLength(2)
    expect(store.showsByGenre.get('Comedy')).toHaveLength(2)
    expect(store.showsByGenre.get('Thriller')).toHaveLength(1)
  })

  it('showsByGenre sorts shows by rating descending within each genre', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(mockShows)
    const store = useShowsStore()
    await store.fetchPage(0)
    const dramaShows = store.showsByGenre.get('Drama')!
    expect(dramaShows[0]!.rating.average!).toBeGreaterThanOrEqual(dramaShows[1]!.rating.average!)
  })

  it('canGoNext is true when hasMore is true', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce(mockShows)
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.canGoNext).toBe(true)
  })

  it('canGoNext is false when hasMore is false', async () => {
    vi.spyOn(tvmazeApi, 'getShows').mockResolvedValueOnce([])
    const store = useShowsStore()
    await store.fetchPage(0)
    expect(store.canGoNext).toBe(false)
  })

  it('does not fetch if already loading', async () => {
    const spy = vi.spyOn(tvmazeApi, 'getShows').mockResolvedValue(mockShows)
    const store = useShowsStore()
    store.$patch({ status: 'loading' })
    await store.fetchPage(0)
    expect(spy).not.toHaveBeenCalled()
  })
})
