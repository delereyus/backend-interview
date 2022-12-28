const { model, Schema } = require('mongoose'),
  { priceSchema } = require('./item')

const promoCodeSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: priceSchema, required: true }
})

module.exports = { PromoCode: model('PromoCode', promoCodeSchema) }
