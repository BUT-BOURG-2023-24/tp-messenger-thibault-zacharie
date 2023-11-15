import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'
import { Types } from 'mongoose'
import { type IConversation } from '../Models/ConversationModel'

const Conversation = require('../Models/ConversationModel')
const Message = require('../Models/MessageModel')
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
    const { id } = req.body.user
    console.log(id)
    const allConversations = await Conversation.find({
      participants: { $in: [id] }
    })

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid conversation ID' })
    }

    if (allConversations && allConversations.length > 0) {
      const conversationsData = allConversations.map((conversation: IConversation) => ({
        _id: conversation._id,
        participants: conversation.participants,
        messages: conversation.messages,
        title: conversation.title,
        lastUpdate: conversation.lastUpdate,
        seen: conversation.seen
      }))

      return res.status(200).json({ conversations: conversationsData })
    } else {
      return res.status(400).json({ error: 'No conversations found for this user.' })
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while searching for conversations: ': error })
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
    const validationResult = JoiRequestValidatorInstance.validate(req)

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error })
    }

    const { concernedUsersIds } = req.body

    const participants = concernedUsersIds.map((userId: string) => new Types.ObjectId(userId))

    const newConversation = new Conversation({
      participants
    })

    await newConversation.save()

    return res.status(200).json({ conversation: newConversation })
  } catch (error) {
    console.error('An error occurred while creating the conversation:', error)
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

    const newMessage = new Message({
      conversationId: id,
      from: userId,
      content,
      postedAt: new Date(),
      replyTo: messageReplyId || null
    })

    await newMessage.save()

    const messageId = newMessage.id

    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: id },
      { $push: { messages: messageId } },
      { new: true }
    )

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
      return res.status(400).json({ error })
    }

    const conversation = await Conversation.findById(id)

    if (!conversation) {
      return res.status(404).json({ error: "The conversation couldn't be found!" })
    }

    const updateSeen = new Map(conversation.seen)
    updateSeen.set(user.id, messageId)

    const { modifiedCount } = await Conversation.updateOne(
      { _id: id },
      { seen: updateSeen }
    )

    if (modifiedCount === 0) {
      const existingConversation = await Conversation.findById(id)
      if (existingConversation) {
        return res.status(200).send({ message: 'This seen already exist', conversation: existingConversation })
      } else {
        return res.status(400).json({ error: "The message couldn't be visualized" })
      }
    } else {
      const updatedConversation = await Conversation.findById(id)
      return res.status(200).json({ conversation: updatedConversation })
    }
  } catch (error) {
    return res.status(500).send({ 'An error occurred while setting the conversation seen: ': error })
  }
}

async function deleteConversation (req: Request, res: Response): Promise<Response> {
  const { id } = req.params

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid conversation ID' })
  }

  try {
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
  getConversationWithParticipants,
  getAllConversationsForUser,
  getConversationById,
  createConversation,
  addMessageToConversation,
  setConversationSeenForUserAndMessage,
  deleteConversation
}
