import { describe, it, expect } from 'vitest'

describe('Unit Test: add()', () => {
    it('adds two numbers', () => {
        const add = (a, b) => a + b
        expect(add(2, 3)).toBe(5)
    })
})