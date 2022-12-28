const { Item } = require('../models/item'),
  { Buyer } = require('../models/buyer'),
  { Seller } = require('../models/seller'),
  { PromoCode } = require('../models/promoCode'),
  { putUpForSale, changePrice } = require('../modules/sellerActions'),
  {
    getItems,
    reserveItem,
    getCart,
    finalizeSale,
    applyPromoCode
  } = require('../modules/buyerActions')

module.exports = app => {
  app.get('/items', async (req, res) => {
    res.send(await Item.find({}))
  })
  app.get('/buyers', async (req, res) => {
    res.send(await Buyer.find({}))
  })
  app.get('/sellers', async (req, res) => {
    res.send(await Seller.find({}))
  })
  app.get('/promos', async (req, res) => {
    res.send(await PromoCode.find({}))
  })

  // sellerActions
  app.post('/sell', putUpForSale)
  app.put('/changeprice', changePrice)

  // buyerActions
  app.get('/items/:currency', getItems)
  app.get('/cart/:buyerId/:currency', getCart)

  app.put('/reserve', reserveItem)
  app.put('/promo', applyPromoCode)
  app.put('/finalize', finalizeSale)
}
