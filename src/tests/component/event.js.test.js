import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const EmitComponent = {
    template: `<button @click="$emit('add')">Add</button>`,
}

describe('Component: emits', () => {
    it('emits add-event on click', async () => {
        const wrapper = mount(EmitComponent)
        await wrapper.find('button').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('add')
        expect(wrapper.emitted('add').length).toBe(1)
    })
})