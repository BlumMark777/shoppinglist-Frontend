import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TobuyList from '@/components/TobuyList.vue'

// TobuyList ruft beim Mount fetchTobuys() auf -> mocken!
vi.mock('../../api/tobuyApi.js', () => ({
    fetchTobuys: vi.fn(async () => []),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),
}))

describe('Component: TobuyList renders', () => {
    it('renders TobuyList', () => {
        const wrapper = mount(TobuyList)
        expect(wrapper.text()).toContain('Meine Einkaufsliste')
    })
})