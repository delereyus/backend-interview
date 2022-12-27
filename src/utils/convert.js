const CONVERSION_RATES = {
  SEK: {
    EUR: 0.1,
    DKK: 0.7
  },
  EUR: {
    SEK: 1 / 0.1,
    DKK: 1 / 0.13
  },
  DKK: {
    SEK: 1 / 0.7,
    EUR: 0.13
  }
}

const convert =
  ({ value, currency }) =>
  toCurrency => {
    if (!value || !currency)
      throw new Error('value and currency is required for conversion')
    const rate = CONVERSION_RATES[currency]?.[toCurrency]
    if (!rate) throw new Error('Non-supported currency')
    return { value: Math.round(value * rate * 100) / 100, currency: toCurrency }
  }

module.exports = {
  convert
}
