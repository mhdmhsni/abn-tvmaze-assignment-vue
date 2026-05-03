export interface Rating {
  average: number | null
}

export interface Image {
  medium: string
  original: string
}

export interface Schedule {
  time: string
  days: string[]
}

export interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export interface Person {
  id: number
  name: string
  image: Image | null
}

export interface Character {
  id: number
  name: string
  image: Image | null
}

export interface CastMember {
  person: Person
  character: Character
}

export interface Season {
  id: number
  number: number
  episodeOrder: number | null
  premiereDate: string | null
  endDate: string | null
}

export interface ShowImage {
  id: number
  type: string
  resolutions: {
    original?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
  }
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
  ended: string | null
  network: { name: string } | null
  webChannel: { name: string } | null
  language: string | null
  type: string | null
  runtime: number | null
  schedule: Schedule | null
  officialSite: string | null
  externals: Externals | null
}

export type FetchStatus = 'idle' | 'loading' | 'error' | 'success'
