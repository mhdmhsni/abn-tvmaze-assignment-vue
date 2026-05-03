import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CastCard from '@/components/shows/CastCard.vue'
import type { CastMember } from '@/types'

const mockMember: CastMember = {
  person: {
    id: 1,
    name: 'Bryan Cranston',
    image: { medium: 'https://example.com/person.jpg', original: 'https://example.com/person.jpg' },
  },
  character: { id: 10, name: 'Walter White', image: null },
}

describe('CastCard', () => {
  it('renders person name', () => {
    const wrapper = mount(CastCard, { props: { member: mockMember } })
    expect(wrapper.find('.cast-card__name').text()).toBe('Bryan Cranston')
  })

  it('renders character name', () => {
    const wrapper = mount(CastCard, { props: { member: mockMember } })
    expect(wrapper.find('.cast-card__character').text()).toBe('Walter White')
  })

  it('renders person image when available', () => {
    const wrapper = mount(CastCard, { props: { member: mockMember } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/person.jpg')
  })

  it('renders placeholder when image is null', () => {
    const noImage = { ...mockMember, person: { ...mockMember.person, image: null } }
    const wrapper = mount(CastCard, { props: { member: noImage } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.cast-card__placeholder').exists()).toBe(true)
  })
})
