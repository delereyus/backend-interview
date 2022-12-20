const { model, Schema } = require('mongoose'),
  { CurrencyEnum } = require('../utils/currency')

const priceSchema = { value: Number, currency: { type: String, enum: CurrencyEnum }, _id: false }

const itemSchema = new Schema({
  sellerId: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: priceSchema, required: true },
  potentialBuyerId: String
})

module.exports = {
  Item: model('Item', itemSchema)
}
