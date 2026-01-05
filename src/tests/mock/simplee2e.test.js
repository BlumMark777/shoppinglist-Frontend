import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TobuyList from '@/components/TobuyList.vue'
import { createTobuy } from '../../api/tobuyApi.js'

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

vi.mock('../../api/tobuyApi.js', () => ({
    fetchTobuys: vi.fn(async () => []),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),
}))

describe('Simple E2E-like flow', () => {
    it('user can type and add an item', async () => {
        const wrapper = mount(TobuyList)
        await flushPromises()

        const input = wrapper.find('input')
        await input.setValue('Cheese')
        await wrapper.find('button').trigger('click')

        expect(createTobuy).toHaveBeenCalledWith({ name: 'Cheese' })
    })
})