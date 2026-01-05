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

describe('UI/DOM: Button click', () => {
    it('calls createTobuy on add button click', async () => {
        const wrapper = mount(TobuyList)

        // warten bis onMounted(load) fertig ist
        await flushPromises()

        await wrapper.find('input').setValue('Bread')
        await wrapper.find('button').trigger('click')

        expect(createTobuy).toHaveBeenCalledWith({ name: 'Bread' })
    })
})