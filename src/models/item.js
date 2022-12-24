const { model, Schema } = require('mongoose'),
  { Currencies } = require('../utils/currency')


const priceSchema = new Schema({
  value: { type: Number, required: true },
  currency: { type: String, enum: Object.values(Currencies), required: true },
  _id: false
})

const Status = Object.freeze(
  {
    open: 'OPEN',
    reserved: (userId, price) => ({ reserved: { userId, time: Date.now(), price } }),
    sold: (userId, price) => ({ sold: { userId, time: Date.now(), price } })
  }
)

const validPrice = price => {
  return typeof price.value === 'number' && Object.values(Currencies).includes(price.currency)
}

const validStatus = status => {
  return !!(
    status &&
    typeof status.userId === 'string' &&
    status.userId.length &&
    validPrice(status.price)
  )
}

const validateStatus = status => {
  return !!(
    status &&
    (status === Status.open ||
      validStatus(status.reserved) ||
      validStatus(status.sold)
    )
  )
}

const itemSchema = new Schema({
  sellerId: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  price: { type: priceSchema, required: true },
  status: {
    type: Schema.Types.Mixed,
    validate: { validator: validateStatus, message: 'Status must be a valid variant of "Status"' },
    default: Status.open
  },

})

itemSchema.index({ status: 1 })

module.exports = {
  Item: model('Item', itemSchema),
  Status,
  validateStatus
}
