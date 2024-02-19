import express, { Application } from 'express';
import { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import cors from 'cors';
import { connectDB } from '../bd/config.mongo';
import config from '.';

import routerUsers from '../routes/user.routes';
import routerChatRooms from '../routes/chatRoom.routes';
import routerMessages from '../routes/message.routes';

import UserRepository from '../repositories/user.repository';
import ChatRoomRepository from '../repositories/chatRoom.repository';
import MessageRepository from '../repositories/message.repository';
// import Message from '../model/message.model';

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`
        ${req.method} 
        ${req.url} 
        ${req.ip}`);
  next();
};

class Server {
  private app: Application;
  private server: ReturnType<typeof createServer>;
  private io: IOServer;
  private port: string | number;
  private path = {
    users: '/users',
    chatRooms: '/chatrooms',
    messages: '/messages'
  };
  private rooms: Record<string, { members: string[] }>;
  private userRepository = new UserRepository();
  private chatRoomRepository = new ChatRoomRepository();
  private messageRepository = new MessageRepository();

  constructor() {
    this.app = express();
    this.port = config.port;
    this.server = createServer(this.app);
    this.io = new IOServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    this.rooms = {};
    this.configureSocket();
  }

  private async dbConnect() {
    await connectDB();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(logger);
  }

  routes() {
    this.app.use(this.path.users, routerUsers);
    this.app.use(this.path.chatRooms, routerChatRooms);
    this.app.use(this.path.messages, routerMessages);
  }

  private configureSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('A user has connected');
      // console.log(socket);
      socket.on('create_room', async (roomName: string) => {
        try {
          const newChatRoom = await this.chatRoomRepository.createChatRoom(
            roomName,
            'userID'
          );
          this.rooms[newChatRoom.name] = { members: [] };
          socket.join(newChatRoom.name);
          this.io.emit('room_list', Object.keys(this.rooms));
        } catch (error) {
          console.error('Error creating room:', error);
          socket.emit('error');
        }
      });

      socket.on('request_room_list', async () => {
        try {
          const rooms = await this.chatRoomRepository.showChatRoomsList();
          socket.emit(
            'room_list',
            rooms.map((room) => room.name)
          ); // Assume que cada sala tem uma propriedade 'name'
        } catch (error) {
          console.error('Error fetching room list:', error);
          socket.emit('error', 'Failed to fetch room list');
        }
      });

      // Unifica os manipuladores de evento join_room
      socket.on('join_room', async (roomId: string) => {
        // Verifica se a sala existe
        if (!this.rooms[roomId]) {
          console.log(`The room ${roomId} doesn't exist`);
          socket.emit('error', `The room ${roomId} doesn't exist`);
          return;
        }
        // O usuário se junta à sala
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Notifica outros usuários na sala
        socket.to(roomId).emit('user_joined', { userId: socket.id, roomId });

        // Busca e envia as mensagens anteriores da sala
        try {
          const messages =
            await this.messageRepository.listMessagesByChatId(roomId);
          socket.emit('previous_messages', messages);
        } catch (error) {
          console.error('Error fetching previous messages:', error);
          socket.emit('error', 'Failed to fetch previous messages');
        }
      });

      socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        this.io.to(roomId).emit('user_left', { userId: socket.id, roomId });
      });

      socket.on('chat_message', ({ room, message, userName }) => {
        this.io.to(room).emit('chat_message', { userName, message });
      });

      socket.on(
        'send_message',
        async (messageDetails: {
          chatId: string;
          senderId: string;
          text: string;
        }) => {
          try {
            const newMessage = await this.messageRepository.addMessage(
              messageDetails.chatId,
              messageDetails.senderId,
              messageDetails.text
            );
            // const newMessage = new Message({
            //   // Aqui você usa o modelo `Message` que importou
            //   chatId: messageDetails.chatId,
            //   senderId: messageDetails.senderId,
            //   text: messageDetails.text
            // });
            await newMessage.save();
            this.io.to(messageDetails.chatId).emit('new_message', newMessage);
          } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
          }
        }
      );

      socket.on('disconnect', () => {
        console.log('A user has disconnected');
      });
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}...`);
    });
  }

  public async init() {
    await this.dbConnect();
    this.middlewares();
    this.routes();
    this.configureSocket();
    this.listen();
  }
}

export default Server;
