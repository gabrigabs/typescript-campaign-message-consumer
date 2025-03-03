import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

class MongoDB {
  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb.uri);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Error connecting to MongoDB', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB', { error });
      throw error;
    }
  }
}

export default new MongoDB();
