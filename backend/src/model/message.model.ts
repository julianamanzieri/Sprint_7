import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  id: { type: String, required: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
