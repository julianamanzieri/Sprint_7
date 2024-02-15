import Message from '../model/message.model';

class MessageRepository {
  // Adicionar uma nova mensagem
  async addMessage(chatId: string, senderId: string, text: string) {
    const newMessage = new Message({
      chatId: chatId,
      senderId: senderId,
      text: text,
      createdAt: new Date()
    });

    await newMessage.save();

    if (!newMessage) {
      throw new Error('Unable to add message');
    }

    return newMessage;
  }

  // Listar mensagens de uma sala de chat
  async listMessagesByChatId(chatId: string) {
    const messages = await Message.find({ chatId: chatId }).sort({
      createdAt: -1
    });
    if (!messages) {
      throw new Error('Unable to find messages for this chat room');
    }
    return messages;
  }
}

export default MessageRepository;
