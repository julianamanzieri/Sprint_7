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
      socket.on('create_room', (roomName) => {
        this.rooms[roomName] = { members: [] };
        socket.join(roomName);
        this.io.emit('room_list', Object.keys(this.rooms));
      });

      // socket.on('create_room', async (roomDetails) => {
      //   console.log('Create room');
      //   try {
      //     const newRoom = await this.chatRoomRepository.createChatRoom(
      //       roomDetails.name,
      //       roomDetails.createdBy,
      //       roomDetails.members
      //     );
      //     console.log('Create romm', newRoom);
      //     this.io.emit('room_created', newRoom);
      //   } catch (error) {
      //     console.error('Error creating room:', error);
      //     socket.emit('error', 'Failed to create room');
      //   }
      // });

      socket.on('request_room_list', () => {
        socket.emit('room_list', Object.keys(this.rooms));
      });

      socket.on('join_room', (room: string) => {
        if (!this.rooms[room]) {
          socket.emit(`error`, `The room ${room} doesn't exist`);
          return;
        }
        socket.join(room);
        console.log(`User has joined the room ${room}`);
      });

      socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // socket.on('join_room', (roomId) => {
      //   socket.join(roomId);
      //   this.io.to(roomId).emit('user_joined', { userId: socket.id, roomId });
      // });

      socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        this.io.to(roomId).emit('user_left', { userId: socket.id, roomId });
      });

      socket.on('chat_message', ({ room, message, userName }) => {
        this.io.to(room).emit('chat_message', { userName, message });
      });

      // socket.on('chat_message', async ({ room, message, userName }) => {
      //   // Enviar a mensagem para o banco de dados
      //   try {
      //     const newMessage = await this.messageRepository.addMessage(
      //       room,
      //       userName,
      //       message
      //     );
      //     // Emitir a nova mensagem para todos os usuários na sala
      //     this.io.to(room).emit('new_message', newMessage);
      //   } catch (error) {
      //     console.error('Error sending message:', error);
      //     socket.emit('error', 'Failed to send message');
      //   }
      // });

      socket.on('send_message', async (messageDetails) => {
        try {
          const newMessage = await this.messageRepository.addMessage(
            messageDetails.chatId,
            messageDetails.senderId,
            messageDetails.text
          );
          this.io.to(messageDetails.chatId).emit('new_message', newMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', 'Failed to send message');
        }
      });

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
