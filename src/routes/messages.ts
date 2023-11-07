const express = require('express')
const router = express.Router()
const messsageController = require('../database/Mongo/Controllers/messageController')
const auth = require('../auth')

router.post('/create', auth.checkAuth, messsageController.createMessage)
router.get('/:id', auth.checkAuth, messsageController.getMessageById)
router.delete('/:id', auth.checkAuth, messsageController.deleteMessage)
router.post('/:id/edit', auth.checkAuth, messsageController.editMessage)
router.post('/:id/react', auth.checkAuth, messsageController.reactToMessage)

module.exports = router
