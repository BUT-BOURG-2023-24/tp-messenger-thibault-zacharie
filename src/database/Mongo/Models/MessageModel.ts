import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IMessage extends Document {
	conversationId: MongooseID,
	from: MongooseID,
	content: string,
	postedAt: Date,
	replyTo: MongooseID | null,
	edited: boolean,
	deleted: boolean,
	reactions: Map<MongooseID, string> | null,
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    required: true
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  edited: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  reactions: {
    type: Map,
    of: String,
    default: null
  }
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);


export { MessageModel, MessageSchema };
