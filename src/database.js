const crypto = require('crypto'),
  { MongoMemoryServer } = require('mongodb-memory-server'),
  mongoose = require('mongoose'),
  { Item } = require('./models/item'),
  { User, UserTypeEnum } = require('./models/user')

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
    Item.create({ description: 'A very nice button-down shirt', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`] }),
    Item.create({ description: 'A pair of pants', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`] }),
    Item.create({ description: 'This is a dress', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`] })
  ])
}

const createInitialUsers = async () => {
  return Promise.all([
    User.create({ userType: UserTypeEnum.buyer }),
    User.create({ userType: UserTypeEnum.seller })
  ])
}

const createInitialData = async () => {
  if ((await Item.find({})).length === 0) {
    await createInitialItems()
    await createInitialUsers()
    console.log('Finished creating initial data')
  }
}

module.exports = {
  initiateDb,
  initiateMongoose,
  dropDb,
  createInitialData
}