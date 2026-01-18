import { describe, it, expect, vi } from "vitest";
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

describe("Simple E2E-like flow", () => {
    it("user can type and add an item", async () => {
        const wrapper = mount(TobuyList);
        await flushPromises();

        await wrapper.find("input").setValue("Cheese");

        const addButton = wrapper
            .findAll("button")
            .find((b) => b.text().includes("Hinzufügen"));

        expect(addButton).toBeTruthy();
        await addButton.trigger("click");

        expect(createTobuy).toHaveBeenCalledWith({ name: "Cheese" });
    });
});