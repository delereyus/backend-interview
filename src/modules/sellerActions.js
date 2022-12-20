const { Item } = require('../models/item')

const putUpForSale = async (req, res) => {
  const { sellerId, description, images, price } = req.body

  try {
    await Item.create({ sellerId, description, images, price })
    res.status(200).send('Success')
  } catch (err) {
    console.log(`Failed to put item up for sale with message: ${err.message}`)
    res.status(500).send('Failed to put item up for sale')
  }
}

const changePrice = async (req, res) => {
  const { itemId, newPrice } = req.body

  try {
    const itemWithUpdatedPrice = await Item.findOneAndUpdate({ _id: itemId }, { price: newPrice }, { new: true })
    res.json(itemWithUpdatedPrice)
  } catch (err) {
    console.log(`Failed to update price for itemId ${itemId} with message: ${err.message}`)
    res.status(500).send('Failed to change price on item')
  }
}

module.exports = { putUpForSale, changePrice }