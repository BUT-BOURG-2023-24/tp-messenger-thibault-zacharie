import { Request, Response, NextFunction } from "express";

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

	const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
	const userId = decodedToken.userId;

	if (req.body.userId && req.body.userId !== userId) 
	{
		return res.status(401).json({error:'Invalid token!'});
	}
  
  res.userId = userId;
  
	next();
}

module.exports = {
  checkAuth,
}