import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import TobuyList from '@/components/TobuyList.vue'

vi.mock("../../api/tobuyApi.js", () => ({
    fetchTobuys: vi.fn(async () => []),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),

    // ✅ Diese Exports braucht TobuyList.vue beim Setup
    isDarkModeEnabled: vi.fn(() => false),
    setDarkModeEnabled: vi.fn(() => {}),

    // ✅ NEU: wird in computed() benutzt
    filterTobuys: vi.fn((items, query) => {
        const q = (query ?? "").toString().toLowerCase().trim();
        if (!q) return items;
        return items.filter((it) =>
            (it?.name ?? "").toString().toLowerCase().includes(q)
        );
    }),
}));
describe('Integration: App renders TobuyList', () => {
    it('contains TobuyList component', () => {
        const wrapper = mount(App)
        expect(wrapper.findComponent(TobuyList).exists()).toBe(true)
    })
})