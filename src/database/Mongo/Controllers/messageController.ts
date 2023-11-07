import { Request, Response } from "express";
import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";

const Message = require("../Models/MessageModel");

async function createMessage(req: Request, res: Response) {
  try {
    const { conversationId, from, content, replyTo, edited, deleted } = req.body;
    const { error } = JoiRequestValidatorInstance.validate(req);

    if(error)
      return res.status(400).json({error: error});

    const newMessage = new Message({
      conversationId: conversationId,
      from: from,
      content: content,
      postedAt: new Date(),
      replyTo: replyTo,
      edited: edited,
      deleted: deleted,
      reactions: null
    })
    newMessage.save();

    return res.status(200).send(newMessage);
  }
  catch(error) {
    return res.status(500).send("Internal Server Error" + error);
  }
};

module.exports = {
  createMessage
}