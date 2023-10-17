import {Request, Response} from "express";

const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const pictures = require('../../../pictures')

async function createUser(req: Request, res: Response) {
    try {
        let hash = await bcrypt.hash(req.body.password, 5)
        const username = req.body.username
        let newUser = await new User({username: username, password: hash, profilePic: pictures.pickRandom()})
        newUser = await newUser.save()
        res.status(200).send(newUser);
    } catch (error) {
        res.status(500).send(`An error occurred while creating the user: ${error}`)
    }
}

async function login(req: Request, res: Response) {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user || !user.username)
            return res.status(404).json("User not found.");

        let pwdCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!pwdCorrect)
            return res.status(400).json("Incorrect password.");

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "24h"});
        res.status(200).json({userId: user._id, token: token});
    } catch (error) {
        res.status(500).send(`An error occurred while sign in: ${error}`)
    }

}

module.exports = {signup: createUser, login: login};