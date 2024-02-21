import { Request, Response } from 'express';
import MessageRepository from '../repositories/message.repository';
import ChatRoomRepository from '../repositories/chatRoom.repository';

class MessageController {
  private messageRepository: MessageRepository;
  private chatRoomRepository: ChatRoomRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.chatRoomRepository = new ChatRoomRepository();
    this.addMessage = this.addMessage.bind(this);
    this.listMessagesByChatId = this.listMessagesByChatId.bind(this);
  }

  // POST /message - Adiciona uma nova mensagem
  public async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, senderId, text } = req.body;

      const newMessage = await this.messageRepository.addMessage(
        chatId,
        senderId,
        text
      );
      console.log(newMessage, 'controller');
      res.status(201).json({
        message: 'Message added successfully',
        data: newMessage
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  // GET /messages/:chatId - Lista mensagens de uma sala de chat
  public async listMessagesByChatId(
    req: Request,
    res: Response
  ): Promise<void> {
    console.log('messages controller');
    try {
      const { chatId } = req.params;

      const messages =
        await this.messageRepository.listMessagesByChatId(chatId);
      console.log(chatId, messages, 'trylistmessagecontroller');
      if (messages.length > 0) {
        res.status(200).json(messages);
      } else {
        res.status(200).json({ message: 'No hay message' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export default new MessageController();
