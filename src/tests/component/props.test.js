import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TobuyItem from "@/components/TobuyItem.vue";

describe("Component: TobuyItem props", () => {
    it("displays passed prop entry.name", () => {
        const wrapper = mount(TobuyItem, {
            props: { entry: { name: "Milk" } },
        });
        expect(wrapper.text()).toContain("Milk");
    });

    it("renders without crashing with full-ish entry object", () => {
        const wrapper = mount(TobuyItem, {
            props: {
                entry: { id: 1, name: "Eggs", favorite: true, purchased: false },
            },
        });
        expect(wrapper.text()).toContain("Eggs");
    });
});