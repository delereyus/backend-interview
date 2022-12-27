const { model, Schema } = require('mongoose')

const sellerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})

module.exports = {
  Seller: model('Seller', sellerSchema)
}
