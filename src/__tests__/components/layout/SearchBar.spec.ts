import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '@/components/layout/SearchBar.vue'

describe('SearchBar', () => {
  it('does not show submit button when input is empty', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.find('.search-bar__submit').exists()).toBe(false)
  })

  it('shows submit button when input has text', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('input').setValue('breaking')
    expect(wrapper.find('.search-bar__submit').exists()).toBe(true)
  })

  it('emits search with trimmed query on form submit', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('input').setValue('  breaking bad  ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('search')).toEqual([['breaking bad']])
  })

  it('emits search with empty string when query is blank', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('input').setValue('')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('search')).toEqual([['']])
  })
})
