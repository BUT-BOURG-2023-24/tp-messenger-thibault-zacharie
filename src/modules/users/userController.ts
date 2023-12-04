import config from '../../config'
import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

const userService = require('./userService')

async function createUser (req: Request, res: Response): Promise<any> {
  try {
    const { username, password } = req.body

    const { user, isNew } = await userService.createUser(username, password)

    const token = jwt.sign({ userId: user._id }, config.SECRET_JWT_KEY, { expiresIn: config.EXPIRE_TOKEN_TIME ?? '24h' })

    return res.status(200).send({
      user: { _id: user._id, name: user.username },
      token,
      isNewUser: isNew
    })
  } catch (error) {
    res.status(500).json({ 'Internal Server Error': error })
  }
}

async function getOnlineUsers (req: Request, res: Response): Promise<any> {
  try {
    return res.status(200).send(
      req.body
    )
  } catch (error) {
    res.status(500).json({ 'Internal Server Error': error })
  }
}

module.exports = {
  createUser,
  getOnlineUsers
}
