import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorizontalScroller from '@/components/common/HorizontalScroller.vue'

describe('HorizontalScroller', () => {
  it('renders slot content', () => {
    const wrapper = mount(HorizontalScroller, {
      slots: { default: '<span class="test-item">item</span>' },
    })
    expect(wrapper.find('.test-item').exists()).toBe(true)
  })

  it('renders the scroll track element', () => {
    const wrapper = mount(HorizontalScroller)
    expect(wrapper.find('.h-scroller__track').exists()).toBe(true)
  })

  it('applies compact class when compact prop is true', () => {
    const wrapper = mount(HorizontalScroller, { props: { compact: true } })
    expect(wrapper.find('.h-scroller__track--compact').exists()).toBe(true)
  })

  it('does not apply compact class by default', () => {
    const wrapper = mount(HorizontalScroller)
    expect(wrapper.find('.h-scroller__track--compact').exists()).toBe(false)
  })
})
