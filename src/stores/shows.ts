import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getShows } from '@/api/tvmaze'
import type { FetchStatus, Show } from '@/types'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<Show[]>([])
  const currentPage = ref(0)
  const status = ref<FetchStatus>('idle')
  const hasMore = ref(true)
  const error = ref<string | null>(null)

  const showsByGenre = computed((): Map<string, Show[]> => {
    const map = new Map<string, Show[]>()

    for (const show of shows.value) {
      for (const genre of show.genres) {
        const list = map.get(genre) ?? []
        list.push(show)
        map.set(genre, list)
      }
    }

    for (const genreShows of map.values()) {
      genreShows.sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
    }
    return map
  })

  const sortedGenres = computed((): string[] =>
    [...showsByGenre.value.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([genre]) => genre),
  )

  async function fetchNextPage(): Promise<void> {
    if (status.value === 'loading' || !hasMore.value) return
    status.value = 'loading'
    error.value = null

    try {
      const newShows = await getShows(currentPage.value)
      if (newShows.length === 0) {
        hasMore.value = false
      } else {
        shows.value.push(...newShows)
        currentPage.value++
      }
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load shows'
      status.value = 'error'
    }
  }

  return {
    shows,
    currentPage,
    status,
    hasMore,
    error,
    showsByGenre,
    sortedGenres,
    fetchNextPage,
  }
})
