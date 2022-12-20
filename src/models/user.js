const { model, Schema } = require('mongoose')

const UserTypeEnum = Object.freeze({ buyer: 'buyer', seller: 'seller' });

const userSchema = new Schema({
  userType: { type: String, required: true, enum: Object.values(UserTypeEnum) }
})


module.exports = {
  User: model('User', userSchema),
  UserTypeEnum
}