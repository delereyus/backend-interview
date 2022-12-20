const { model, Schema } = require('mongoose')

const sellerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String
})


module.exports = {
  Seller: model('Seller', sellerSchema)
}
