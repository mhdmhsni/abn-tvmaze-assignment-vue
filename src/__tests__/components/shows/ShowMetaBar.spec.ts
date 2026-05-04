import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowMetaBar from '@/components/shows/ShowMetaBar.vue'
import type { Show } from '@/types'

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: [],
  status: 'Ended',
  rating: { average: 9.2 },
  image: null,
  summary: null,
  premiered: '2008-01-20',
  ended: '2013-09-29',
  network: null,
  webChannel: null,
  language: 'English',
  type: 'Scripted',
  runtime: 47,
  schedule: { days: ['Sunday'], time: '21:00' },
  officialSite: 'https://example.com',
  externals: null,
}

describe('ShowMetaBar', () => {
  const mountBar = (show: Show = mockShow) => mount(ShowMetaBar, { props: { show } })

  it('renders language', () => {
    expect(mountBar().text()).toContain('English')
  })

  it('renders runtime in minutes', () => {
    expect(mountBar().text()).toContain('47 min')
  })

  it('renders show type', () => {
    expect(mountBar().text()).toContain('Scripted')
  })

  it('renders schedule label', () => {
    expect(mountBar().text()).toContain('Sunday at 21:00')
  })

  it('renders premiere and end dates', () => {
    const text = mountBar().text()
    expect(text).toContain('2008-01-20')
    expect(text).toContain('2013-09-29')
  })

  it('shows "present" when ended is null', () => {
    expect(mountBar({ ...mockShow, ended: null }).text()).toContain('present')
  })

  it('renders official site link', () => {
    const link = mountBar().find('.meta-bar__link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('does not render official site link when officialSite is null', () => {
    expect(mountBar({ ...mockShow, officialSite: null }).find('.meta-bar__link').exists()).toBe(
      false,
    )
  })

  it('renders network name', () => {
    expect(mountBar({ ...mockShow, network: { name: 'AMC' } }).text()).toContain('AMC')
  })

  it('falls back to webChannel name when network is null', () => {
    const show = { ...mockShow, network: null, webChannel: { name: 'Netflix' } }
    expect(mountBar(show).text()).toContain('Netflix')
  })

  it('does not render network item when both network and webChannel are null', () => {
    const show = { ...mockShow, network: null, webChannel: null }
    expect(mountBar(show).text()).not.toContain('AMC')
  })

  it('renders IMDb link with correct href', () => {
    const show = { ...mockShow, externals: { tvrage: null, thetvdb: null, imdb: 'tt0903747' } }
    const link = mountBar(show).find('a[href="https://www.imdb.com/title/tt0903747/"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('IMDb')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('does not render IMDb link when imdb is null', () => {
    const show = { ...mockShow, externals: { tvrage: null, thetvdb: null, imdb: null } }
    expect(mountBar(show).find('a[href*="imdb.com"]').exists()).toBe(false)
  })
})
