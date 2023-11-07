import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'

const Message = require('../Models/MessageModel')

async function createMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { conversationId, content } = req.body
    const { id } = req.body.user
    const { error } = JoiRequestValidatorInstance.validate(req)

    if (error) { return res.status(400).json({ error }) }

    const newMessage = new Message({
      conversationId,
      from: id,
      content,
      postedAt: new Date()
    })
    await newMessage.save()

    return res.status(200).send(newMessage)
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
};

async function getMessageById (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const message = await Message.findById(id)

    return res.status(200).send(message)
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

async function deleteMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { deletedCount } = await Message.deleteOne({ _id: id })

    if (deletedCount === 0) {
      return res.status(400).send('Message to delete not found')
    }

    return res.status(200).send('Message deleted successfully')
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

async function editMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { editContent } = req.body

    await Message.updateOne({ _id: id }, { content: editContent, edited: true })
    const message = await Message.findOne({ _id: id })

    return res.status(200).send(message)
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

async function reactToMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { reaction } = req.body
    const { user } = req.body

    const message = await Message.findById(id)
    if (!message) {
      return res.status(404).send('Message not found')
    }

    const newReactionsMap = message.reactions || new Map()
    newReactionsMap.set(user.id, reaction)

    const { modifiedCount } = await Message.updateOne({ _id: id }, { reactions: newReactionsMap })

    if (modifiedCount === 0) {
      return res.status(400).send('Already reacted with this reaction')
    }

    const updatedMessage = await Message.findById(id)
    return res.status(200).json(updatedMessage)
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

module.exports = {
  createMessage,
  getMessageById,
  deleteMessage,
  editMessage,
  reactToMessage
}
