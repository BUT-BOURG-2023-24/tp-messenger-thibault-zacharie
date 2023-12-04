import { type IUser } from './userModel'
const User = require('./userModel')
const bcrypt = require('bcrypt')
const pictures = require('../../pictures')

async function createUser (username: string, password: string): Promise<{ user: IUser, isNew: boolean }> {
  try {
    const user = await User.findOne({ username })
    if (user) {
      const isPwdCorrect = await bcrypt.compare(password, user.password)
      if (isPwdCorrect) return { user, isNew: false }
      else reportError('\'Incorrect password for existing user\'')
    }

    const hash = await bcrypt.hash(password, 5)
    const newUser = new User({ username, password: hash, profilePic: pictures.pickRandom() })
    await newUser.save()
    return { user: newUser, isNew: true }
  } catch (error) {
    throw new Error('Failed to create user')
  }
}

const getUserByName = async (username: string): Promise<IUser> => User.findOne({ username })
const getUserById = async (id: string): Promise<IUser> => User.findOne({ _id: id })
const getUsersByIds = async (ids: string[]): Promise<IUser> => User.find({ _id: { $in: ids } })

module.exports = {
  createUser,
  getUserByName,
  getUserById,
  getUsersByIds
}
