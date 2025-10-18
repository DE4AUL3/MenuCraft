import { COLORS } from '@/config/colors'

describe('smoke', () => {
  it('COLORS has required keys', () => {
    expect(COLORS).toHaveProperty('background')
    expect(COLORS).toHaveProperty('surface')
    expect(COLORS).toHaveProperty('border')
    expect(COLORS).toHaveProperty('text')
  })
})
