import { Request, Response } from "express";

const User = require("../Models/UserModel");
const pictures = require("../../../pictures");
const bcrypt = require('bcrypt');

async function createUser(req: Request, res: Response) {
  try {

    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { username, password } = req.body;

    let hash = await bcrypt.hash(password, 5);
    const newUser = new User({username: username, password: hash, profilePic: pictures.pickRandom()});
    newUser.save();

    res.status(200).send(newUser);
  }
  catch(error) {
    console.log(error);
  }
}

module.exports = {
  createUser
}