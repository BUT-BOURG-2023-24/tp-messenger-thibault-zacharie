import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'

const Conversation = require('../Models/ConversationModel')

async function getConversationWithParticipants (req: Request, res: Response): Promise<Response> {
  try {
    const { firstParticipant, secondParticipant } = req.body
    const conversation = await Conversation.findOne({
      participants: { $all: [firstParticipant, secondParticipant] }
    })
    if (conversation) {
      return res.status(200).send({ conversation })
    } else {
      return res.status(404).send("The conversation couldn't been found  for this participants !")
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send({ 'An error occurred while searching the conversation for this participants: ': error })
  }
}

async function getAllConversationsForUser (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const allConversations = await Conversation.find({
      participants: { $in: [id] }
    })
    if (allConversations) {
      return res.status(200).send({ allConversations })
    } else {
      return res.status(404).send("The conversation couldn't been found for this user !")
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while searching the conversation for this user: ': error })
  }
}

async function getConversationById (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const conversationById = await Conversation.findById(id)
    if (conversationById) {
      return res.status(200).send({ conversationById })
    } else {
      return res.status(404).send("The conversation couldn't been found !")
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while searching this conversation: ': error })
  }
}

async function createConversation (req: Request, res: Response): Promise<Response> {
  try {
    const { participants, messages, title } = req.body
    const { error } = JoiRequestValidatorInstance.validate(req)

    if (error) { return res.status(400).json({ error }) }

    const newConversation = new Conversation({
      participants,
      messages,
      title,
      lastUpdate: new Date()
    })
    await newConversation.save()

    return res.status(200).send(newConversation)
  } catch (error) {
    return res.status(500).send({ 'An error occurred while creating the conversation: ': error })
  }
}

async function addMessageToConversation (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { message } = req.body
    const { error } = JoiRequestValidatorInstance.validate(req)

    if (error) { return res.status(400).json({ error }) }

    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: id },
      { $push: { messages: message } },
      { new: true }
    )

    if (updatedConversation) {
      return res.status(200).json(updatedConversation)
    } else {
      return res.status(404).send("The conversation couldn't been found !")
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while updating the conversation: ': error })
  }
}

async function setConversationSeenForUserAndMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { user, message } = req.body
    const { error } = JoiRequestValidatorInstance.validate(req)

    if (error) { return res.status(400).json({ error }) }

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return res.status(404).send("The conversation couldn't been found !")
    }

    const updateSeen = conversation.seen || new Map()
    updateSeen.set(user.id, message)

    const { modifiedCount } = await Conversation.updateOne(
      { _id: id },
      { seen: updateSeen }
    )
    if (modifiedCount === 0) {
      return res.status(400).send("The message couldn't been visualized")
    } else {
      return res.status(200).json(conversation)
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while updating the product: ': error })
  }
}

async function deleteConversation (req: Request, res: Response): Promise<Response> {
  const { id } = req.params
  try {
    const deletedProductData = await Conversation.findByIdAndRemove(id)
    if (deletedProductData) {
      return res.status(200).send('Conversation deleted successfully.')
    } else {
      return res.status(404).send("The conversation hasn't been found !")
    }
  } catch (error) {
    return res.status(500).send({ 'An error has occurred during the suppression of the conversation: ': error })
  }
}

module.exports = {
  getConversationWithParticipants,
  getAllConversationsForUser,
  getConversationById,
  createConversation,
  addMessageToConversation,
  setConversationSeenForUserAndMessage,
  deleteConversation
}
