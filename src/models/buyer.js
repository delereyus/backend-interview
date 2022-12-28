const { model, Schema } = require('mongoose'),
  { priceSchema } = require('./item'),
  { Currencies } = require('../utils/currency')

const purchase = {
  itemIds: { type: [String], required: true },
  totalCost: { type: priceSchema, required: true }
}

const buyerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  currency: { type: String, enum: Object.values(Currencies), required: true },
  usedPromoCodeIds: { type: [String], default: [] },
  purchases: { type: [purchase], default: [] }
})

module.exports = {
  Buyer: model('Buyer', buyerSchema)
}
