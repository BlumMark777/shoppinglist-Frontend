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

describe("Component: TobuyList renders", () => {
    it("renders the page title", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();
        expect(wrapper.text()).toContain("Meine Einkaufsliste");
    });

    it("shows empty state when there are no items", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();
        expect(wrapper.text()).toContain("Noch keine Einträge vorhanden");
    });

    it("renders items from API", async () => {
        const { fetchTobuys } = await import("../../api/tobuyApi.js");
        fetchTobuys.mockResolvedValueOnce([
            { id: 1, name: "Rice", favorite: false, purchased: false },
        ]);

        const wrapper = mount(TobuyList);
        await flushPromises();

        expect(wrapper.text()).toContain("Rice");
    });
});