import { Message } from '../../domain/entities/message';
import { User } from '../../domain/entities/user';
import { ChatRoom } from '../../domain/entities/chatRoom';
import { ChatRepository } from '../../infrastructure/repositories/chatRepository';

export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async postRegisterUser(user: User): Promise<User | null> {
    try {
      const newUser = await this.chatRepository.postRegisterUser(user);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration method error');
    }
  }

  async postLoginUser(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const loggedUser = await this.chatRepository.postLoginUser(
        username,
        password
      );
      return loggedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login method error');
    }
  }

  async postChatRoom(chatRoom: ChatRoom): Promise<ChatRoom | null> {
    try {
      const newChatRoom = await this.chatRepository.postChatRoom(chatRoom);
      return newChatRoom;
    } catch (error) {
      console.error('Create chat room error:', error);
      throw new Error('Create chat room method error');
    }
  }

  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const chatRooms = await this.chatRepository.getChatRooms();
      return chatRooms;
    } catch (error) {
      console.error('Get chat rooms error:', error);
      throw new Error('Get chat rooms method error');
    }
  }

  async postJoinChatRoom(userId: string, roomId: string): Promise<void> {
    try {
      await this.chatRepository.postJoinChatRoom(userId, roomId);
    } catch (error) {
      console.error('Join chat room error:', error);
      throw new Error('Join chat room method error');
    }
  }

  async getChatRoomDetails(roomId: string): Promise<ChatRoom | null> {
    try {
      const chatRoomDetails =
        await this.chatRepository.getChatRoomDetails(roomId);
      return chatRoomDetails;
    } catch (error) {
      console.error('Get chat room details error:', error);
      throw new Error('Get chat room details method error');
    }
  }

  async postMessage(roomId: string, message: Message): Promise<Message | null> {
    try {
      const messageSaved = await this.chatRepository.postMessage(
        roomId,
        message
      );
      return messageSaved;
    } catch (error) {
      console.error('Post message error:', error);
      throw new Error('Post message method error');
    }
  }

  async getMessages(roomId: string): Promise<Message[] | null> {
    try {
      const messages = await this.chatRepository.getMessages(roomId);
      return messages;
    } catch (error) {
      console.error('Get messages error:', error);
      throw new Error('Get messages method error');
    }
  }
}
