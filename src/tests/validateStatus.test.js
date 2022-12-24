/* eslint-env jest */
const { validateStatus, Status } = require('../models/item')

const validPrice = { value: 1337, currency: 'SEK' }
const invalidValue = { value: 'Value', currency: 'EUR' }
const invalidCurrency = { value: 100, currency: 'BlaBlaEUR' }

describe('correct validation of item status', () => {
  test('Unsupported statuses are handled', () => {
    expect(validateStatus({ foo: 10, bar: 'baz' })).toBeFalsy()
    expect(validateStatus('open')).toBeFalsy()
  })
  test('Invalid values and currencies are handled for sold and reserved statuses', () => {
    expect(validateStatus(Status.sold('aUser', invalidValue))).toBeFalsy()
    expect(validateStatus(Status.reserved('anotherUser', invalidCurrency))).toBeFalsy()
  })
  test('Supported statuses are approved', () => {
    expect(validateStatus(Status.open)).toBeTruthy()
    expect(validateStatus(Status.reserved('aUser', validPrice))).toBeTruthy()
    expect(validateStatus(Status.sold('anotherUser', validPrice))).toBeTruthy()
  })
})