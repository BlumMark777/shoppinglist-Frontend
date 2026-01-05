import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import TobuyList from '@/components/TobuyList.vue'

vi.mock('../../api/tobuyApi.js', () => ({
    fetchTobuys: vi.fn(async () => []),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),
}))

describe('Integration: App renders TobuyList', () => {
    it('contains TobuyList component', () => {
        const wrapper = mount(App)
        expect(wrapper.findComponent(TobuyList).exists()).toBe(true)
    })
})