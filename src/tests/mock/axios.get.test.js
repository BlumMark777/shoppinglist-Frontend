import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TobuyList from "@/components/TobuyList.vue";
import { fetchTobuys } from "../../api/tobuyApi.js";
import { beforeEach, afterEach } from "vitest";

let consoleErrorSpy;

beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

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

describe("Error handling: TobuyList", () => {
    it("calls fetchTobuys even if it fails", async () => {
        fetchTobuys.mockRejectedValueOnce(new Error("boom"));
        mount(TobuyList);
        await flushPromises();

        expect(fetchTobuys).toHaveBeenCalledTimes(1);
    });

    it("does not crash the component when fetchTobuys fails", async () => {
        fetchTobuys.mockRejectedValueOnce(new Error("boom"));
        const wrapper = mount(TobuyList);
        await flushPromises();

        // Wenn es crasht, wäre wrapper.html() nicht erreichbar / Test würde vorher abbrechen
        expect(wrapper.exists()).toBe(true);
        // Optional: UI ist weiterhin da
        expect(wrapper.text()).toContain("Meine Einkaufsliste");
    });
});