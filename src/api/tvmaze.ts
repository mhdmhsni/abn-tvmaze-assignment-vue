import type { Show, CastMember, Season, ShowImage } from '@/types'

const BASE_URL = 'https://api.tvmaze.com'

export async function getShows(page: number): Promise<Show[]> {
  const response = await fetch(`${BASE_URL}/shows?page=${page}`)
  if (response.status === 404) return []
  if (!response.ok) {
    throw new Error(`Failed to fetch shows: ${response.statusText}`)
  }
  return response.json() as Promise<Show[]>
}

export async function getShowById(id: number): Promise<Show> {
  const response = await fetch(`${BASE_URL}/shows/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch show: ${response.statusText}`)
  }
  return response.json() as Promise<Show>
}

export async function getShowCast(id: number): Promise<CastMember[]> {
  const response = await fetch(`${BASE_URL}/shows/${id}/cast`)
  if (!response.ok) {
    throw new Error(`Failed to fetch cast: ${response.statusText}`)
  }
  return response.json() as Promise<CastMember[]>
}

export async function getShowSeasons(id: number): Promise<Season[]> {
  const response = await fetch(`${BASE_URL}/shows/${id}/seasons`)
  if (!response.ok) {
    throw new Error(`Failed to fetch seasons: ${response.statusText}`)
  }
  return response.json() as Promise<Season[]>
}

export async function getShowImages(id: number): Promise<ShowImage[]> {
  const response = await fetch(`${BASE_URL}/shows/${id}/images`)
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`)
  }
  return response.json() as Promise<ShowImage[]>
}

export async function searchShows(query: string): Promise<Show[]> {
  const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error(`Failed to search shows: ${response.statusText}`)
  }
  const results = (await response.json()) as { score: number; show: Show }[]
  return results.map((r) => r.show)
}
