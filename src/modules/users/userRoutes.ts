import joiValidator from '../../middleware/joiValidator'

const express = require('express')
const router = express.Router()
const auth = require('../../auth')
const userController = require('./userController')

/* Register & login a user */
router.post(
  '/login',
  joiValidator,
  userController.createUser
)

/* Get all online users */
router.get(
  '/online',
  auth.checkAuth,
  userController.getOnlineUsers
)

module.exports = router
