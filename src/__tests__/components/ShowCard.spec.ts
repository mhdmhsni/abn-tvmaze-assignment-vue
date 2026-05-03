import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ShowCard from '@/components/shows/ShowCard.vue'
import type { Show } from '@/types'

const mockShow: Show = {
  id: 42,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  rating: { average: 9.2 },
  image: { medium: 'https://example.com/poster.jpg', original: 'https://example.com/poster.jpg' },
  summary: '<p>A chemistry teacher turns to crime.</p>',
  premiered: '2008-01-20',
  network: { name: 'AMC' },
  webChannel: null,
}

describe('ShowCard', () => {
  const mountCard = (show: Show = mockShow) =>
    mount(ShowCard, {
      props: { show },
      global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
    })

  it('renders poster image with correct src', () => {
    const wrapper = mountCard()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image!.medium)
  })

  it('renders placeholder when image is null', () => {
    const wrapper = mountCard({ ...mockShow, image: null })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.card__placeholder').exists()).toBe(true)
  })

  it('renders show title', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.card__title').text()).toBe('Breaking Bad')
  })

  it('renders RatingBadge with the correct rating value', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('9.2')
  })

  it('emits select with the show id on click', async () => {
    const wrapper = mountCard()
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[42]])
  })

  it('emits select with the show id on Enter key', async () => {
    const wrapper = mountCard()
    await wrapper.trigger('keydown.enter')
    expect(wrapper.emitted('select')).toEqual([[42]])
  })
})
