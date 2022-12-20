const { Item } = require('../models/item'),
  { convert } = require('../utils/convert')

const getPrice = (price, buyerCurrency) => {
  return price.currency === buyerCurrency
    ? price
    : convert({ value: price.value, currency: price.currency })(buyerCurrency)
}

const getItems = async (req, res) => {
  const buyerCurrency = req.params.currency
  try {
    const items = await Item.find({}).lean(true).exec()
    const itemsInBuyersCurrency = items.map(item => {
      const newItem = { ...item, price: getPrice(item.price, buyerCurrency) }
      return newItem
    })
    res.json(itemsInBuyersCurrency)
  } catch (err) {
    console.log(`Failed to fetch items with message: ${err.message}`)
    res.status(500).send('Failed to fetch items')
  }
}

const reserveItem = async (req, res) => {
  const { itemId, buyerId } = req.body
  try {
    const reservedItem = await Item.findOneAndUpdate({ _id: itemId, potentialBuyerId: null }, { potentialBuyerId: buyerId }, { new: true })
    if (!reservedItem) {
      throw new Error('Item could not be found or is already reserved')
    }
    res.json(reservedItem)
  } catch (err) {
    console.log(`Failed to place item ${itemId} into cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to place item in cart')
  }
}

module.exports = { getItems, reserveItem }
