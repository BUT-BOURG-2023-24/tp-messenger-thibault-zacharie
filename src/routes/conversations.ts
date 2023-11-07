const express = require('express')
const router = express.Router()
const conversationController = require('../database/Mongo/Controllers/conversationController')
const auth = require('../auth')

router.get('/participants', auth.checkAuth ,conversationController.getConversationWithParticipants);

router.get('/user/:id', auth.checkAuth, conversationController.getAllConversationsForUser)

router.get('/id/:id', auth.checkAuth, conversationController.getConversationById)

router.post('/create', auth.checkAuth, conversationController.createConversation)

router.put('/addMessage/:id', auth.checkAuth, conversationController.addMessageToConversation)

router.put('/setSeen/:id', auth.checkAuth, conversationController.setConversationSeenForUserAndMessage)

router.delete('/delete/:id', auth.checkAuth, conversationController.deleteConversation)

module.exports = router;