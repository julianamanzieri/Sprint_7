import mongoose, { Document, Schema } from 'mongoose';

interface IChatRoom extends Document {
  // id: string;
  name: string;
  members: string[];
  createdAt: Date;
  messages: string[];
  createdBy: string;
}

const ChatRoomSchema: Schema = new Schema({
  // id: { type: String, required: false },
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: String, required: true }],
  createdBy: { type: String, required: true }
});

const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
