export interface Rating {
  average: number | null
}

export interface Image {
  medium: string
  original: string
}

export interface Show {
  id: number
  name: string
  genres: string[]
  status: string
  rating: Rating
  image: Image | null
  summary: string | null
  premiered: string | null
  network: { name: string } | null
  webChannel: { name: string } | null
}

export type FetchStatus = 'idle' | 'loading' | 'error' | 'success'
