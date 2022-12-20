const { Item } = require('../models/item'),
  { convert } = require('../utils/convert')

const getPrice = (price, buyerCurrency) => {
  const newPrice =
    price.currency === buyerCurrency
      ? price
      : convert({ value: price.value, currency: price.currency })(buyerCurrency)

  return newPrice
}

const seeItems = async (req, res) => {
  const buyerCurrency = req.params.currency
  // validate currency
  try {
    const items = await Item.find({}).lean(true).exec()
    const itemsInBuyersCurrency = items.map(item => {
      const newItem = { ...item, price: getPrice(item.price, buyerCurrency) };
      return newItem;
    })
    res.json(itemsInBuyersCurrency)
  } catch (err) {
    console.log(`Failed to fetch items with message: ${err.message}`)
    res.status(500).send('Failed to fetch items')
  }
}

module.exports = { seeItems }
