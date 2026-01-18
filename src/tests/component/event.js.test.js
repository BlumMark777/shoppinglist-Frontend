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

describe("Component events: favorites button", () => {
    it("adds 'active' class after click", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        const btn = wrapper.find("button.favorites-btn");
        expect(btn.classes()).not.toContain("active");

        await btn.trigger("click");
        expect(btn.classes()).toContain("active");
    });
});