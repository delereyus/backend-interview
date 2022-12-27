/* eslint-env jest */
const { convert } = require('../utils/convert')

describe('correct conversion between currencies', () => {
  test('Unsupported currencies are handled', () => {
    expect(() => convert({ value: 10, currency: 'SEK' })('NOK')).toThrowError(
      'Non-supported currency'
    )
    expect(() => convert({ value: 10, currency: 'NOK' })('SEK')).toThrowError(
      'Non-supported currency'
    )
  })

  test('Converts SEK <-> EUR correct', () => {
    expect(convert({ value: 25, currency: 'SEK' })('EUR')).toEqual({
      value: 2.5,
      currency: 'EUR'
    })
    expect(convert({ value: 2.5, currency: 'EUR' })('SEK')).toEqual({
      value: 25,
      currency: 'SEK'
    })
  })
  test('Converts SEK <-> DKK correct', () => {
    expect(convert({ value: 25, currency: 'SEK' })('DKK')).toEqual({
      value: 17.5,
      currency: 'DKK'
    })
    expect(convert({ value: 17.5, currency: 'DKK' })('SEK')).toEqual({
      value: 25,
      currency: 'SEK'
    })
  })
  test('Converts EUR <-> DKK correct', () => {
    expect(convert({ value: 25, currency: 'EUR' })('DKK')).toEqual({
      value: 192.31,
      currency: 'DKK'
    })
    expect(convert({ value: 192.31, currency: 'DKK' })('EUR')).toEqual({
      value: 25,
      currency: 'EUR'
    })
  })
})
