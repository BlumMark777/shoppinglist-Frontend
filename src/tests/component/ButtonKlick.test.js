import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import TobuyList from "@/components/TobuyList.vue";
import { createTobuy } from "../../api/tobuyApi.js";

const flushPromises = () => new Promise((r) => setTimeout(r, 0));

vi.mock("../../api/tobuyApi.js", () => ({
    fetchTobuys: vi.fn(async () => []),
    createTobuy: vi.fn(async () => ({})),
    deleteTobuy: vi.fn(async () => ({})),
    togglePurchased: vi.fn(async () => ({})),
    toggleFavorite: vi.fn(async () => ({})),

    // Dark mode + helpers
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

describe("UI/DOM: Add + favorites button behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls createTobuy when clicking the Hinzufügen button", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        await wrapper.find("input").setValue("Bread");

        // ✅ Stabil: Button per Text finden (nicht nach :not(.favorites-btn))
        const addButton = wrapper
            .findAll("button")
            .find((b) => b.text().includes("Hinzufügen"));

        expect(addButton).toBeTruthy();
        await addButton.trigger("click");

        expect(createTobuy).toHaveBeenCalledTimes(1);
        expect(createTobuy).toHaveBeenCalledWith({ name: "Bread" });
    });

    it("favorites button toggles its label", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        const favBtn = wrapper.find("button.favorites-btn");
        expect(favBtn.text()).toContain("Favoriten anzeigen");

        await favBtn.trigger("click");
        expect(favBtn.text()).toContain("Alle Produkte anzeigen");
    });
});