import { Message } from '../../domain/entities/message';
import { User } from '../../domain/entities/user';
import { ChatRoom } from '../../domain/entities/chatRoom';

export interface ChatRepository {
  // Registra um novo usuário e retorna os detalhes do usuário ou null se a operação falhar
  postRegisterUser(user: User): Promise<User | null>;

  // Verifica as credenciais do usuário e retorna os detalhes do usuário ou null se a operação falhar
  postLoginUser(username: string, password: string): Promise<User | null>;

  // Cria uma nova sala de chat e retorna a sala criada ou null se a operação falhar
  postChatRoom(chatRoom: ChatRoom): Promise<ChatRoom | null>;

  // Retorna uma lista de todas as salas de chat disponíveis
  getChatRooms(): Promise<ChatRoom[]>;

  // Adiciona um usuário a uma sala de chat
  postJoinChatRoom(userId: string, roomId: string): Promise<void>;

  // Retorna os detalhes de uma sala de chat específica, incluindo os participantes
  getChatRoomDetails(roomId: string): Promise<ChatRoom | null>;

  // Permite a um usuário enviar uma mensagem em uma sala de chat e retorna a mensagem enviada ou null se falhar
  postMessage(roomId: string, message: Message): Promise<Message | null>;

  // Obtém todas as mensagens de uma sala de chat específica
  getMessages(roomId: string): Promise<Message[] | null>;
}
