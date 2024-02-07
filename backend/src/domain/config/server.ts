import express, { Application } from 'express';
import { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import cors from 'cors';
import { connectDBMySQL } from '../../bd/config.sql';
import config from '.';

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
  private rooms: Record<string, { members: string[] }>;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.server = createServer(this.app);
    this.io = new IOServer(this.server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    this.rooms = {};
    this.configureSocket();
  }

  private async dbConnect() {
    await connectDBMySQL();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(logger);
  }

  private configureSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('A user has connected');

      socket.on('create_room', (roomName) => {
        this.rooms[roomName] = { members: [] };
        socket.join(roomName);
        this.io.emit('room_list', Object.keys(this.rooms));
      });

      socket.on('request_room_list', () => {
        socket.emit('room_list', Object.keys(this.rooms));
      });

      socket.on('join_room', (room: string) => {
        if (!this.rooms[room]) {
          socket.emit(`error`, ` La sala ${room} no existe`);
          return;
        }
        socket.join(room);
        console.log(`User has joined the room ${room}`);
      });

      socket.on('chat_message', ({ room, message, userName }) => {
        this.io.to(room).emit('chat_message', { userName, message });
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
    this.listen();
  }
}

export default Server;
