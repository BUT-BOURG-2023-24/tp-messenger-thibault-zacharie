import joiValidator from '../middleware/joiValidator'
const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController')
const auth = require('../auth')
import { Request, Response } from 'express';

router.post('/login', joiValidator, async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing.' });
    } 

    const { username, password } = req.body
    const userLogin: { user: { _id: string, name: string }, token: string, newUser: boolean } = {
      user: { _id: '', name: username },
      token: '',
      newUser: false
    }
  }
})

router.get('/online', auth.checkAuth, userController.createUser)

module.exports = router
