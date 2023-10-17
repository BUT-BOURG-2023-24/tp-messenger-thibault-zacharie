import { Request, Response } from "express";

async function createMessage(req: Request, res: Response) {
  try {
    const { conversationId, from, content } = req.body;
  }
  catch(error) {
    return res.status(500).send("Internal Server Error");
  }
};