import { Request, Response, NextFunction } from "express";
import config from './config';

const jwt = require('jsonwebtoken');
require("dotenv/config")

interface CustomResponse extends Response {
  userId?: string;
}

function checkAuth(req: Request, res: CustomResponse, next: NextFunction)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}

	console.log(config.SECRET_JWT_KEY);
	console.log(token);

	const decodedToken = jwt.verify(token, config.SECRET_JWT_KEY);
	const userId = decodedToken.userId;

	if (req.body.userId && req.body.userId !== userId) 
	{
		return res.status(401).json({error:'Invalid token!'});
	}
  
  req.body.user = {id: userId}
  
	next();
}

module.exports = {
  checkAuth,
}