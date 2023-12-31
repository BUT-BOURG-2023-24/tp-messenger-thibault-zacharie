import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../JoiRequestValidator'
import Reactions from '../../reactions'
const messageService = require('./messageService')

const Message = require('./messageModel')
async function deleteMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const message = await messageService.getMessageById(id)
    if (!message) {
      return res.status(404).send('Message not found')
    }

    const deletedCount = await messageService.deleteMessage(id)
    if (deletedCount === 0) {
      return res.status(400).send('Message cannot be deleted')
    }

    return res.status(200).json({ message })
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

async function editMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { newMessageContent } = req.body

    const { error } = JoiRequestValidatorInstance.validate(req)
    if (error) { return res.status(400).json({ error }) }

    await Message.findOneAndUpdate({ _id: id }, { content: newMessageContent, edited: true })
    const message = await Message.findOne({ _id: id })
    if (!message) { return res.status(404).send('Message not found') }

    return res.status(200).send({ message })
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

async function reactToMessage (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const { reaction } = req.body
    const { user } = req.body

    const { error } = JoiRequestValidatorInstance.validate(req)
    if (error) { return res.status(400).json({ error }) }

    const messageToUpdate = await Message.findById(id)
    if (!messageToUpdate) {
      return res.status(404).send('Message not found')
    }

    if (!Reactions.includes(reaction)) {
      return res.status(400).send('Reaction not found')
    }

    const newReactionsMap = messageToUpdate.reactions || new Map()
    newReactionsMap.set(user.id, reaction)

    const { modifiedCount } = await Message.updateOne({ _id: id }, { reactions: newReactionsMap })

    if (modifiedCount === 0) {
      return res.status(400).send('Already reacted with this reaction')
    }

    const message = await Message.findById(id)
    return res.status(200).json({ message })
  } catch (error) {
    return res.status(500).json({ 'Internal Server Error': error })
  }
}

module.exports = {
  deleteMessage,
  editMessage,
  reactToMessage
}
