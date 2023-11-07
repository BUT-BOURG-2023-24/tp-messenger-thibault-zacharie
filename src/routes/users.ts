const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController')
const auth = require('../auth')

router.post('/create', userController.createUser)
router.post('/login', userController.login)
router.get('/name/:username', auth.checkAuth, userController.getUserByName)
router.get('/all', auth.checkAuth, userController.getUsers)
router.get('/:id', auth.checkAuth, userController.getUserById)
router.get('/', auth.checkAuth, userController.getUsersByIds)

module.exports = router
