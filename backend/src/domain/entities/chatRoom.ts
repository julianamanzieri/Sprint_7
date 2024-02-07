import { Message } from './message';

export interface ChatRoom {
  id: string; // Um identificador único para a sala de chat.
  name: string; // O nome da sala de chat, possivelmente escolhido pelo criador ou por padrão.
  members: string[]; // Uma lista de identificadores de usuários que são membros da sala.
  createdAt: Date; // A data e hora em que a sala de chat foi criada.
  messages?: Message[]; // Uma lista opcional de mensagens associadas à sala de chat.
  createdBy: string; // O identificador do usuário que criou a sala de chat.
}
