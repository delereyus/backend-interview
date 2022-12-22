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
  if (status !== StatusEnum.open && !status.reservedBy && !status.soldTo) {
    throw new Error('Validation failed for field "status"')
  }
}

const statusSetter = status => {
  validateStatus(status);
  return status === StatusEnum.open
    ? StatusEnum.open
    : status?.reservedBy
      ? StatusEnum.reserved(status.reservedBy)
      : StatusEnum.sold(status.soldTo)
}

const itemSchema = new Schema({
  sellerId: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  price: { type: priceSchema, required: true },
  status: { type: any, set: statusSetter, default: StatusEnum.open }
})

module.exports = {
  Item: model('Item', itemSchema),
  StatusEnum
}
