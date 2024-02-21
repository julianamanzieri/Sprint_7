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

      // socket.on('join_room', async (roomName: string) => {
      //   console.log(`Intento de unirse a la sala: ${roomName}`);

      //   try {
      //     // Verifica si la sala existe usando el nombre
      //     const room = await this.chatRoomRepository.findRoomByName(roomName);

      //     if (!room) {
      //       console.log(`La sala ${roomName} no existe`);
      //       socket.emit('error', `La sala ${roomName} no existe`);
      //       return;
      //     }

      //     // Si la sala existe, une al usuario a la sala usando el nombre como identificador
      //     socket.join(roomName);
      //     console.log(`Usuario ${socket.id} se ha unido a la sala ${roomName}`);

      //     // Recupera y emite los mensajes existentes de la sala
      //     const messages = await this.messageRepository.listMessagesByChatId(
      //       room._id.toString()
      //     );
      //     console.log(messages, 'messagesserver');
      //     socket.emit('existing_messages', messages);
      //   } catch (error) {
      //     console.error(`Error al unirse a la sala ${roomName}:`, error);
      //     socket.emit('error', 'Ocurrió un error al intentar unirse a la sala');
      //   }
      // });

      socket.on('join_room', async (roomName: string) => {
        // Verifica se a sala existe usando o nome
        const room = await this.chatRoomRepository.findRoomByName(roomName);

        if (!room) {
          console.log(`The room ${roomName} does not exist`);
          socket.emit('error', `The room ${roomName} not exist`);
          return;
        }
        // Se a sala existir, junte o usuário à sala usando o nome como identificador
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);
        try {
          // socket.join(roomName);
          const messages = await this.messageRepository.listMessagesByChatId(
            room._id.toString()
          );
          console.log(messages, 'messagesserver');

          socket.emit('existing_messages', messages);
        } catch (error) {
          console.error('Error fetching previous messages:', error);
          socket.emit('error', 'Failed to fetch previous messages');
        }
      });

      socket.on('chat_message', async ({ room, message, userName }) => {
        try {
          // Encontre a sala pelo nome para obter o ObjectId
          const roomObj = await this.chatRoomRepository.findRoomByName(room);
          if (!roomObj) {
            console.error('Room not found');
            socket.emit('error', 'Room not found');
            return;
          }

          // Substitua '' por um identificador válido do usuário
          if (!userName) {
            console.error('senderId is required');
            socket.emit('error', 'senderId is required');
            return;
          }

          // Método para obter o ID do usuário pelo userName
          const user = await this.userRepository.findUserByUserName(userName);
          if (!user) {
            console.error('User not found');
            socket.emit('error', 'User not found');
            return;
          }

          // Agora que tem o ID do usuário, pode salvar a mensagem com todos os campos necessários
          await this.messageRepository.addMessage(
            roomObj._id,
            user._id,
            message
          );

          // Agora que tem o ID do usuário, pode salvar a mensagem com todos os campos necessários
          // await this.messageRepository.addMessage(room, userName, message);

          // Emitir a mensagem para a sala
          this.io.to(room).emit('chat_message', { userName, message });
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('error', 'Failed to save message');
        }
      });

      // socket.on('send_message', async ({ chatId, senderId, text }) => {
      //   try {
      //     const newMessage = await this.messageRepository.addMessage(
      //       chatId,
      //       senderId,
      //       text
      //     );
      //     this.io.to(chatId).emit('new_message', newMessage);
      //   } catch (error) {
      //     console.error('Error sending message:', error);
      //     socket.emit('error', 'Failed to send message');
      //   }
      // });

      // socket.on('listMessagesByChatId', async (chatId: string) => {
      //   try {
      //     const messages =
      //       await this.messageRepository.listMessagesByChatId(chatId);
      //     socket.emit('chat_messages', messages);
      //   } catch (error) {
      //     console.error('Error fetching messages:', error);
      //     socket.emit('error', 'Failed to fetch messages');
      //   }
      // });

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
