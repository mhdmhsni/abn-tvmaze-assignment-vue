import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('renders the message prop', () => {
    const wrapper = mount(ErrorMessage, { props: { message: 'Something went wrong' } })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('has role="alert"', () => {
    const wrapper = mount(ErrorMessage, { props: { message: 'Error' } })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })
})
