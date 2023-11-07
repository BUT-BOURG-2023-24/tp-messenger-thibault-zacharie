import mongoose, { Schema, type Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  password: string
  profilePic: string
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    required: true
  }
})

const UserModel = mongoose.model<IUser>('User', userSchema)

module.exports = UserModel
