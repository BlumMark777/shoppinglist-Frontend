import { describe, it, expect } from 'vitest'

describe('Unit Test: array state', () => {
    it('removes item from array', () => {
        const items = ['Milk', 'Eggs']
        items.splice(0, 1)
        expect(items).toEqual(['Eggs'])
    })
})