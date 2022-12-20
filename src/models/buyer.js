const { model, Schema } = require('mongoose'),
  { CurrencyEnum } = require('../utils/currency')

const buyerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  currency: { type: String, enum: CurrencyEnum, required: true },
  cart: { type: [String], default: [] }
})


module.exports = {
  Buyer: model('Buyer', buyerSchema)
}
