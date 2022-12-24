const { Item, Status } = require('../models/item'),
  { convert } = require('../utils/convert')

const getPrice = (price, buyerCurrency) => {
  return price.currency === buyerCurrency
    ? price
    : convert(price)(buyerCurrency)
}

const getItems = async (req, res) => {
  const buyerCurrency = req.params.currency
  try {
    const items = await Item.find({ status: Status.open }).lean().exec()
    const itemsInBuyersCurrency = items.map(item => ({ ...item, price: getPrice(item.price, buyerCurrency) }))

    res.json(itemsInBuyersCurrency)
  } catch (err) {
    console.log(`Failed to fetch items with message: ${err.message}`)
    res.status(500).send('Failed to fetch items')
  }
}

const reserveItem = async (req, res) => {
  const { itemId, buyerId, currency: buyerCurrency } = req.body
  try {
    /* To avoid users manipulating the price of items in the cart by changing their 'home' currency,
    In a real app I guess this would be handled by either:
    not letting the user switch currency with items still in the cart,
    or clearing the cart upon switching currency */
    const reservedItemsWithDifferentCurrency = await Item.find(
      {
        'status.reserved.userId': buyerId,
        'status.reserved.price.currency': { $ne: buyerCurrency }
      }).lean().exec()
    if (reservedItemsWithDifferentCurrency.length) {
      return res.status(400).send('All items in a cart must be in the same currency')
    }

    const itemToReserve = await Item.findOne({ _id: itemId }).lean().exec()
    const reservedItem = await Item.findOneAndUpdate(
      { _id: itemId, status: Status.open },
      { status: Status.reserved(buyerId, getPrice(itemToReserve.price, buyerCurrency)) },
      { new: true, runValidators: true }).lean().exec()

    if (!reservedItem) {
      return res.status(404).send('Item could not be found or is already reserved')
    }

    res.json(reservedItem)
  } catch (err) {
    console.log(`Failed to place item ${itemId} into cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to place item in cart')
  }
}

const getCart = async (req, res) => {
  const { buyerId, currency: buyerCurrency } = req.params
  try {
    const itemsInCart = await Item.find({ 'status.reserved.userId': buyerId }).lean().exec()

    const totalCost = itemsInCart.reduce((total, item) => {
      total.value += item.status.reserved.price.value
      return total
    }, { value: 0, currency: itemsInCart[0]?.status.reserved.price.currency || buyerCurrency })

    res.json({ cart: itemsInCart, totalCost })
  } catch (err) {
    console.log(`Failed to get cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to get cart')
  }
}

module.exports = { getItems, reserveItem, getCart }
