const { Item } = require('../models/item'),
  { Buyer } = require('../models/buyer'),
  { Seller } = require('../models/seller'),
  { putUpForSale, changePrice } = require('../modules/sellerActions'),
  { getItems, reserveItem, getCart } = require('../modules/buyerActions')

module.exports = (app) => {
  app.get('/items', async (req, res) => {
    res.json(await Item.find({}))
  })
  app.get('/buyers', async (req, res) => {
    res.status(200).send(await Buyer.find({}))
  })
  app.get('/sellers', async (req, res) => {
    res.status(200).send(await Seller.find({}))
  })


  // sellerActions
  app.post('/sell', putUpForSale)

  app.put('/changeprice', changePrice)

  // buyerActions
  app.get('/items/:currency', getItems)
  app.get('/cart/:buyerId/:currency', getCart)

  app.post('/reserve', reserveItem)
}
