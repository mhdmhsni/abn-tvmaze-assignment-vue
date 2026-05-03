import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'

describe('ChevronRightIcon', () => {
  it('renders an SVG', () => {
    const wrapper = mount(ChevronRightIcon)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses default stroke-width of 2', () => {
    const wrapper = mount(ChevronRightIcon)
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('2')
  })

  it('accepts a custom stroke-width', () => {
    const wrapper = mount(ChevronRightIcon, { props: { strokeWidth: 2.5 } })
    expect(wrapper.find('svg').attributes('stroke-width')).toBe('2.5')
  })
})
