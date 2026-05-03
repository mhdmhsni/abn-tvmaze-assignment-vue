import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

describe('ChevronLeftIcon', () => {
  it('renders an SVG', () => {
    const wrapper = mount(ChevronLeftIcon)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses default stroke-width of 2', () => {
    const wrapper = mount(ChevronLeftIcon)
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('2')
  })

  it('accepts a custom stroke-width', () => {
    const wrapper = mount(ChevronLeftIcon, { props: { strokeWidth: 3 } })
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('3')
  })
})
