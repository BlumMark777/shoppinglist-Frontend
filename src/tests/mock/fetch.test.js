global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(['Milk', 'Eggs'])
    })
)

it('loads data with fetch', async () => {
    const res = await fetch('/api/items')
    const data = await res.json()
    expect(data.length).toBe(2)
})