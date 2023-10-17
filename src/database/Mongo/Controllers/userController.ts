import {Response} from "express";

const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');

async function signup(req:Request, res:Response)
{
    if(req.body) {
        try {
            let hash = await bcrypt.hash(req.body.password, 5);
            const userEmail = req.body.email
            let newUser = await new User({email: userEmail, password: hash});
            newUser = await newUser.save()
            res.status(200).send(newUser);
        } catch (error) {
            res.status(500).send(`An error occurred while creating the user: ${error.message}`);
        }
    } else{
        res.status(500).send('An error occurred while creating the user: ' + Error.toString());
    }
}

async function login(req:Request, res:Response)
{
    if(req.body) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user || !user.email)
                return res.status(404).json("User not found.");

            let pwdCorrect = await bcrypt.compare(req.body.password, user.password);

            if (!pwdCorrect)
                return res.status(400).json("Incorrect password.");

            const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "24h"});
            res.status(200).json({userId: user._id, token: token});
        } catch (error) {
            res.status(500).send('An error occurred while sign in: ' + error.message);
        }
    } else{
        res.status(500).send('An error occurred while creating the user: ' + Error.toString());
    }

}

module.exports = {signup: signup, login: login};