import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TobuyList from "@/components/TobuyList.vue";

const flushPromises = () => new Promise((r) => setTimeout(r, 0));

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

describe("Unit-ish: UI default state", () => {
    it("favorites button shows 'Favoriten anzeigen' initially", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        const favBtn = wrapper.find("button.favorites-btn");
        expect(favBtn.exists()).toBe(true);
        expect(favBtn.text()).toContain("Favoriten anzeigen");
    });
});