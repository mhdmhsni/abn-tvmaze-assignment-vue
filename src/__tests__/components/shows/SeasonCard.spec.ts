import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeasonCard from '@/components/shows/SeasonCard.vue'
import type { Season } from '@/types'

const mockSeason: Season = {
  id: 1,
  number: 2,
  episodeOrder: 13,
  premiereDate: '2010-03-21',
  endDate: '2010-06-13',
}

describe('SeasonCard', () => {
  it('renders the season number', () => {
    const wrapper = mount(SeasonCard, { props: { season: mockSeason } })
    expect(wrapper.find('.season-card__number').text()).toContain('2')
  })

  it('renders episode count when episodeOrder is set', () => {
    const wrapper = mount(SeasonCard, { props: { season: mockSeason } })
    expect(wrapper.find('.season-card__episodes').text()).toContain('13')
  })

  it('does not render episodes element when episodeOrder is null', () => {
    const wrapper = mount(SeasonCard, { props: { season: { ...mockSeason, episodeOrder: null } } })
    expect(wrapper.find('.season-card__episodes').exists()).toBe(false)
  })

  it('renders premiere and end dates', () => {
    const wrapper = mount(SeasonCard, { props: { season: mockSeason } })
    const dates = wrapper.find('.season-card__dates').text()
    expect(dates).toContain('2010-03-21')
    expect(dates).toContain('2010-06-13')
  })

  it('shows "?" when premiereDate is null', () => {
    const wrapper = mount(SeasonCard, {
      props: { season: { ...mockSeason, premiereDate: null, endDate: null } },
    })
    expect(wrapper.find('.season-card__dates').text()).toContain('?')
  })
})
