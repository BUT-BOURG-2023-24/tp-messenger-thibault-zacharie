import * as http from 'http'
import express, { type Express } from 'express'
import { Server } from 'socket.io'
import { type Database } from './database'
import { SocketController } from './socket/socketController'
const cors = require('cors')

const app = express()

async function makeApp (database: Database): Promise<{ app: Express, server: http.Server }> {
  app.locals.database = database
  await database.connect()

  const server = http.createServer(app)
  app.use(express.json())

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }))

  const userRoutes = require('./modules/users/userRoutes')
  const messageRoutes = require('./modules/messages/messagesRoutes')
  const conversationRoutes = require('./modules/conversations/conversationsRoutes')
  app.use('/users', userRoutes)
  app.use('/messages', messageRoutes)
  app.use('/conversations', conversationRoutes)

  const io = new Server(server, { cors: { origin: '*' } })
  const socketController = new SocketController(io, database)

  app.locals.socketController = socketController

  return { app, server }
}

export { makeApp }
