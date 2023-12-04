import type { Database } from '../database'
import { type Server, type Socket } from 'socket.io'
import { type IConversation } from '../modules/conversations/conversationModel'
import { type IMessage } from '../modules/messages/messageModel'

const conversationController = require('../modules/conversations/conversationController')

export class SocketController {
  public userSocketMap: Map<string, string> = new Map<string, string>()

  constructor (private readonly io: Server, private readonly Database: Database) {
    this.connect()
    this.listenRoomChanged()
  }

  connect (): void {
    this.io.on('connection', async (socket: Socket) => {
      const optionalUser = socket.handshake.headers.userid
      const userId = optionalUser as string
      await this.connectionToSocketRoom(userId, socket)

      this.io.emit('onConnected', { userId })

      socket.on('disconnect', async () => {
        await this.leaveAllRooms(socket.id)

        this.io.emit('onDisconnected', { userId })
      })
    })
  }

  async connectionToSocketRoom (userId: string, socket: Socket): Promise<void> {
    if (userId) {
      this.userSocketMap.set(socket.id, userId)
    }

    const conversations: IConversation[] = await conversationController.getAllConversationsForUser(userId)

    for (const conversation of conversations) {
      await socket.join(conversation.id.toString())
    }
  }

  async leaveAllRooms (socketId: string): Promise<void> {
    const userId = this.userSocketMap.get(socketId)

    if (userId) {
      const conversations: IConversation[] = await conversationController.getAllConversationsForUser(userId)

      for (const conversation of conversations) {
        this.io.to(conversation.id.toString()).socketsLeave(socketId)
      }

      this.userSocketMap.delete(socketId)
    }
  }

  addMessageEvent (conversationId: string, message: IMessage): void {
    this.io.to(conversationId).emit('newMessage', {
      message
    })
  }

  editedMessageEvent (conversationId: string, message: IMessage): void {
    this.io.to(conversationId).emit('messageEdited', {
      message
    })
  }

  addConversationEvent (conversationId: string, conversation: IConversation): void {
    this.io.to(conversationId).emit('newConversation', {
      conversation
    })
  }

  deleteConversationEvent (conversationId: string): void {
    this.io.emit('conversationDeleted', {
      conversation: {
        _id: conversationId
      }
    })
  }

  seenConversationEvent (conversationId: string): void {
    this.io.to(conversationId).emit('conversationSeen', {
      conversation: {
        _id: conversationId
      }
    })
  }

  addReactionEvent (conversationId: string, message: IMessage): void {
    this.io.to(conversationId).emit('reactionAdded', {
      message
    })
  }

  deleteMessageEvent (conversationId: string, messageId: string): void {
    this.io.to(conversationId).emit('messageDeleted', {
      message: {
        _id: messageId
      }
    })
  }

  listenRoomChanged (): void {
    this.io.of('/').adapter.on('create-room', (room) => {
      console.log(`room ${room} was created`)
    })

    this.io.of('/').adapter.on('join-room', (room, id) => {
      console.log(`socket ${id} has joined room ${room}`)
    })

    this.io.of('/').adapter.on('leave-room', (room, id) => {
      console.log(`socket ${id} has left room ${room}`)
    })

    this.io.of('/').adapter.on('delete-room', (room) => {
      console.log(`room ${room} was deleted`)
    })
  }
}
