import { type IMessage } from './messageModel'

const Message = require('./messageModel')

const createMessage = async (conversationId: string, content: string, userId: string, replyId: string | null): Promise<IMessage> => {
  const newMessage = new Message({
    conversationId,
    from: userId,
    content,
    postedAt: new Date(),
    replyTo: replyId
  })
  await newMessage.save()
  return newMessage
}

const getMessageById = async (id: string): Promise<IMessage> => Message.findById(id)
const deleteMessage = async (id: string): Promise<IMessage> => Message.deleteOne({ _id: id })

module.exports = {
  createMessage,
  getMessageById,
  deleteMessage
}
