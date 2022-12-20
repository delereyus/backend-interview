const { Item } = require('../models/item'),
  { Buyer } = require('../models/buyer'),
  { Seller } = require('../models/seller')

module.exports = (app) => {
  app.get('/items', async (req, res) => {
    res.status(200).send(await Item.find({}))
  })
  app.get('/buyers', async (req, res) => {
    res.status(200).send(await Buyer.find({}))
  })
  app.get('/sellers', async (req, res) => {
    res.status(200).send(await Seller.find({}))
  })
}
