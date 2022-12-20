const { Item } = require('../models/item'),
  { User } = require('../models/user')

module.exports = (app) => {
  app.get('/item', async (req, res) => {
    res.status(200).send(await Item.find({}))
  })
  app.get('/user', async (req, res) => {
    res.status(200).send(await User.find({}))
  })
}