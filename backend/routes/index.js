const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => res.json({"status": "API Running"}))

module.exports = routes