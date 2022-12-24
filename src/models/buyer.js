const { model, Schema } = require('mongoose'),
  { Currencies } = require('../utils/currency')

const buyerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  currency: { type: String, enum: Object.values(Currencies), required: true }
})


module.exports = {
  Buyer: model('Buyer', buyerSchema)
}
