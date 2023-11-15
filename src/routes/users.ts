const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController')
const auth = require('../auth')

router.post('/login', userController.createUser)
router.get('/online', auth.checkAuth, userController.createUser)

module.exports = router
