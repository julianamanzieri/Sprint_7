import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  // id: string;
  userName: string;
  password?: string;
  token?: string;
  createdAt?: Date;
  lastActive?: Date;
}

const UserSchema: Schema = new Schema({
  // id: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  astActive: { type: Date, default: Date.now }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
