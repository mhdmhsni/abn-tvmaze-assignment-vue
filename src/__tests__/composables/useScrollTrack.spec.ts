import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useScrollTrack } from '@/composables/useScrollTrack'

const TestComponent = defineComponent({
  setup() {
    const { trackRef, canScrollLeft, canScrollRight, scrollBy } = useScrollTrack()
    return { trackRef, canScrollLeft, canScrollRight, scrollBy }
  },
  template: '<div ref="trackRef" />',
})

describe('useScrollTrack', () => {
  it('initialises canScrollLeft to false', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.canScrollLeft).toBe(false)
  })

  it('initialises canScrollRight to false', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.canScrollRight).toBe(false)
  })

  it('exposes a scrollBy function', () => {
    const wrapper = mount(TestComponent)
    expect(typeof wrapper.vm.scrollBy).toBe('function')
  })

  it('calls scrollBy on the track element', () => {
    const wrapper = mount(TestComponent)
    const el = wrapper.vm.trackRef as HTMLElement
    if (el) {
      el.scrollBy = vi.fn()
      wrapper.vm.scrollBy(300)
      expect(el.scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' })
    }
  })
})
