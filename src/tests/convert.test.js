/* eslint-env jest */
const { convert } = require('../utils/convert'),
  { Currencies } = require('../utils/currency')

describe('correct conversion between currencies', () => {
  test('Unsupported currencies are handled', () => {
    expect(() =>
      convert({ value: 10, currency: Currencies.sek })('NOK')
    ).toThrowError('Non-supported currency')
    expect(() =>
      convert({ value: 10, currency: 'NOK' })(Currencies.sek)
    ).toThrowError('Non-supported currency')
  })

  test('If currencies are the same, original price is returned', () => {
    const originalPrice = { value: 25, currency: Currencies.sek }
    expect(convert(originalPrice)(Currencies.sek)).toEqual(originalPrice)
  })

  test('Converts SEK <-> EUR correct', () => {
    expect(
      convert({ value: 25, currency: Currencies.sek })(Currencies.eur)
    ).toEqual({
      value: 2.5,
      currency: Currencies.eur
    })
    expect(
      convert({ value: 2.5, currency: Currencies.eur })(Currencies.sek)
    ).toEqual({
      value: 25,
      currency: Currencies.sek
    })
  })
  test('Converts SEK <-> DKK correct', () => {
    expect(
      convert({ value: 25, currency: Currencies.sek })(Currencies.dkk)
    ).toEqual({
      value: 17.5,
      currency: Currencies.dkk
    })
    expect(
      convert({ value: 17.5, currency: Currencies.dkk })(Currencies.sek)
    ).toEqual({
      value: 25,
      currency: Currencies.sek
    })
  })
  test('Converts EUR <-> DKK correct', () => {
    expect(
      convert({ value: 25, currency: Currencies.eur })(Currencies.dkk)
    ).toEqual({
      value: 192.31,
      currency: Currencies.dkk
    })
    expect(
      convert({ value: 192.31, currency: Currencies.dkk })(Currencies.eur)
    ).toEqual({
      value: 25,
      currency: Currencies.eur
    })
  })
})
