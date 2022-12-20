const { Item } = require('../models/item'),
  { Buyer } = require('../models/buyer'),
  { Seller } = require('../models/seller'),
  { putUpForSale, changePrice } = require('../modules/sellerActions')

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

  app.post('/sell', putUpForSale)

  app.put('/changeprice', changePrice)
}
