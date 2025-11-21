import mongoose from 'mongoose';
import { config } from '../config';

const MONGODB_URI = config.mongo_uri;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected to:', MONGODB_URI.replace(/\/\/.*@/, '//***@')); // Fshi credentials për siguri
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
