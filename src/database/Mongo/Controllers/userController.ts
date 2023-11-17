import config from '../../../config'
import { type IUser } from '../Models/UserModel'

const User = require('../Models/UserModel')
const pictures = require('../../../pictures')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createUser (username: string, password: string): Promise<IUser> {
  try {
    const user = await User.findOne({ username })
    if (user) {
      const pwdCorrect = await bcrypt.compare(password, user.password)
      if (pwdCorrect) {
        return user
      }
      userLogin.user._id = user._id
    } else {
      const hash = await bcrypt.hash(password, 5)
      const user = new User({ username, password: hash, profilePic: pictures.pickRandom() })
      user.save()
      userLogin.newUser = true
      userLogin.user._id = user._id
    }

    const token = jwt.sign({ userId: userLogin.user._id }, config.SECRET_JWT_KEY, { expiresIn: config.EXPIRE_TOKEN_TIME ?? '24h' })
    userLogin.token = token

    return res.status(200).json(userLogin)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

const getUserByName = async (username: string): Promise<any> => User.findOne({ username })
const getUserById = async (id: string): Promise<any> => User.findOne({ _id: id })
const getUsersByIds = async (ids: string[]): Promise<any> => User.find({ _id: { $in: ids } })

module.exports = {
  createUser,
  getUserByName,
  getUserById,
  getUsersByIds
}
