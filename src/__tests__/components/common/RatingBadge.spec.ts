import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingBadge from '@/components/common/RatingBadge.vue'

describe('RatingBadge', () => {
  it('displays rating to 1 decimal place', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 8.5 } })
    expect(wrapper.find('.rating__value').text()).toBe('8.5')
  })

  it('displays N/A when rating is null', () => {
    const wrapper = mount(RatingBadge, { props: { rating: null } })
    expect(wrapper.find('.rating__value').text()).toBe('N/A')
  })

  it('adds rating--null class when rating is null', () => {
    const wrapper = mount(RatingBadge, { props: { rating: null } })
    expect(wrapper.find('.rating--null').exists()).toBe(true)
  })

  it('does not add rating--null class when rating is provided', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 7.0 } })
    expect(wrapper.find('.rating--null').exists()).toBe(false)
  })
})
