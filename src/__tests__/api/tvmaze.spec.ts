import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getShows,
  getShowById,
  getShowCast,
  getShowSeasons,
  getShowImages,
  searchShows,
} from '@/api/tvmaze'

function mockFetch(data: unknown, status = 200) {
  return vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 404 ? 'Not Found' : 'Server Error',
    json: () => Promise.resolve(data),
  } as Response)
}

describe('tvmaze API', () => {
  beforeEach(() => vi.restoreAllMocks())

  describe('getShows', () => {
    it('returns shows on success', async () => {
      mockFetch([{ id: 1 }])
      expect(await getShows(0)).toEqual([{ id: 1 }])
    })

    it('returns empty array on 404', async () => {
      mockFetch(null, 404)
      expect(await getShows(99)).toEqual([])
    })

    it('throws on non-ok response', async () => {
      mockFetch(null, 500)
      await expect(getShows(0)).rejects.toThrow('Failed to fetch shows')
    })
  })

  describe('getShowById', () => {
    it('returns show data', async () => {
      mockFetch({ id: 42, name: 'Test' })
      expect(await getShowById(42)).toEqual({ id: 42, name: 'Test' })
    })

    it('throws on error', async () => {
      mockFetch(null, 500)
      await expect(getShowById(42)).rejects.toThrow('Failed to fetch show')
    })
  })

  describe('getShowCast', () => {
    it('returns cast data', async () => {
      mockFetch([{ person: { id: 1 } }])
      expect(await getShowCast(1)).toEqual([{ person: { id: 1 } }])
    })

    it('throws on error', async () => {
      mockFetch(null, 500)
      await expect(getShowCast(1)).rejects.toThrow('Failed to fetch cast')
    })
  })

  describe('getShowSeasons', () => {
    it('returns seasons data', async () => {
      mockFetch([{ id: 1, number: 1 }])
      expect(await getShowSeasons(1)).toEqual([{ id: 1, number: 1 }])
    })

    it('throws on error', async () => {
      mockFetch(null, 500)
      await expect(getShowSeasons(1)).rejects.toThrow('Failed to fetch seasons')
    })
  })

  describe('getShowImages', () => {
    it('returns images data', async () => {
      mockFetch([{ id: 1, type: 'banner' }])
      expect(await getShowImages(1)).toEqual([{ id: 1, type: 'banner' }])
    })

    it('throws on error', async () => {
      mockFetch(null, 500)
      await expect(getShowImages(1)).rejects.toThrow('Failed to fetch images')
    })
  })

  describe('searchShows', () => {
    it('maps results to shows', async () => {
      mockFetch([{ score: 0.9, show: { id: 5, name: 'Breaking Bad' } }])
      expect(await searchShows('breaking')).toEqual([{ id: 5, name: 'Breaking Bad' }])
    })

    it('returns empty array when no results', async () => {
      mockFetch([])
      expect(await searchShows('zzz')).toEqual([])
    })

    it('throws on error', async () => {
      mockFetch(null, 500)
      await expect(searchShows('x')).rejects.toThrow('Failed to search shows')
    })
  })
})
