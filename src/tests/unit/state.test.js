import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import TobuyList from "@/components/TobuyList.vue";
import { fetchTobuys } from "../../api/tobuyApi.js";

const flushPromises = () => new Promise((r) => setTimeout(r, 0));

vi.mock("../../api/tobuyApi.js", () => ({
    fetchTobuys: vi.fn(),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),

    isDarkModeEnabled: vi.fn(() => false),
    setDarkModeEnabled: vi.fn(() => {}),
    toggleDarkMode: vi.fn(() => false),

    filterTobuys: vi.fn((items, query) => {
        const q = (query ?? "").toString().toLowerCase().trim();
        if (!q) return items;
        return items.filter((it) =>
            (it?.name ?? "").toString().toLowerCase().includes(q)
        );
    }),
}));

describe("Unit-ish: favorites state/filter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fetchTobuys.mockResolvedValue([
            { id: 1, name: "Milk", favorite: true, purchased: false },
            { id: 2, name: "Eggs", favorite: false, purchased: false },
        ]);
    });

    it("shows all items initially", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        expect(wrapper.text()).toContain("Milk");
        expect(wrapper.text()).toContain("Eggs");
    });

    it("filters to favorites after clicking favorites button", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        await wrapper.find("button.favorites-btn").trigger("click");

        expect(wrapper.text()).toContain("Milk");
        expect(wrapper.text()).not.toContain("Eggs");
    });

    it("toggles back to all items after clicking favorites button twice", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        const btn = wrapper.find("button.favorites-btn");
        await btn.trigger("click");
        await btn.trigger("click");

        expect(wrapper.text()).toContain("Milk");
        expect(wrapper.text()).toContain("Eggs");
    });
});