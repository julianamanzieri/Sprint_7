import ChatRoom from '../model/chatRoom.model';

class ChatRoomRepository {
  // Cria uma nova sala de chat
  async createChatRoom(
    name: string,
    createdBy: string,
    members: string[] = []
  ) {
    // Verifica se a sala de chat já existe
    const existingRoom = await ChatRoom.findOne({ name: name });
    if (existingRoom) {
      throw new Error(`The room ${name} is already created!`);
    }

    // Cria a sala se ela não existir
    const newChatRoom = new ChatRoom({
      name: name,
      members: members,
      createdBy: createdBy,
      messages: []
    });

    await newChatRoom.save();

    if (!newChatRoom) {
      throw new Error('Unable to create chat room');
    }

    return newChatRoom;
  }

  // Mostra lista de todas as salas de chat
  async showChatRoomsList() {
    const allRooms = await ChatRoom.find();
    return allRooms;
  }

  // Mostra detalhes de uma sala de chat pelo ID
  async showChatRoomById(chatId: string) {
    const chatRoom = await ChatRoom.findById(chatId);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }
    return chatRoom;
  }
}

export default ChatRoomRepository;
