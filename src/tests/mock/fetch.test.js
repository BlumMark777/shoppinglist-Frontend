import { describe, it, expect, vi } from "vitest";
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

describe("Mock/API interaction: loading behavior", () => {
    it("calls fetchTobuys on mount", async () => {
        fetchTobuys.mockResolvedValueOnce([]);
        mount(TobuyList);
        await flushPromises();

        expect(fetchTobuys).toHaveBeenCalledTimes(1);
    });

    it("shows empty state after fetch resolves to empty array", async () => {
        fetchTobuys.mockResolvedValueOnce([]);
        const wrapper = mount(TobuyList);
        await flushPromises();

        expect(wrapper.text()).toContain("Noch keine Einträge vorhanden");
    });
});