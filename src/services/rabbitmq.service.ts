import { connect, Channel, ChannelModel } from 'amqplib';
import { MessageDTO } from '../dtos/message.dto';
import messageService from './message.service';
import config from '../config';
import logger from '../utils/logger';

class RabbitMQService {
  private connection: ChannelModel;
  private channel: Channel;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  async connect(): Promise<void> {
    try {
      this.connection = await connect(config.rabbitmq.url);

      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error', { error: err });
        this.scheduleReconnect();
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.scheduleReconnect();
      });

      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(config.rabbitmq.queue, {
        durable: true,
      });

      await this.channel.prefetch(1);

      logger.info('Connected to RabbitMQ');
    } catch (error) {
      logger.error('Error connecting to RabbitMQ', { error });
      this.scheduleReconnect();
      throw error;
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(async () => {
        try {
          logger.info('Attempting to reconnect to RabbitMQ');
          await this.connect();
          if (this.connection && this.channel) {
            await this.startConsuming();
          }
          this.reconnectTimeout = null;
        } catch (error) {
          logger.error('Failed to reconnect to RabbitMQ', { error });
        }
      }, 5000);
    }
  }

  async startConsuming(): Promise<void> {
    if (!this.channel) {
      throw new Error('Cannot consume: RabbitMQ channel not established');
    }

    logger.info(
      `Starting to consume messages from queue: ${config.rabbitmq.queue}`,
    );

    await this.channel.consume(config.rabbitmq.queue, async (msg) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const campaignMessage: MessageDTO = JSON.parse(content);
        await messageService.createMessage(campaignMessage);

        this.channel?.ack(msg);
      } catch (error) {
        logger.error('Error processing message', { error });

        if (this.channel) {
          this.channel.nack(msg, false, true);
        }
      }
    });
  }
}

export default new RabbitMQService();
