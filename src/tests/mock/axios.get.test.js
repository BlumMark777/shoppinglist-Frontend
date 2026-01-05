import axios from 'axios'
import { vi } from 'vitest'

vi.mock('axios')

it('loads data with axios.get', async () => {
    axios.get.mockResolvedValue({ data: ['Apple'] })
    const res = await axios.get('/items')
    expect(res.data).toEqual(['Apple'])
})