import mongodb from './db/mongo.db';
import postgresdb from './db/postgres.db';
import rabbitmqService from './services/rabbitmq.service';
import logger from './utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Starting campaign message consumer service...');
    await mongodb.connect();
    await postgresdb.connect();

    await rabbitmqService.connect();
    await rabbitmqService.startConsuming();

    logger.info('Campaign message consumer service started successfully');
  } catch (error) {
    logger.error('Error starting service', { error });
    process.exit(1);
  }
}

main();
