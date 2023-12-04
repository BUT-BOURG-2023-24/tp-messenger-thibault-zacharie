import express from 'express'
const router = express.Router()
const conversationController = require('../modules/conversations/conversationController')
const auth = require('../auth')

router.post('/', auth.checkAuth, conversationController.createConversation)
router.get('/', auth.checkAuth, conversationController.getAllConversationsForUser)
router.delete('/:id', auth.checkAuth, conversationController.deleteConversation)
router.post('/see/:id', auth.checkAuth, conversationController.setConversationSeenForUserAndMessage)
router.post('/:id', auth.checkAuth, conversationController.addMessageToConversation)

module.exports = router
