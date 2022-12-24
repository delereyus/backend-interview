const crypto = require('crypto'),
  { MongoMemoryServer } = require('mongodb-memory-server'),
  mongoose = require('mongoose'),
  { Item } = require('./models/item'),
  { Seller } = require('./models/seller'),
  { Buyer } = require('./models/buyer'),
  { Currencies } = require('./utils/currency')

const DB_NAME = 'DemoDB'

const initiateDb = async () => {
  const mongod = new MongoMemoryServer({
    instance: {
      dbName: DB_NAME,
      dbPath: 'data',
      storageEngine: 'wiredTiger'
    }
  })
  await mongod.start()
  return mongod
}

const initiateMongoose = async () => {
  const mongod = await initiateDb()
  const uri = mongod.getUri()
  await mongoose.connect(uri, { dbName: DB_NAME })
  console.log('Connected to db', uri)
  return mongod
}

const dropDb = async () => {
  const mongod = await initiateMongoose()
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
  console.log('Database dropped')
}

const createInitialItems = async () => {
  return Promise.all([
    Item.create({ description: 'A very nice button-down shirt', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`], sellerId: 'initialSellerId', price: { value: 70, currency: Currencies.eur } }),
    Item.create({ description: 'A pair of pants', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`], sellerId: 'initialSellerId', price: { value: 500, currency: Currencies.dkk } }),
    Item.create({ description: 'This is a dress', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`], sellerId: 'initialSellerId', price: { value: 800, currency: Currencies.sek } })
  ])
}

const createInitialUsers = async () => {
  return Promise.all([
    Seller.create({ userName: 'mrSeller', firstName: 'Seller', lastName: 'Sellerson' }),
    Buyer.create({ userName: 'mrBuyer', firstName: 'Buyer', lastName: 'Buyerson', currency: Currencies.sek })
  ])
}

const createInitialData = async () => {
  if ((await Item.find({})).length === 0) {
    await Promise.all([createInitialItems(), createInitialUsers()])
    console.log('Finished creating initial data')
  }
}

module.exports = {
  initiateDb,
  initiateMongoose,
  dropDb,
  createInitialData
}