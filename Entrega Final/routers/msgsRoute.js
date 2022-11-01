import express from "express";
import { getMessages, getOwnMsgs, createMessage } from "../controllers/messagesController.js";
const { Router } = express;
const messagesRouter = Router()

export default messagesRouter;

messagesRouter.get('/', getMessages);
messagesRouter.get('/:alias', getOwnMsgs)
messagesRouter.post('/', createMessage);