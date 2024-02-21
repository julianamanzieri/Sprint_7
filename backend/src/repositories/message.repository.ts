import Message from '../model/message.model';
import ChatRoom from '../model/chatRoom.model';

class MessageRepository {
  // Adicionar uma nova mensagem
  async addMessage(chatId: string, senderId: string, text: string) {
    console.log('repo', 'addMessage');
    const chatRoom = await ChatRoom.findById(chatId);
    console.log(chatRoom, 'addMessage');
    if (!chatRoom) {
      throw new Error('The room does not exist');
    }
    // let newMessage = Array.isArray(chatRoom.newMessage);

    const newMessage = new Message({
      chatId: chatId,
      senderId: senderId,
      text: text,
      createdAt: new Date()
    });
    console.log(newMessage, 'newMessageAddMessage');

    await newMessage.save();

    // Adiciona o ID da nova mensagem ao array de mensagens da sala de chat
    chatRoom.messages.push(newMessage._id);
    await chatRoom.save(); // Salva a sala de chat com a referência da nova mensagem

    return newMessage;
  }

  // Listar mensagens de uma sala de chat
  async listMessagesByChatId(chatId: string) {
    console.log('messages repo', chatId);
    const messages = await Message.find({ chatId: chatId }).sort({
      createdAt: -1
    });
    // const messages = await Message.find({ chatId: chatId });

    console.log(messages);
    if (!messages) {
      throw new Error('Unable to find messages for this chat room');
    }
    return messages;
  }
}

export default MessageRepository;
