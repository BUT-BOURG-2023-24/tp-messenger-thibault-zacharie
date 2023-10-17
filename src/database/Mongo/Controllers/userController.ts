import { Request, Response } from "express";

const User = require("../Models/UserModel");
const pictures = require("../../../pictures");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!req.body || !username || !password) {
      return res.status(400).send("Invalid request body");
    }

    const user = await User.findOne({username: username});
    if(user) {
      return res.status(400).send("User already exist");
    }

    let hash = await bcrypt.hash(password, 5);
    const newUser = new User({username: username, password: hash, profilePic: pictures.pickRandom()});
    newUser.save();

    res.status(200).send(newUser);
  }
  catch(error) {
    res.status(500).send("Internal Server Error");
  }
}

async function getUserByName(req: Request, res: Response) {
  try {
    const { username } = req.params;

    if (!req.body || !username) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const user = await User.findOne({username: username}).catch(() => res.status(500).send("User don't exist"));

    res.status(200).send(user);
  }
  catch(error) {
    res.status(500).send("Internal Server Error");
  }
}

async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    console.log(id);

    if (!req.body || !id) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const user = await User.findOne({_id: id}).catch(() => res.status(500).send("User don't exist"));

    res.status(200).send(user);
  }
  catch(error) {
    res.status(500).send("Internal Server Error");
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!req.body || !username || !password) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const user = await User.findOne({username: username}).catch(() => res.status(500).send("Internal error"));
    if(!user) {
      res.status(400).send("User not found")
    }

    let pwdCorrect = await bcrypt.compare(password, user.password)
    if(!pwdCorrect) {
      return res.status(400).send("Incorrect password");
    }

    const token = jwt.sign({userId: user._id}, 'jXp0ZVTyKIMdvzgOnb45Ig', {expiresIn: "1h"});

    res.status(200).json({userId: user._id, token: token});
  }
  catch(error) {
    res.status(500).send("Error : " + error)
  }
};

module.exports = {
  createUser,
  getUserByName,
  getUserById,
  login
}
