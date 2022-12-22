const { model, Schema } = require('mongoose'),
  { CurrencyEnum } = require('../utils/currency')

const priceSchema = {
  value: { type: Number, required: true },
  currency: { type: String, enum: CurrencyEnum, required: true },
  _id: false
}

const StatusEnum = Object.freeze(
  {
    open: 'OPEN',
    reserved: userId => ({ reservedBy: userId }),
    sold: userId => ({ soldTo: userId })
  }
)

const validateStatus = status => {
  return !!(
    status === StatusEnum.open ||
    (typeof status?.reservedBy === 'string' && status.reservedBy.length) ||
    (typeof status?.soldTo === 'string' && status.soldTo.length)
  )
}

const itemSchema = new Schema({
  sellerId: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  price: { type: priceSchema, required: true },
  status: {
    type: Schema.Types.Mixed,
    validate: { validator: validateStatus, message: 'Status must be a valid variant found in "StatusEnum"' },
    default: StatusEnum.open
  }
})

module.exports = {
  Item: model('Item', itemSchema),
  StatusEnum,
  validateStatus
}
