import { logger, loggerError } from "../utils/logger.js";
import MessageRepository from "../repository/messageRepository.js";
import MessageService from "../services/messageService.js";

export const messagesStorage = new MessageRepository();
export const messageService = new MessageService(messagesStorage);

export const getMessages = async (req, res) => {
    return messageService.getMsgs()
    .then(msgs => {
        res.json(msgs);
    })
    .catch(err => {res.send(err); loggerError.error(err);})
}

export const getOwnMsgs = async (req, res) => {
    const alias = req.params.alias;
    return messageService.getOwnMsgs(alias)
    .then(msgs => {
        msgs.length ? res.status(200).json(msgs) : 
        res.status(404).json({mensaje: "No han sido encontrados mensajes de este usuario"});
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    })
}

export const createMessage = async (req, res) => {
    const newMsg = req.body;
    return messageService.createMsgs(newMsg)
    .then(_ => {
        logger.info('Mensaje creado')
    })
    .catch(err => loggerError.error(err));
}