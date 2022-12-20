const { model, Schema } = require('mongoose')

const itemSchema = new Schema({
  description: String,
  images: [String]
})


module.exports = {
  Item: model('Item', itemSchema)
}