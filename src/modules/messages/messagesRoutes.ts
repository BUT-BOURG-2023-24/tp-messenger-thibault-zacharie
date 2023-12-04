const express = require('express')
const router = express.Router()
const messageController = require('./messageController')
const auth = require('../../auth')

router.put('/:id', auth.checkAuth, messageController.editMessage)
router.post('/:id', auth.checkAuth, messageController.reactToMessage)
router.delete('/:id', auth.checkAuth, messageController.deleteMessage)

module.exports = router
