import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('has role="status"', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('defaults to sm size class', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.spinner--sm').exists()).toBe(true)
  })

  it('applies lg size class when prop is "lg"', () => {
    const wrapper = mount(LoadingSpinner, { props: { size: 'lg' } })
    expect(wrapper.find('.spinner--lg').exists()).toBe(true)
  })
})
