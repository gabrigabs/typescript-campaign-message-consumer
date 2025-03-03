import { createId } from '@paralleldrive/cuid2';
import { MessageModel } from '../models/message.model';
import logger from '../utils/logger';
import { MessageDTO } from '../dtos/message.dto';
import { Message } from '../interfaces/message.interface';

class MessageRepository {
  async saveMessage(messageData: MessageDTO): Promise<Message> {
    try {
      const message = new MessageModel({
        ...messageData,
        id: createId(),
      });

      await message.save();

      logger.info('Message saved to MongoDB', {
        id: message.id,
        campaign_id: message.campaign_id,
      });

      return message.toObject() as Message;
    } catch (error) {
      logger.error('Error saving message to MongoDB', {
        error,
        data: messageData,
      });
      throw error;
    }
  }
}

export default new MessageRepository();
