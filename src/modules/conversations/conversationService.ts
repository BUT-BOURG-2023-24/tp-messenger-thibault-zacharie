const Conversation = require('./conversationModel')

const getAllConversationsForUser = async (id: string): Promise<Response> => Conversation.find({
  participants: { $in: [id] }
})
const getConversationById = async (id: string): Promise<any> => Conversation.findById(id)

module.exports = {
  getAllConversationsForUser,
  getConversationById
}
