export class UserConversationResponse {
  public _id: string
  public username: string
  public password: string
  public profilePicture: string

  constructor (_id: string, username: string, password: string, profilePicture: string) {
    this._id = _id
    this.username = username
    this.password = password
    this.profilePicture = profilePicture
  }
}

export class MessageConversationResponse {
  public _id: string
  public conversationId: string
  public from: string
  public content: string
  public postedAt: Date
  public replyTo: string | null
  public edited: boolean
  public deleted: boolean
  public reactions: Map<string, string> | null

  constructor (_id: string, conversationId: string, from: string, content: string, postedAt: Date, replyTo: string | null, edited: boolean, deleted: boolean, reactions: Map<string, string> | null) {
    this._id = _id
    this.conversationId = conversationId
    this.from = from
    this.content = content
    this.postedAt = postedAt
    this.replyTo = replyTo
    this.edited = edited
    this.deleted = deleted
    this.reactions = reactions
  }
}

export class ConversationResponse {
  public _id: string
  public participants: UserConversationResponse[]
  public messages: MessageConversationResponse[]
  public title: string
  public lastUpdate: Date
  public seen: Map<string, string>

  constructor (_id: string, participants: UserConversationResponse[], messages: MessageConversationResponse[], title: string, lastUpdate: Date, seen: Map<string, string>) {
    this._id = _id
    this.participants = participants
    this.messages = messages
    this.title = title
    this.lastUpdate = lastUpdate
    this.seen = seen
  }
}
