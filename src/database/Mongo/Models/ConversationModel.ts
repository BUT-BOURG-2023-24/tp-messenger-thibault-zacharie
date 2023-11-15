import mongoose, { Schema, type Document, Date } from 'mongoose'
import { type MongooseID } from '../../../types'

export interface IConversation extends Document {
  participants: MongooseID[]
  messages: MongooseID[]
  title: string
  lastUpdate: Date
  seen: Map<MongooseID, MongooseID>
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  messages: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
  },
  title: {
    type: String
  },
  lastUpdate: {
    type: Date
  },
  seen: {
    type: Map,
    of: { type: Schema.Types.ObjectId, ref: 'Message' }
  }
})

const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema)

module.exports = ConversationModel
