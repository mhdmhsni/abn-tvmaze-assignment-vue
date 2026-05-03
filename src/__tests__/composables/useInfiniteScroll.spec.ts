import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

class MockIntersectionObserver {
  constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
    intersectionCallback = cb
  }
  observe = mockObserve
  disconnect = mockDisconnect
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    mockObserve.mockClear()
    mockDisconnect.mockClear()
  })

  it('calls callback when sentinel is intersecting', () => {
    const callback = vi.fn()
    const sentinel = ref<HTMLElement | null>(document.createElement('div'))
    const TestComponent = {
      setup() {
        useInfiniteScroll(sentinel, callback)
        return {}
      },
      template: '<div />',
    }
    mount(TestComponent)
    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry])
    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not call callback when not intersecting', () => {
    const callback = vi.fn()
    const sentinel = ref<HTMLElement | null>(document.createElement('div'))
    const TestComponent = {
      setup() {
        useInfiniteScroll(sentinel, callback)
        return {}
      },
      template: '<div />',
    }
    mount(TestComponent)
    intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry])
    expect(callback).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const sentinel = ref<HTMLElement | null>(document.createElement('div'))
    const TestComponent = {
      setup() {
        useInfiniteScroll(sentinel, vi.fn())
        return {}
      },
      template: '<div />',
    }
    const wrapper = mount(TestComponent)
    wrapper.unmount()
    expect(mockDisconnect).toHaveBeenCalledOnce()
  })
})
