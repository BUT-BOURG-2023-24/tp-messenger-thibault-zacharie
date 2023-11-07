import mongoose, { type Schema } from 'mongoose'
import { type Database } from './database/database'
import { type SocketController } from './socket/socketController'
import { type ConversationController } from './database/Mongo/Controllers/conversationController'

export type MongooseID = Schema.Types.ObjectId | string | null

declare global {
  namespace Express {
    interface Locals {
      database: Database
      userId: MongooseID
      socketController: SocketController
    }
  }
  var Database: Database
  var conv: ConversationController?
}
