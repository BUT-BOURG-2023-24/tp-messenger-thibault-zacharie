const express = require('express')
const router = express.Router()
const conversationController = require('../database/Mongo/Controllers/conversationController')
const auth = require('../auth')

router.get('/participants', auth.checkAuth, conversationController.getConversationWithParticipants)

router.get('/', auth.checkAuth, conversationController.getAllConversationsForUser)

router.get('/id/:id', auth.checkAuth, conversationController.getConversationById)

router.post('/', auth.checkAuth, conversationController.createConversation)

router.post('/:id', auth.checkAuth, conversationController.addMessageToConversation)

router.post('/see/:id', auth.checkAuth, conversationController.setConversationSeenForUserAndMessage)

router.delete('/:id', auth.checkAuth, conversationController.deleteConversation)

module.exports = router
