/* eslint-env jest */
const { validateStatus, StatusEnum } = require('../models/item')

describe('correct validation of item status', () => {
  test('Unsupported statuses are handled', () => {
    expect(validateStatus({ foo: 10, bar: 'baz' })).toBeFalsy()
    expect(validateStatus(StatusEnum.sold())).toBeFalsy()
    expect(validateStatus(StatusEnum.reserved({ foo: 10 }))).toBeFalsy()
    expect(validateStatus('open')).toBeFalsy()
  })
  test('Supported statuses are approved', () => {
    expect(validateStatus(StatusEnum.open)).toBeTruthy()
    expect(validateStatus(StatusEnum.reserved('aUser'))).toBeTruthy()
    expect(validateStatus(StatusEnum.sold('anotherUser'))).toBeTruthy()
  })
})