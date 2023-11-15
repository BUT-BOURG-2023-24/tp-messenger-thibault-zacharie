const express = require('express')
const router = express.Router()
const messsageController = require('../database/Mongo/Controllers/messageController')
const auth = require('../auth')

router.put('/:id', auth.checkAuth, messsageController.editMessage)
router.post('/:id', auth.checkAuth, messsageController.reactToMessage)
router.delete('/:id', auth.checkAuth, messsageController.deleteMessage)

module.exports = router
