import { Request, Response } from 'express';
import ChatRoomRepository from '../repositories/chatRoom.repository';

class ChatRoomController {
  private chatRoomRepository: ChatRoomRepository;

  constructor() {
    this.chatRoomRepository = new ChatRoomRepository();
    this.createChatRoom = this.createChatRoom.bind(this);
    this.showChatRoomsList = this.showChatRoomsList.bind(this);
    this.showChatRoomById = this.showChatRoomById.bind(this);
  }

  //   POST/chatroom - cria uma sala
  public async createChatRoom(req: Request, res: Response): Promise<void> {
    try {
      console.log('controller chatrooms');
      if (!this.chatRoomRepository) {
        throw new Error(' Chat Room is not initialized');
      }

      const { name } = req.body;
      const { createdBy } = req.body;
      console.log(name, createdBy);
      const newChatRoom = await this.chatRoomRepository.createChatRoom(
        name,
        createdBy
      );
      console.log(newChatRoom, 'newChatRooom');
      res.status(200).json({ name: newChatRoom, chatRoomId: newChatRoom.id });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Room already created') {
          res.status(400).json({
            message: error.message
          });
        } else {
          console.log(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    }
  }

  //   GET/chatrooms
  async showChatRoomsList(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error('Chat room repository is not initialized');
      }

      const showChatRoomsList =
        await this.chatRoomRepository.showChatRoomsList();

      res.status(200).json(showChatRoomsList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //   GET/chatroom/:id
  async showChatRoomById(req: Request, res: Response): Promise<void> {
    try {
      if (!this.chatRoomRepository) {
        throw new Error('Chat room repository is not initialized');
      }

      const id = req.params.id;

      const showChatRoomById =
        await this.chatRoomRepository.showChatRoomById(id);
      res.status(200).json(showChatRoomById);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new ChatRoomController();
