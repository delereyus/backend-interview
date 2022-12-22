const { Item } = require('../models/item')

const putUpForSale = async (req, res) => {
  const { sellerId, description, images, price } = req.body
  try {
    const newItem = await Item.create({ sellerId, description, images, price })
    res.json(newItem)
  } catch (err) {
    console.log(`Failed to put item up for sale with message: ${err.message}`)
    res.status(500).send('Failed to put item up for sale')
  }
}

const changePrice = async (req, res) => {
  const { itemId, newPrice, sellerId } = req.body
  try {
    const itemWithUpdatedPrice = await Item.findOneAndUpdate({ _id: itemId, sellerId }, { price: newPrice }, { new: true })
    if (!itemWithUpdatedPrice) {
      return res.status(404).send('Unable to find an item with that combination of itemId/sellerId')
    }
    res.json(itemWithUpdatedPrice)
  } catch (err) {
    console.log(`Failed to update price for itemId ${itemId} with message: ${err.message}`)
    res.status(500).send('Failed to change price on item')
  }
}

module.exports = { putUpForSale, changePrice }