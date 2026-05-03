import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginationNav from '@/components/common/PaginationNav.vue'

describe('PaginationNav', () => {
  const mountNav = (currentPage: number, canGoNext: boolean) =>
    mount(PaginationNav, { props: { currentPage, canGoNext } })

  it('displays the current page number', () => {
    const wrapper = mountNav(3, true)
    expect(wrapper.find('.pagination__indicator').text()).toContain('3')
  })

  it('disables First and Prev buttons on page 1', () => {
    const wrapper = mountNav(1, true)
    const buttons = wrapper.findAll('.pagination__btn')
    expect(buttons[0].attributes('disabled')).toBeDefined()
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('enables First and Prev buttons on page > 1', () => {
    const wrapper = mountNav(2, true)
    const buttons = wrapper.findAll('.pagination__btn')
    expect(buttons[0].attributes('disabled')).toBeUndefined()
    expect(buttons[1].attributes('disabled')).toBeUndefined()
  })

  it('disables Next button when canGoNext is false', () => {
    const wrapper = mountNav(5, false)
    const buttons = wrapper.findAll('.pagination__btn')
    expect(buttons[2].attributes('disabled')).toBeDefined()
  })

  it('enables Next button when canGoNext is true', () => {
    const wrapper = mountNav(5, true)
    const buttons = wrapper.findAll('.pagination__btn')
    expect(buttons[2].attributes('disabled')).toBeUndefined()
  })

  it('emits change with next page on Next click', async () => {
    const wrapper = mountNav(2, true)
    await wrapper.findAll('.pagination__btn')[2].trigger('click')
    expect(wrapper.emitted('change')).toEqual([[3]])
  })

  it('emits change with 1 on First click', async () => {
    const wrapper = mountNav(5, true)
    await wrapper.findAll('.pagination__btn')[0].trigger('click')
    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('emits change with previous page on Prev click', async () => {
    const wrapper = mountNav(4, true)
    await wrapper.findAll('.pagination__btn')[1].trigger('click')
    expect(wrapper.emitted('change')).toEqual([[3]])
  })
})
