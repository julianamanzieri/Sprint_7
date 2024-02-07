import mongoose from 'mongoose';
import config from '../domain/config';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDB as string);
    console.log('MongoDB Connected 🚀');
  } catch (error) {
    console.log(error);
  }
};
