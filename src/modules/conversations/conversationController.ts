import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../JoiRequestValidator'

const Conversation = require('./conversationModel')
const MessageService = require('../messages/messageService')
const ConversationService = require('../conversations/conversationService')

async function getAllConversationsForUser (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.body.user
    const allConversations = await ConversationService.getAllConversationsForUser(id)

    if (!allConversations) {
      return res.status(400).send('None conversation found')
    }

    return res.status(200).json({ conversations: allConversations })
  } catch (error) {
    return res.status(500).send({ 'An error occurred while searching for conversations: ': error })
  }
}

async function createConversation (req: Request, res: Response): Promise<Response> {
  try {
    const { concernedUsersIds } = req.body

    const validationResult = JoiRequestValidatorInstance.validate(req)
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error })
    }

    const newConversation = await ConversationService.createConversation(concernedUsersIds)

    return res.status(200).json({ conversation: newConversation })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function addMessageToConversation (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { content, messageReplyId } = req.body
    const { error } = JoiRequestValidatorInstance.validate(req)
    if (error) {
      return res.status(400).json({ error })
    }

    const userId = req.body.user.id

    const newMessage = await MessageService.createMessage(id, content, userId, messageReplyId)
    const updatedConversation = await ConversationService.addMessage(id, newMessage._id)

    if (updatedConversation) {
      return res.status(200).json({ conversation: updatedConversation })
    } else {
      return res.status(404).send("The conversation couldn't be found!")
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while updating the conversation: ': error })
  }
}

async function setConversationSeenForUserAndMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { messageId, user } = req.body

    const { error } = JoiRequestValidatorInstance.validate(req)
    if (error) {
      return res.status(400).json({ error: 'Validation error' + error })
    }

    const conversation = await ConversationService.getConversationById(id)
    if (!conversation) {
      return res.status(404).json({ error: "The conversation couldn't be found!" })
    }

    const updateSeen = new Map(conversation.seen)
    updateSeen.set(user.id, messageId)

    const updated = await ConversationService.updateSeen(updateSeen)

    if (updated === 0) {
      const existingConversation = await ConversationService.getConversationById(id)
      if (existingConversation) {
        return res.status(200).send({ message: 'This seen already exist', conversation: existingConversation })
      } else {
        return res.status(400).json({ error: "The message couldn't be visualized" })
      }
    } else {
      const updatedConversation = await ConversationService.getConversationById(id)
      return res.status(200).json({ conversation: updatedConversation })
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while setting the conversation seen: ': error })
  }
}

async function deleteConversation (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).send('Nothing to delete')
    }

    const deletedConversation = await Conversation.findByIdAndRemove(id)

    if (deletedConversation) {
      return res.status(200).json({ conversation: deletedConversation })
    } else {
      return res.status(404).json({ error: "The conversation hasn't been found!" })
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred during the conversation deletion: ': error })
  }
}

module.exports = {
  getAllConversationsForUser,
  createConversation,
  addMessageToConversation,
  setConversationSeenForUserAndMessage,
  deleteConversation
}
