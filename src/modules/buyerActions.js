const { Item, StatusEnum } = require('../models/item'),
  { convert } = require('../utils/convert')

const getPrice = (price, buyerCurrency) => {
  return price.currency === buyerCurrency
    ? price
    : convert({ value: price.value, currency: price.currency })(buyerCurrency)
}

const getItemInBuyersCurrency = (item, buyerCurrency) => {
  return { ...item, price: getPrice(item.price, buyerCurrency) }
}

const getItemsInBuyersCurrency = (items, buyerCurrency) => {
  return items.map(item => {
    return getItemInBuyersCurrency(item, buyerCurrency)
  })
}

const getItems = async (req, res) => {
  const buyerCurrency = req.params.currency
  try {
    const items = await Item.find({ status: StatusEnum.open }).lean(true).exec()
    const itemsInBuyersCurrency = getItemsInBuyersCurrency(items, buyerCurrency)
    res.json(itemsInBuyersCurrency)
  } catch (err) {
    console.log(`Failed to fetch items with message: ${err.message}`)
    res.status(500).send('Failed to fetch items')
  }
}

const reserveItem = async (req, res) => {
  const { itemId, buyerId, currency: buyerCurrency } = req.body
  try {
    const reservedItem = await Item.findOneAndUpdate(
      { _id: itemId, status: StatusEnum.open },
      { status: StatusEnum.reserved(buyerId) },
      { new: true, runValidators: true }).lean(true).exec()

    if (!reservedItem) {
      return res.status(404).send('Item could not be found or is already reserved')
    }
    const itemInBuyerCurrency = getItemInBuyersCurrency(reservedItem, buyerCurrency)
    res.json(itemInBuyerCurrency)
  } catch (err) {
    console.log(`Failed to place item ${itemId} into cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to place item in cart')
  }
}

const getCart = async (req, res) => {
  const { buyerId, currency: buyerCurrency } = req.params
  try {
    const itemsInCart = await Item.find({ 'status.reservedBy': buyerId }).lean(true).exec()
    const itemsInBuyersCurrency = getItemsInBuyersCurrency(itemsInCart, buyerCurrency)

    const totalCost = itemsInBuyersCurrency.reduce((total, item) => {
      total.value += item.price.value
      return total
    }, { value: 0, currency: buyerCurrency })

    res.json({ cart: itemsInBuyersCurrency, totalCost })
  } catch (err) {
    console.log(`Failed to get cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to get cart')
  }
}

module.exports = { getItems, reserveItem, getCart }
