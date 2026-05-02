import type { Show } from '../types'

const BASE_URL = 'https://api.tvmaze.com'

export async function getShows(page: number): Promise<Show[]> {
  const response = await fetch(`&{BASE_URL}/shows?page=${page}`)
  if (response.status === 404) return []
  if (!response.ok) {
    throw new Error(`Failed to fetch shows: ${response.statusText}`)
  }
  return response.json() as Promise<Show[]>
}
