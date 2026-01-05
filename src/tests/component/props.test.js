import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TobuyItem from '@/components/TobuyItem.vue'

describe('Component: props', () => {
    it('displays passed prop entry.name', () => {
        const wrapper = mount(TobuyItem, {
            props: {
                entry: { name: 'Milk' },
            },
        })
        expect(wrapper.text()).toContain('Milk')
    })
})