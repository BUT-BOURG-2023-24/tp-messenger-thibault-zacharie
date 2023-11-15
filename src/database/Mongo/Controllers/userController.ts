import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'
import config from '../../../config'

const User = require('../Models/UserModel')
const pictures = require('../../../pictures')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * description : function which check if user exist, if yes login it and if no create an account
 * @returns user, token and if its a new user or not
 */
async function createUser (req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body
    const userLogin: { user: { _id: string, name: string }, token: string, newUser: boolean } = {
      user: { _id: '', name: username },
      token: '',
      newUser: false
    }

    const { error } = JoiRequestValidatorInstance.validate(req)
    if (error) { return res.status(400).json({ error }) }

    const user = await User.findOne({ username })
    if (user) {
      const pwdCorrect = await bcrypt.compare(password, user.password)
      if (!pwdCorrect) {
        return res.status(400).send('Incorrect password')
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
