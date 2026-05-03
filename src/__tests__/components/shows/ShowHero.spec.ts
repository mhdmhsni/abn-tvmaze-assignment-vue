import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowHero from '@/components/shows/ShowHero.vue'
import type { Show } from '@/types'

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  rating: { average: 9.2 },
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
}

describe('ShowHero', () => {
  const mountHero = (show: Show | null = mockShow, heroImage: string | null = null) =>
    mount(ShowHero, { props: { show, heroImage } })

  it('renders show title', () => {
    const wrapper = mountHero()
    expect(wrapper.find('.hero__title').text()).toBe('Breaking Bad')
  })

  it('renders genre chips', () => {
    const wrapper = mountHero()
    const chips = wrapper.findAll('.hero__genre-chip')
    expect(chips).toHaveLength(2)
    expect(chips[0].text()).toBe('Drama')
    expect(chips[1].text()).toBe('Crime')
  })

  it('sets background-image style when heroImage is provided', () => {
    const wrapper = mountHero(mockShow, 'https://example.com/bg.jpg')
    expect(wrapper.find('.hero').attributes('style')).toContain('background-image')
  })

  it('does not set background-image style when heroImage is null', () => {
    const wrapper = mountHero(mockShow, null)
    expect(wrapper.find('.hero').attributes('style')).toBeFalsy()
  })

  it('emits back event on back button click', async () => {
    const wrapper = mountHero()
    await wrapper.find('.hero__back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })
})
