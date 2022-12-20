const { model, Schema } = require('mongoose'),
  { CurrencyEnum } = require('../utils/currency')

const priceSchema = {
  value: { type: Number, required: true },
  currency: { type: String, enum: CurrencyEnum, required: true },
  _id: false
}

const itemSchema = new Schema({
  sellerId: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  price: { type: priceSchema, required: true },
  potentialBuyerId: {type: String, default: null}
})

module.exports = {
  Item: model('Item', itemSchema)
}
