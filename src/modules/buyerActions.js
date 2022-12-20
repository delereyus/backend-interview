const { Item } = require('../models/item'),
  { convert } = require('../utils/convert')

const getPrice = (price, buyerCurrency) => {
  return price.currency === buyerCurrency
    ? price
    : convert({ value: price.value, currency: price.currency })(buyerCurrency)
}

const seeItems = async (req, res) => {
  const buyerCurrency = req.params.currency
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
