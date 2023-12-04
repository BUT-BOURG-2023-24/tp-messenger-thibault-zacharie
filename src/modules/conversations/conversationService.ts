const Conversation = require('./conversationModel')

const getConversationWithParticipants = async (firstParticipant: string, secondParticipant: string): Promise<any> => Conversation.findOne({
  participants: { $all: [firstParticipant, secondParticipant] }
})

const getAllConversationsForUser = async (id: string): Promise<Response> => Conversation.find({
  participants: { $in: [id] }
})

const getConversationById = async (id: string): Promise<any> => Conversation.findById(id)

const createConversation = async (concernedUsersIds: string[]): Promise<any> => {
  const newConversation = new Conversation({
    participants: concernedUsersIds
  })

  await newConversation.save()
  return newConversation
}

const addMessage = async (id: string, messageId: string): Promise<any> => {
  await Conversation.findOneAndUpdate(
    { _id: id },
    { $push: { messages: messageId } },
    { new: true }
  )
  const updatedConversation = await Conversation.findOne({ _id: id })
  return updatedConversation
}

const updateSeen = async (id: string, updateSeen: Map<string, string>): Promise<any> => {
  const { modifiedCount } = await Conversation.updateOne(
    { _id: id },
    { seen: updateSeen }
  )
  return modifiedCount
}

const deleteConversation = async (id: string): Promise<any> => Conversation.findByIdAndRemove(id)

module.exports = {
  getAllConversationsForUser,
  getConversationById,
  getConversationWithParticipants,
  createConversation,
  addMessage,
  updateSeen,
  deleteConversation
}
