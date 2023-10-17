import mongoose, { Schema, Document, Date, ObjectId } from "mongoose";
import { MongooseID } from "../../../types";

export interface IConversation extends Document {
	participants: MongooseID[],
	messages: MongooseID[],
	title: string,
	lastUpdate: Date,
	seen: Map<MongooseID, MongooseID>,
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  messages: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Message' }], 
    required: true
  },
  title: {
    type: String,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true
  },
  seen: {
    type: Map,
    of: { type: Schema.Types.ObjectId, ref: 'Message' }
  }
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;