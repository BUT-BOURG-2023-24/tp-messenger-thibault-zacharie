import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'
import config from '../../../config'

const User = require('../Models/UserModel')
const pictures = require('../../../pictures')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createUser (req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (user) { return res.status(400).send('User already exist') }

    const { error } = JoiRequestValidatorInstance.validate(req)

    if (error) { return res.status(400).json({ error }) }

    const hash = await bcrypt.hash(password, 5)
    const newUser = new User({ username, password: hash, profilePic: pictures.pickRandom() })
    newUser.save()

    return res.status(200).send(newUser)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

async function getUserByName (req: Request, res: Response): Promise<Response> {
  try {
    const { username } = req.params

    const user = await User.findOne({ username }).catch(() => res.status(500).send("User don't exist"))

    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

async function getUserById (req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params

    const user = await User.findOne({ _id: id }).catch(() => res.status(500).send("User don't exist"))

    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

async function login (req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body

    if (!req.body || !username || !password) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const user = await User.findOne({ username }).catch(() => res.status(500).send('Internal error'))
    if (!user) {
      return res.status(400).send('User not found')
    }

    const pwdCorrect = await bcrypt.compare(password, user.password)
    if (!pwdCorrect) {
      return res.status(400).send('Incorrect password')
    }

    const token = jwt.sign({ userId: user._id }, config.SECRET_JWT_KEY, { expiresIn: config.EXPIRE_TOKEN_TIME ?? '1h' })

    return res.status(200).json({ userId: user._id, token })
  } catch (error) {
    return res.status(500).send(error)
  }
};

async function getUsersByIds (req: Request, res: Response): Promise<Response> {
  try {
    const { ids } = req.body

    if (!req.body || !ids) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const users = await User.find({ _id: { $in: ids } }).catch((error: Error) => res.status(500).json({ error }))

    return res.status(200).send(users)
  } catch (error) {
    return res.status(500).json({ 'Interval Server Error': error })
  }
};

async function getUsers (req: Request, res: Response): Promise<Response> {
  try {
    const users = await User.find()

    return res.status(200).send(users)
  } catch (error) {
    return res.status(500).json({ 'Interval Server Error': error })
  }
}

module.exports = {
  createUser,
  getUserByName,
  getUserById,
  login,
  getUsersByIds,
  getUsers
}
