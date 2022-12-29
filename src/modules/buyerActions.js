const { Item, Status } = require('../models/item'),
  { PromoCode } = require('../models/promoCode'),
  { Buyer } = require('../models/buyer'),
  { convert } = require('../utils/convert')

const applyPromo = (promoCode, totalCost) => {
  const discount = convert(promoCode.discount)(totalCost.currency)
  return { ...totalCost, value: totalCost.value - discount.value }
}

const getItems = async (req, res) => {
  const buyerCurrency = req.params.currency
  try {
    const items = await Item.find({ status: Status.open }).lean().exec()
    const itemsInBuyersCurrency = items.map(item => ({
      ...item,
      price: convert(item.price)(buyerCurrency)
    }))

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
    const reservedItemsWithDifferentCurrency = await Item.find({
      'status.reserved.userId': buyerId,
      'status.reserved.price.currency': { $ne: buyerCurrency }
    })
      .lean()
      .exec()
    if (reservedItemsWithDifferentCurrency.length) {
      return res.status(400).send('All items in a cart must be in the same currency')
    }

    const itemToReserve = await Item.findOne({ _id: itemId }).lean().exec()
    const reservedItem = await Item.findOneAndUpdate(
      { _id: itemId, status: Status.open },
      { status: Status.reserved(buyerId, convert(itemToReserve.price)(buyerCurrency)) },
      { new: true, runValidators: true }
    )
      .lean()
      .exec()

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

    const totalCost = itemsInCart.reduce(
      (total, item) => {
        total.value += item.status.reserved.price.value
        return total
      },
      { value: 0, currency: itemsInCart[0]?.status.reserved.price.currency || buyerCurrency }
    )

    res.json({ cart: itemsInCart, totalCost })
  } catch (err) {
    console.log(`Failed to get cart for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to get cart')
  }
}

const applyPromoCode = async (req, res) => {
  const { buyerId, promoCode, totalCost } = req.body

  try {
    const [buyer, promo] = await Promise.all([
      Buyer.findOne({ _id: buyerId }, { usedPromoCodeIds: 1 }).lean().exec(),
      PromoCode.findOne({ code: promoCode }).lean().exec()
    ])

    if (!promo || buyer.usedPromoCodeIds.includes(`${promo._id}`)) {
      return res.status(404).send('Invalid promo code')
    }

    const totalCostAfterDiscount = applyPromo(promo, totalCost)
    res.json({ promo, newPrice: totalCostAfterDiscount })
  } catch (err) {
    console.log(`Failed to apply promo code ${promoCode} for buyer ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to apply promo code')
  }
}

const finalizeSale = async (req, res) => {
  const { buyerId, itemIds, totalCost, promoCodeId } = req.body

  try {
    const itemsInCart = await Item.find({ _id: { $in: itemIds } })
      .lean()
      .exec()
    if (!itemsInCart.length) {
      return res.status(404).send('Cart is empty')
    }

    const updates = itemsInCart.map(item => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { status: Status.sold(buyerId, item.status.reserved.price) }
        }
      }
    })

    const pushes = {
      purchases: { itemIds, totalCost }
    }
    if (promoCodeId) {
      pushes.usedPromoCodeIds = promoCodeId
    }

    await Promise.all([
      Item.bulkWrite(updates, { runValidators: true }),
      Buyer.updateOne(
        { _id: buyerId },
        {
          $push: pushes
        }
      )
    ])

    const soldItems = await Item.find({ _id: { $in: itemIds } })
    res.json({ soldItems })
  } catch (err) {
    console.log(`Failed to finalize purchase for user ${buyerId} with message: ${err.message}`)
    res.status(500).send('Failed to finalize purchase')
  }
}

module.exports = {
  getItems,
  reserveItem,
  getCart,
  finalizeSale,
  applyPromoCode
}
