import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default {
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://root:root@localhost:27017/campaigns',
    dbName: process.env.MONGODB_DB_NAME || 'campaigns',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'campaign_messages',
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'campaigns',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    ssl: process.env.POSTGRES_SSL === 'true',
  },
  app: {
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};
