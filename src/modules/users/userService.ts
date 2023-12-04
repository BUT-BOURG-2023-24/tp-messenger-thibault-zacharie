import { type IUser } from './userModel'
const User = require('./userModel')
const bcrypt = require('bcrypt')
const pictures = require('../../pictures')

const createUser = async (username: string, password: string): Promise<{ user: IUser, isNew: boolean }> => {
  const user = await User.findOne({ username })

  if (user) {
    const isPwdCorrect = await bcrypt.compare(password, user.password)
    if (isPwdCorrect) return { user, isNew: false }
  }

  const hash = await bcrypt.hash(password, 5)
  const newUser = new User({ username, password: hash, profilePic: pictures.pickRandom() })
  await newUser.save()
  return { user: newUser, isNew: true }
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
